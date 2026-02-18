package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.UserLogReq;
import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.service.JwtService;
import com.tskmgmnt.rhine.service.UserLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;

@RestController
@RequestMapping("api/users")
@Tag(name = "Authentication")

public class UserLoginController {
    private static final Logger logger = LoggerFactory.getLogger(UserLoginController.class);
    private final UserLoginService userLoginService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserLoginController(UserLoginService userLoginService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userLoginService = userLoginService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user with their email and password and returns a JWT token",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Authentication successful",
                            content = @Content(
                                    schema = @Schema(implementation = LoginResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid request format or missing parameters"
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - Invalid credentials"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error"
                    )
            }
    )
    @PostMapping(path = "/login")
    public LoginResponse login(@RequestBody UserLogReq loginRequest, HttpServletRequest request) {
        String email = loginRequest.getEmail();
        String password = new String(Base64.getDecoder().decode(loginRequest.getPassword()));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        LoginResponse response = userLoginService.loginUser(email, password);
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String jwtToken = jwtService.generateToken((UserDetails) principal);
            response.setToken(jwtToken);
        }

        return response;
    }
}
