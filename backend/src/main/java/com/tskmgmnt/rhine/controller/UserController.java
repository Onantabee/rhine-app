package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.PasswordChangeReq;
import com.tskmgmnt.rhine.dto.UserRes;
import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.service.ProjectService;
import com.tskmgmnt.rhine.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Collections;
import java.util.List;
import java.util.Base64;

@RestController
@RequestMapping("api/users")
@Tag(
        name = "User Management",
        description = "User profile and account management"
)
public class UserController {
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
                userRes.isVerified()
        );
    }

    @Operation(summary = "Get all users")
    @GetMapping()
    public List<User> getAllUsers() {
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

    @Operation(summary = "Logout user")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(jakarta.servlet.http.HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        jakarta.servlet.http.HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @Operation(summary = "Update last accessed project")
    @PutMapping("/update-last-project/{projectId}")
    public ResponseEntity<String> updateLastProject(@PathVariable Long projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        System.out.println("Updating last project for " + email + " to " + projectId);
        userService.updateLastProjectId(email, projectId);
        return ResponseEntity.ok("Last project updated successfully");
    }
}