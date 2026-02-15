package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.CreateProjectReq;
import com.tskmgmnt.rhine.dto.InviteMemberReq;
import com.tskmgmnt.rhine.dto.ProjectDto;
import com.tskmgmnt.rhine.dto.ProjectMemberDto;
import com.tskmgmnt.rhine.enums.ProjectRole;
import com.tskmgmnt.rhine.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(
        name = "Project Management APIs",
        description = "APIs for managing projects, memberships, and roles"
)
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(summary = "Create a new project")
    @PostMapping
    public ProjectDto createProject(@RequestBody CreateProjectReq request, Authentication auth) {
        return projectService.createProject(auth.getName(), request);
    }

    @Operation(summary = "Get all projects for the current user")
    @GetMapping
    public List<ProjectDto> getProjects(Authentication auth) {
        return projectService.getProjectsForUser(auth.getName());
    }

    @Operation(summary = "Get project by ID")
    @GetMapping("/{projectId}")
    public ProjectDto getProjectById(@PathVariable Long projectId, Authentication auth) {
        return projectService.getProjectById(projectId, auth.getName());
    }

    @Operation(summary = "Update a project (admin only)")
    @PutMapping("/{projectId}")
    public ProjectDto updateProject(@PathVariable Long projectId,
                                    @RequestBody CreateProjectReq request,
                                    Authentication auth) {
        return projectService.updateProject(projectId, auth.getName(), request);
    }

    @Operation(summary = "Delete a project (admin only)")
    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable Long projectId, Authentication auth) {
        projectService.deleteProject(projectId, auth.getName());
    }

    @Operation(summary = "Get all members of a project")
    @GetMapping("/{projectId}/members")
    public List<ProjectMemberDto> getMembers(@PathVariable Long projectId, Authentication auth) {
        return projectService.getMembers(projectId, auth.getName());
    }

    @Operation(summary = "Invite a member to a project (admin only)")
    @PostMapping("/{projectId}/members")
    public ProjectMemberDto inviteMember(@PathVariable Long projectId,
                                         @RequestBody InviteMemberReq request,
                                         Authentication auth) {
        return projectService.inviteMember(projectId, auth.getName(), request);
    }

    @Operation(summary = "Remove a member from a project (admin only)")
    @DeleteMapping("/{projectId}/members/{email}")
    public void removeMember(@PathVariable Long projectId,
                             @PathVariable String email,
                             Authentication auth) {
        projectService.removeMember(projectId, auth.getName(), email);
    }

    @Operation(summary = "Get your role in a specific project")
    @GetMapping("/{projectId}/my-role")
    public ProjectRole getMyRole(@PathVariable Long projectId, Authentication auth) {
        return projectService.getUserRoleInProject(auth.getName(), projectId);
    }
}
