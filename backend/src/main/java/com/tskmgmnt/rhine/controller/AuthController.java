package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.dto.UserLogReq;
import com.tskmgmnt.rhine.dto.UserRegReq;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.service.AuthService;
import com.tskmgmnt.rhine.service.JwtService;
import com.tskmgmnt.rhine.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("api/users")
@Tag(name = "Authentication")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OtpService otpService;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager, 
                          JwtService jwtService, OtpService otpService) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    @Operation(
            summary = "Authenticate user",
            tags = {"Authentication"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login successful", 
                        content = @Content(schema = @Schema(implementation = LoginResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Invalid credentials")
            }
    )
    @PostMapping("/login")
    public LoginResponse login(@RequestBody UserLogReq loginRequest, HttpServletRequest request) {
        String email = loginRequest.getEmail();
        String password = new String(Base64.getDecoder().decode(loginRequest.getPassword()));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        LoginResponse response = authService.loginUser(email, password);
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            String jwtToken = jwtService.generateToken((UserDetails) principal);
            response.setToken(jwtToken);
        }

        return response;
    }

    @Operation(
            summary = "Register a new user",
            tags = {"Authentication"},
            responses = {
                    @ApiResponse(responseCode = "200", description = "Registration successful"),
                    @ApiResponse(responseCode = "400", description = "Invalid input or user already exists")
            }
    )
    @PostMapping("/register")
    public LoginResponse register(@RequestBody UserRegReq request) {
        String decodedPassword = new String(Base64.getDecoder().decode(request.getPwd()));
        UserRegReq decodedRequest = new UserRegReq(request.getName(), request.getEmail(), decodedPassword);
        User user = authService.registerUser(decodedRequest);

        String token = null;
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(decodedRequest.getEmail(), decodedRequest.getPwd())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                token = jwtService.generateToken((UserDetails) principal);
            }
        } catch (Exception e) {
            logger.error("Auto-authentication failed after registration for: {}", user.getEmail());
        }

        return new LoginResponse("Registration successful. Please verify your email.", 
                user.getEmail(), user.getName(), false, false, token);
    }

    @Operation(summary = "Verify user email", tags = {"Authentication"})
    @PostMapping("/verify")
    public LoginResponse verify(@RequestParam String email, @RequestParam String code) {
        boolean isValid = otpService.validateOtp(email, code);
        if (isValid) {
            authService.verifyUser(email);
            User user = authService.getUserByEmail(email);
            String token = jwtService.generateToken(user);
            return new LoginResponse("Verification successful", email, user.getName(), false, true, token);
        } else {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }
    }

    @Operation(summary = "Resend OTP", tags = {"Authentication"})
    @PostMapping("/resend-otp")
    public Map<String, String> resendOtp(@RequestParam String email) {
        otpService.generateOtp(email);
        return Map.of("message", "OTP sent");
    }

    @Operation(summary = "Logout user", tags = {"Authentication"})
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }
}
