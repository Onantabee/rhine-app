package com.tskmgmnt.rhine.notification.controller;

import com.tskmgmnt.rhine.notification.entity.ProjectUpdate;
import com.tskmgmnt.rhine.notification.service.UpdateService;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.repository.UserRepository;
import com.tskmgmnt.rhine.core.exception.ResourceNotFoundException;
import com.tskmgmnt.rhine.project.repository.ProjectMemberRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects/{projectId}/updates")
@Tag(name = "Project Updates")
@SecurityRequirement(name = "bearerAuth")
public class UpdateController {

    private final UpdateService updateService;
    private final ProjectMemberRepository projectMemberRepository;

    public UpdateController(UpdateService updateService, ProjectMemberRepository projectMemberRepository) {
        this.updateService = updateService;
        this.projectMemberRepository = projectMemberRepository;
    }

    @Operation(summary = "Get historical unpurged updates for the requesting user in a specific project")
    @GetMapping
    public ResponseEntity<List<ProjectUpdate>> getProjectUpdates(@PathVariable Long projectId, Authentication auth) {
        if (!projectMemberRepository.existsByUserEmailAndProjectId(auth.getName(), projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }
                
        List<ProjectUpdate> updates = updateService.getUpdatesForUserInProject(auth.getName(), projectId);
        return ResponseEntity.ok(updates);
    }

    @Operation(summary = "Mark a list of specific updates as read")
    @PostMapping("/read")
    public ResponseEntity<Void> markUpdatesAsRead(
            @PathVariable Long projectId,
            @RequestBody Map<String, List<Long>> request,
            Authentication auth) {
        
        if (!projectMemberRepository.existsByUserEmailAndProjectId(auth.getName(), projectId)) {
            throw new ResourceNotFoundException("Project not found");
        }
                
        List<Long> updateIds = request.get("updateIds");
        if (updateIds != null && !updateIds.isEmpty()) {
            updateService.markUpdatesAsRead(updateIds, auth.getName());
        }
        
        return ResponseEntity.ok().build();
    }
}
