package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.PasswordChangeReq;
import com.tskmgmnt.rhine.dto.UserReq;
import com.tskmgmnt.rhine.dto.UserRes;
import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(
        name = "CRUD REST APIs for User Account",
        description = "CRUD REST APIs - Create Account, Update Account, " +
                "Get Account, Get All Account, Delete Account"
)
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Get current authenticated user",
            description = "Returns the currently authenticated user's details from the session",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved current user"),
                    @ApiResponse(responseCode = "401", description = "Not authenticated")
            }
    )
    @GetMapping("/me")
    public LoginResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserReq userReq = userService.getUserByEmail(email);
        return new LoginResponse(
                "Authenticated",
                userReq.getEmail(),
                userReq.getName(),
                userReq.getUserRole()
        );
    }

    @Operation(
            summary = "Get all users",
            description = "Retrieves a list of all registered users in the system",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved all users"),
                    @ApiResponse(responseCode = "403", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @GetMapping()
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @Operation(
            summary = "Get user by email",
            description = "Retrieves detailed information about a specific user by their email address",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
                    @ApiResponse(responseCode = "400", description = "Invalid email format"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "403", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @GetMapping("/{email}")
    public UserReq getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @Operation(
            summary = "Get all non-admin users",
            description = "Retrieves a list of all users who don't have admin privileges",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved non-admin users"),
                    @ApiResponse(responseCode = "403", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @GetMapping("/non-admin")
    public List<UserRes> getNonAdminUsers() {
        return userService.getNonAdminUsers();
    }

    @Operation(
            summary = "Update user details",
            description = "Updates the profile information for a specific user identified by email",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User details updated successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "403", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PutMapping("/update/{userEmail}")
    public UserRes updateUserDetails(@PathVariable String userEmail, @RequestBody UserRes user){
        return userService.updateUserDetails(userEmail, user);
    }

    @Operation(
            summary = "Change user password",
            description = "Changes the user's password after verifying the current password",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Password successfully changed"),
                    @ApiResponse(responseCode = "400", description = "Wrong current password"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PutMapping("/change-password/{email}")
    public String changePassword(
            @PathVariable String email,
            @RequestBody PasswordChangeReq request) {
        return userService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
    }
}