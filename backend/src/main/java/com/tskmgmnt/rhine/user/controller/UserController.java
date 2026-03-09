package com.tskmgmnt.rhine.user.controller;
import com.tskmgmnt.rhine.user.dto.PasswordChangeReq;
import com.tskmgmnt.rhine.user.dto.UserRes;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.service.UserService;
import com.tskmgmnt.rhine.project.service.ProjectService;
import com.tskmgmnt.rhine.auth.dto.LoginResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.tskmgmnt.rhine.core.dto.MessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Collections;
import java.util.List;
import java.util.Base64;

@RestController
@RequestMapping("api/users")
@Tag(name = "Users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final ProjectService projectService;

    public UserController(UserService userService, ProjectService projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }

    @Operation(
            summary = "Get current authenticated user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved current user"),
                    @ApiResponse(responseCode = "401", description = "Not authenticated")
            }
    )
    @GetMapping("/me")
    public LoginResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserRes userRes = userService.getUserByEmail(email);
        boolean hasProjects = projectService.userHasProjects(email);
        return new LoginResponse(
                "Authenticated",
                userRes.getEmail(),
                userRes.getName(),
                hasProjects,
                userRes.getLastProjectId(),
                userRes.isVerified(),
                null
        );
    }

    @Operation(summary = "Get all users")
    @GetMapping()
    public List<User> getAllUsers(Authentication auth) {
        String email = auth.getName();
        boolean isAdmin = projectService.userHasProjects(email);
        return userService.getAllUsers();
    }

    @Operation(summary = "Get user by email")
    @GetMapping("/{email}")
    public UserRes getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @Operation(summary = "Update user details")
    @PutMapping("/update/{userEmail}")
    public UserRes updateUserDetails(@PathVariable String userEmail, @RequestBody UserRes user) {
        return userService.updateUserDetails(userEmail, user);
    }

    @Operation(summary = "Change user password")
    @PutMapping("/change-password/{email}")
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable String email,
            @RequestBody PasswordChangeReq request) {
        String currentPassword = new String(Base64.getDecoder().decode(request.getCurrentPassword()));
        String newPassword = new String(Base64.getDecoder().decode(request.getNewPassword()));
        
        String data = userService.changePassword(email, currentPassword, newPassword);
        return ResponseEntity.ok(Collections.singletonMap("message", data));
    }


    @Operation(summary = "Update last accessed project")
    @PutMapping("/update-last-project/{projectId}")
    public MessageResponse updateLastProject(@PathVariable Long projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        logger.info("Updating last project for {} to {}", email, projectId);
        userService.updateLastProjectId(email, projectId);
        return new MessageResponse("Last project updated successfully");
    }
}