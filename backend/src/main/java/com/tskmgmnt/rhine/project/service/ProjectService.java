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
import com.tskmgmnt.rhine.core.exception.BadRequestException;
import com.tskmgmnt.rhine.core.exception.ConflictException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
            throw new BadRequestException("You have not accepted the invitation to this project yet.");
        }

        return mapToDto(project, membership.getProjectRole().name());
    }

    public ProjectDto updateProject(Long id, String email, CreateProjectReq req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new BadRequestException("Only project admins can update project settings");
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
            throw new BadRequestException("Only project admins can delete a project");
        }

        projectRepository.delete(project);
    }

    public ProjectMemberDto inviteMember(Long projectId, String adminEmail, InviteMemberReq req) {
        ProjectMember adminMembership = projectMemberRepository.findByUserEmailAndProjectId(adminEmail, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (adminMembership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new BadRequestException("Only project admins can invite members");
        }

        Optional<ProjectMember> existingMembership = projectMemberRepository.findByUserEmailAndProjectId(req.getEmail(), projectId);
        if (existingMembership.isPresent()) {
            ProjectMember m = existingMembership.get();
            if (m.getStatus() == ProjectMemberStatus.ACTIVE) {
                throw new ConflictException("User is already a member of this project");
            } else if (m.getStatus() == ProjectMemberStatus.PENDING) {
                throw new ConflictException("An invitation is already pending for this user");
            } else {
                m.setStatus(ProjectMemberStatus.PENDING);
                m.setToken(java.util.UUID.randomUUID().toString());
                m.setProjectRole(req.getProjectRole() != null ? req.getProjectRole() : ProjectRole.PROJECT_EMPLOYEE);
                projectMemberRepository.save(m);
                mailService.sendInviteEmail(m.getUser().getEmail(), m.getProject().getName(), m.getProjectRole(), m.getToken());
                return new ProjectMemberDto(m.getUser().getEmail(), m.getUser().getName(), m.getProjectRole(), m.getId().intValue());
            }
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found. They must register first."));

        if (!user.isVerified()) {
            throw new BadRequestException("Cannot send invite to this user at this moment.");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        ProjectRole role = req.getProjectRole() != null ? req.getProjectRole() : ProjectRole.PROJECT_EMPLOYEE;
        String token = java.util.UUID.randomUUID().toString();
        ProjectMember membership = new ProjectMember(user, project, role, ProjectMemberStatus.PENDING, token);
        projectMemberRepository.save(membership);

        mailService.sendInviteEmail(user.getEmail(), project.getName(), role, token);

        return new ProjectMemberDto(user.getEmail(), user.getName(), role, membership.getId().intValue());
    }


    @Transactional
    public Long acceptInvite(String token, String requestingUserEmail) {
        logger.debug("Attempting to accept invite with token: {} for user: {}", token, requestingUserEmail);
        
        ProjectMember membership = projectMemberRepository.findByToken(token)
                .orElseThrow(() -> {
                    logger.warn("Invitation link is invalid (token not found): {}", token);
                    return new ResourceNotFoundException("This invitation link is invalid.");
                });

        String intendedEmail = membership.getUser().getEmail();
        logger.debug("Found membership for token. Intended email: {}, Requesting email: {}", intendedEmail, requestingUserEmail);

        if (!intendedEmail.equalsIgnoreCase(requestingUserEmail)) {
            logger.warn("Unauthorized attempt to accept invite. Intended: {}, Requesting: {}", intendedEmail, requestingUserEmail);
            throw new AccessDeniedException("This invitation was intended for another user account.");
        }

        if (membership.getStatus() == ProjectMemberStatus.REVOKED) {
            logger.warn("Attempted to accept a revoked invite: {}", token);
            throw new BadRequestException("Invitation has been revoked by the project admin.");
        }

        if (membership.getStatus() == ProjectMemberStatus.ACTIVE) {
            logger.info("User {} is already an active member of project {}", requestingUserEmail, membership.getProject().getId());
            throw new ConflictException("You are already active in this project.", membership.getProject().getId());
        }

        membership.setStatus(ProjectMemberStatus.ACTIVE);
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

    @Transactional
    public void removeMember(Long projectId, String adminEmail, String memberEmail) {
        validateAdminAccess(projectId, adminEmail);

        if (adminEmail.equals(memberEmail)) {
            throw new BadRequestException("You cannot remove yourself from the project");
        }

        ProjectMember memberToRemove = projectMemberRepository.findByUserEmailAndProjectId(memberEmail, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this project"));

        if (memberToRemove.getStatus() == ProjectMemberStatus.PENDING) {
            memberToRemove.setStatus(ProjectMemberStatus.REVOKED);
            projectMemberRepository.save(memberToRemove);
            logger.info("Invitation for {} in project {} has been revoked by {}", memberEmail, projectId, adminEmail);
        } else {
            List<Task> tasks = taskRepository.findByProjectIdAndAssigneeEmail(projectId, memberEmail);
            for (Task task : tasks) {
                task.setAssignee(null);
                taskRepository.save(task);
            }
            projectMemberRepository.delete(memberToRemove);
            logger.info("Member {} has been removed from project {} by {}", memberEmail, projectId, adminEmail);

            try {
                updateService.sendProjectBroadcast(projectId, "MEMBER_REMOVED");
                updateService.sendEvictionNotice(projectId, memberEmail);
                updateService.deleteUpdatesForUserInProject(memberEmail, projectId);
            } catch (Exception e) {
                logger.warn("Failed to send member removed broadcast, eviction notice, or cleanup updates: {}", e.getMessage());
            }
        }
    }

    public List<ProjectMemberDto> getMembers(Long projectId, String requestingUserEmail) {
        validateMemberAccess(projectId, requestingUserEmail);

        return projectMemberRepository.findByProjectId(projectId).stream()
                .filter(m -> m.getStatus() != ProjectMemberStatus.REVOKED)
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

    private void validateAdminAccess(Long projectId, String email) {
        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new BadRequestException("Only project admins can perform this action");
        }
    }

    private void validateMemberAccess(Long projectId, String email) {
        if (!projectMemberRepository.existsByUserEmailAndProjectId(email, projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }
    }
}
