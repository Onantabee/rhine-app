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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(
        name = "CRUD REST APIs for User Account",
        description = "CRUD REST APIs - Create Account, Update Account, Get Account, Get All Account"
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
                hasProjects
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
    public String changePassword(
            @PathVariable String email,
            @RequestBody PasswordChangeReq request) {
        return userService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
    }

    @Operation(summary = "Update last accessed project")
    @PutMapping("/update-last-project/{projectId}")
    public void updateLastProject(@PathVariable Long projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        userService.updateLastProjectId(email, projectId);
    }
}