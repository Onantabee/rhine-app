package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.CreateProjectReq;
import com.tskmgmnt.rhine.dto.InviteMemberReq;
import com.tskmgmnt.rhine.dto.ProjectDto;
import com.tskmgmnt.rhine.dto.ProjectMemberDto;
import com.tskmgmnt.rhine.entity.Project;
import com.tskmgmnt.rhine.entity.ProjectMember;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.enums.ProjectRole;
import com.tskmgmnt.rhine.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.repository.ProjectRepository;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final com.tskmgmnt.rhine.repository.TaskRepository taskRepository;
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          UserRepository userRepository,
                          com.tskmgmnt.rhine.repository.TaskRepository taskRepository,
                          org.springframework.mail.javamail.JavaMailSender mailSender) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.mailSender = mailSender;
    }

    public ProjectDto createProject(String ownerEmail, CreateProjectReq req) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project(req.getName(), owner);
        project = projectRepository.save(project);

        // Add owner as PROJECT_ADMIN member
        ProjectMember membership = new ProjectMember(owner, project, ProjectRole.PROJECT_ADMIN);
        projectMemberRepository.save(membership);

        // Update owner's lastProjectId
        owner.setLastProjectId(project.getId());
        userRepository.save(owner);

        return mapToDto(project, ProjectRole.PROJECT_ADMIN.name());
    }

    public List<ProjectDto> getProjectsForUser(String email) {
        List<ProjectMember> memberships = projectMemberRepository.findByUserEmail(email);
        return memberships.stream()
                .filter(m -> m.getStatus() == com.tskmgmnt.rhine.enums.ProjectMemberStatus.ACTIVE)
                .map(m -> mapToDto(m.getProject(), m.getProjectRole().name()))
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (membership.getStatus() != com.tskmgmnt.rhine.enums.ProjectMemberStatus.ACTIVE) {
            throw new RuntimeException("You have not accepted the invitation to this project yet.");
        }

        return mapToDto(project, membership.getProjectRole().name());
    }

    public ProjectDto updateProject(Long id, String email, CreateProjectReq req) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can update project settings");
        }

        project.setName(req.getName());
        project = projectRepository.save(project);
        return mapToDto(project, membership.getProjectRole().name());
    }

    public void deleteProject(Long id, String email) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectMember membership = projectMemberRepository.findByUserEmailAndProjectId(email, id)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (membership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can delete a project");
        }

        projectRepository.delete(project);
    }

    public ProjectMemberDto inviteMember(Long projectId, String adminEmail, InviteMemberReq req) {
        ProjectMember adminMembership = projectMemberRepository.findByUserEmailAndProjectId(adminEmail, projectId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (adminMembership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can invite members");
        }

        if (projectMemberRepository.existsByUserEmailAndProjectId(req.getEmail(), projectId)) {
            throw new RuntimeException("User is already a member of this project");
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found. They must register first."));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectRole role = req.getProjectRole() != null ? req.getProjectRole() : ProjectRole.PROJECT_EMPLOYEE;
        String token = java.util.UUID.randomUUID().toString();
        ProjectMember membership = new ProjectMember(user, project, role, com.tskmgmnt.rhine.enums.ProjectMemberStatus.PENDING, token);
        projectMemberRepository.save(membership);

        sendInviteEmail(user.getEmail(), project.getName(), role, token);

        return new ProjectMemberDto(user.getEmail(), user.getName(), role, 0);
    }

    private void sendInviteEmail(String to, String projectName, ProjectRole role, String token) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("onantabasseyvee@gmail.com");
            message.setTo(to);
            message.setSubject("You've been invited to join " + projectName);
            String inviteLink = "http://localhost:5173/accept-invite?token=" + token;
            message.setText("Hello,\n\nYou have been invited to join the project '" + projectName + "' as a " + role + ".\n\nPlease click the link below to accept the invitation:\n" + inviteLink);
            mailSender.send(message);
            System.out.println("Invite email sent to " + to + " with link: " + inviteLink);
        } catch (Exception e) {
            System.err.println("Failed to send invite email: " + e.getMessage());
        }
    }

    public Long acceptInvite(String token) {
        ProjectMember membership = projectMemberRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));

        membership.setStatus(com.tskmgmnt.rhine.enums.ProjectMemberStatus.ACTIVE);
        membership.setToken(null); // Invalidate token
        projectMemberRepository.save(membership);
        
        return membership.getProject().getId();
    }

    public void removeMember(Long projectId, String adminEmail, String memberEmail) {
        ProjectMember adminMembership = projectMemberRepository.findByUserEmailAndProjectId(adminEmail, projectId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));

        if (adminMembership.getProjectRole() != ProjectRole.PROJECT_ADMIN) {
            throw new RuntimeException("Only project admins can remove members");
        }

        if (adminEmail.equals(memberEmail)) {
            throw new RuntimeException("You cannot remove yourself from the project");
        }

        ProjectMember memberToRemove = projectMemberRepository.findByUserEmailAndProjectId(memberEmail, projectId)
                .orElseThrow(() -> new RuntimeException("Member not found in this project"));

        projectMemberRepository.delete(memberToRemove);
    }

    public List<ProjectMemberDto> getMembers(Long projectId, String email) {
        // Verify the requesting user is a member
        if (!projectMemberRepository.existsByUserEmailAndProjectId(email, projectId)) {
            throw new RuntimeException("You are not a member of this project");
        }

        return projectMemberRepository.findByProjectId(projectId).stream()
                .map(m -> {
                    long activeTaskCount = taskRepository.countByProjectIdAndAssigneeEmailAndTaskStatusNot(
                            projectId,
                            m.getUser().getEmail(),
                            com.tskmgmnt.rhine.enums.TaskStatus.CANCELLED
                    );
                     String name = m.getUser().getName();
                     if (m.getStatus() == com.tskmgmnt.rhine.enums.ProjectMemberStatus.PENDING) {
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
                .orElseThrow(() -> new RuntimeException("You are not a member of this project"));
        return membership.getProjectRole();
    }

    public boolean userHasProjects(String email) {
        return projectMemberRepository.findByUserEmail(email).stream()
                .anyMatch(m -> m.getStatus() == com.tskmgmnt.rhine.enums.ProjectMemberStatus.ACTIVE);
    }

    private ProjectDto mapToDto(Project project, String currentUserRole) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setOwnerEmail(project.getOwner().getEmail());
        dto.setOwnerName(project.getOwner().getName());
        dto.setMemberCount(project.getMembers() != null ? (int) project.getMembers().stream().filter(m -> m.getStatus() == com.tskmgmnt.rhine.enums.ProjectMemberStatus.ACTIVE).count() : 0);
        dto.setCreatedAt(project.getCreatedAt());
        dto.setCurrentUserRole(currentUserRole);
        return dto;
    }
}
