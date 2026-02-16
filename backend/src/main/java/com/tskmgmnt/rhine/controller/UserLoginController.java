package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.UserLogReq;
import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.service.UserLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
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

import java.util.Base64;

@RestController
@RequestMapping("api/users")
@Tag(
        name = "Identity",
        description = "User Login"
)
public class UserLoginController {
    private final UserLoginService userLoginService;
    private final AuthenticationManager authenticationManager;

    public UserLoginController(UserLoginService userLoginService, AuthenticationManager authenticationManager) {
        this.userLoginService = userLoginService;
        this.authenticationManager = authenticationManager;
    }

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user with their email and password and creates a server-side session",
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

        LoginResponse response = userLoginService.loginUser(email, password);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return response;
    }
}
