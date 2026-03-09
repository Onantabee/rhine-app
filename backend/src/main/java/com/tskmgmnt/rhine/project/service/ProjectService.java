package com.tskmgmnt.rhine.project.service;
import com.tskmgmnt.rhine.core.service.MailService;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.repository.UserRepository;
import com.tskmgmnt.rhine.task.enums.TaskStatus;
import com.tskmgmnt.rhine.task.entity.Task;
import com.tskmgmnt.rhine.task.repository.TaskRepository;
import com.tskmgmnt.rhine.project.enums.ProjectRole;
import com.tskmgmnt.rhine.project.enums.ProjectMemberStatus;
import com.tskmgmnt.rhine.project.dto.ProjectMemberDto;
import com.tskmgmnt.rhine.project.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.project.entity.ProjectMember;
import com.tskmgmnt.rhine.project.dto.InviteMemberReq;
import com.tskmgmnt.rhine.project.dto.CreateProjectReq;
import com.tskmgmnt.rhine.project.dto.ProjectDto;
import com.tskmgmnt.rhine.project.entity.Project;
import com.tskmgmnt.rhine.project.repository.ProjectRepository;
import com.tskmgmnt.rhine.notification.service.UpdateService;
import com.tskmgmnt.rhine.core.exception.ResourceNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final MailService mailService;
    private final UpdateService updateService;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          UserRepository userRepository,
                          TaskRepository taskRepository,
                          MailService mailService,
                          UpdateService updateService) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.mailService = mailService;
        this.updateService = updateService;
    }

    public ProjectDto createProject(String ownerEmail, CreateProjectReq req) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project(req.getName(), owner);
        project = projectRepository.save(project);

        ProjectMember membership = new ProjectMember(owner, project, ProjectRole.PROJECT_ADMIN);
        projectMemberRepository.save(membership);

        owner.setLastProjectId(project.getId());
        userRepository.save(owner);

        return mapToDto(project, ProjectRole.PROJECT_ADMIN.name());
    }

    public List<ProjectDto> getProjectsForUser(String email) {
        List<Object[]> results = projectRepository.findProjectsWithMemberCountByUserEmail(email);
        return results.stream()
                .map(res -> {
                    Project p = (Project) res[0];
                    Long count = (Long) res[1];
                    ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, p.getId()).orElse(null);
                    String role = membership != null ? membership.getProjectRole().name() : ProjectRole.PROJECT_EMPLOYEE.name();
                    return mapToDto(p, role, count.intValue());
                })
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (membership.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new RuntimeException("You have not accepted the invitation to this project yet.");
        }

        return mapToDto(project, membership.getProjectRole().name());
    }

    public ProjectDto updateProject(Long id, String email, CreateProjectReq req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can update project settings");
        }

        project.setName(req.getName());
        project = projectRepository.save(project);
        return mapToDto(project, membership.getProjectRole().name());
    }

    public void deleteProject(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can delete a project");
        }

        projectRepository.delete(project);
    }

    public ProjectMemberDto inviteMember(Long projectId, String adminEmail, InviteMemberReq req) {
        ProjectMember adminMembership = projectMemberRepository.findByUserEmailAndProjectId(adminEmail, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (adminMembership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can invite members");
        }

        if (projectMemberRepository.existsByUserEmailAndProjectId(req.getEmail(), projectId)) {
            throw new RuntimeException("User is already a member of this project");
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found. They must register first."));

        if (!user.isVerified()) {
            throw new com.tskmgmnt.rhine.core.exception.BadRequestException("Cannot send invite to this user at this moment.");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectRole role = req.getProjectRole() != null ? req.getProjectRole() : ProjectRole.PROJECT_EMPLOYEE;
        String token = java.util.UUID.randomUUID().toString();
        ProjectMember membership = new ProjectMember(user, project, role, ProjectMemberStatus.PENDING, token);
        projectMemberRepository.save(membership);

        mailService.sendInviteEmail(user.getEmail(), project.getName(), role, token);

        return new ProjectMemberDto(user.getEmail(), user.getName(), role, 0);
    }


    @Transactional
    public Long acceptInvite(String token, String requestingUserEmail) {
        ProjectMember membership = projectMemberRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or revoked invitation token"));

        if (!membership.getUser().getEmail().equals(requestingUserEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized: You cannot accept an invite intended for another user.");
        }

        membership.setStatus(ProjectMemberStatus.ACTIVE);
        membership.setToken(null);
        projectMemberRepository.save(membership);

        User user = membership.getUser();
        user.setLastProjectId(membership.getProject().getId());
        userRepository.save(user);
        
        try {
            Long projectId = membership.getProject().getId();
            User admin = membership.getProject().getOwner();
            if (admin != null) {
                String message = String.format("%s Accepted invite", user.getName());
                updateService.createAndSendUpdate(projectId, admin.getEmail(), message);
            }
            updateService.sendProjectBroadcast(projectId, "MEMBER_JOINED");
        } catch (Exception e) {
            logger.warn("Failed to send accept invite update: {}", e.getMessage());
        }

        return membership.getProject().getId();
    }

    public void removeMember(Long projectId, String adminEmail, String memberEmail) {
        ProjectMember adminMembership = projectMemberRepository.findByUserEmailAndProjectId(adminEmail, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (adminMembership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can remove members");
        }

        if (adminEmail.equals(memberEmail)) {
            throw new RuntimeException("You cannot remove yourself from the project");
        }

        ProjectMember memberToRemove = projectMemberRepository.findByUserEmailAndProjectId(memberEmail, projectId)
                .orElseThrow(() -> new RuntimeException("Member not found in this project"));

        if (memberToRemove.getStatus() == ProjectMemberStatus.PENDING) {
            projectMemberRepository.delete(memberToRemove);
            return;
        }

        List<Task> tasks = taskRepository.findByProjectIdAndAssigneeEmail(projectId, memberEmail);
        for (Task task : tasks) {
            task.setAssignee(null);
            taskRepository.save(task);
        }

        projectMemberRepository.delete(memberToRemove);
        
        try {
            updateService.sendProjectBroadcast(projectId, "MEMBER_REMOVED");
            updateService.sendEvictionNotice(projectId, memberEmail);
        } catch (Exception e) {
            logger.warn("Failed to send member removed broadcast or eviction notice: {}", e.getMessage());
        }
    }

    public List<ProjectMemberDto> getMembers(Long projectId, String email) {
        if (!projectMemberRepository.existsByUserEmailAndProjectId(email, projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }

        return projectMemberRepository.findByProjectId(projectId).stream()
                .map(m -> {
                    long activeTaskCount = taskRepository.countByProjectIdAndAssigneeEmailAndTaskStatusNot(
                            projectId,
                            m.getUser().getEmail(),
                            com.tskmgmnt.rhine.task.enums.TaskStatus.CANCELLED
                    );
                     String name = m.getUser().getName();
                     if (m.getStatus() == ProjectMemberStatus.PENDING) {
                         name += " (Pending)";
                     }
                    return new ProjectMemberDto(
                            m.getUser().getEmail(),
                            name,
                            m.getProjectRole(),
                            activeTaskCount);
                })
                .collect(Collectors.toList());
    }

    public ProjectRole getUserRoleInProject(String email, Long projectId) {
        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return membership.getProjectRole();
    }

    public boolean userHasProjects(String email) {
        return projectMemberRepository.findByUserEmail(email).stream()
                .anyMatch(m -> m.getStatus() == ProjectMemberStatus.ACTIVE);
    }

    private ProjectDto mapToDto(Project project, String currentUserRole) {
        return mapToDto(project, currentUserRole, null);
    }

    private ProjectDto mapToDto(Project project, String currentUserRole, Integer memberCount) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setOwnerEmail(project.getOwner().getEmail());
        dto.setOwnerName(project.getOwner().getName());
        
        if (memberCount != null) {
            dto.setMemberCount(memberCount);
        } else {
            dto.setMemberCount(project.getMembers() != null ? 
                (int) project.getMembers().stream()
                    .filter(m -> m.getStatus() == com.tskmgmnt.rhine.project.enums.ProjectMemberStatus.ACTIVE)
                    .count() : 0);
        }
        
        dto.setCreatedAt(project.getCreatedAt());
        dto.setCurrentUserRole(currentUserRole);
        return dto;
    }
}
