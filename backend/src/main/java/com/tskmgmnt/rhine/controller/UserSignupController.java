package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.dto.UserRegReq;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.service.UserRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@Tag(
        name = "CRUD REST APIs for User Registration",
        description = "CRUD REST APIs - Create Account"
)
public class UserSignupController {

    private final UserRegistrationService userRegistrationService;
    private final AuthenticationManager authenticationManager;

    public UserSignupController(UserRegistrationService userRegistrationService, AuthenticationManager authenticationManager) {
        this.userRegistrationService = userRegistrationService;
        this.authenticationManager = authenticationManager;
    }

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account and automatically logs them in with a session",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully registered user"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "409", description = "User already exists"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PostMapping(path = "/register")
    public LoginResponse register(@RequestBody UserRegReq request, HttpServletRequest httpRequest) {
        // Store raw password before registration hashes it
        String rawPassword = request.getPwd();

        User user = userRegistrationService.createUser(request);

        // Auto-login: create authenticated session after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), rawPassword)
        );

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return new LoginResponse("Registration successful", user.getEmail(), user.getName(), user.getUserRole());
    }

    @Operation(
            summary = "Update user role",
            description = "Updates the role of an existing user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully updated user role"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "404", description = "User not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")

            }
    )
    @PostMapping(path = "/update-role")
    public User updateUserRole(@RequestBody UserRegReq request) {
        return userRegistrationService.updateUserRole(request.getEmail(), request.getUserRole());
    }

}
