package com.tskmgmnt.rhine.auth.controller;

import com.tskmgmnt.rhine.otp.service.OtpService;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.auth.dto.UserRegReq;
import com.tskmgmnt.rhine.auth.dto.UserLogReq;
import com.tskmgmnt.rhine.auth.dto.LoginResponse;
import com.tskmgmnt.rhine.auth.service.JwtService;
import com.tskmgmnt.rhine.auth.service.AuthService;
import com.tskmgmnt.rhine.core.dto.MessageResponse;

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
    public MessageResponse logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        return new MessageResponse("Logged out successfully");
    }

    @Operation(summary = "Request password reset link", tags = {"Authentication"})
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        
        try {
            authService.forgotPassword(email);
            return ResponseEntity.ok(Map.of("message", "A password reset link has been sent."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An error occurred while processing your request."));
        }
    }

    @Operation(summary = "Validate password reset token", tags = {"Authentication"})
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            authService.validateResetToken(token);
            return ResponseEntity.ok(Map.of("message", "Token is valid."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @Operation(summary = "Reset password using token", tags = {"Authentication"})
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String encodedNewPassword = request.get("newPassword");
        
        if (token == null || token.isBlank() || encodedNewPassword == null || encodedNewPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token and new password are required"));
        }

        try {
            String newPassword = new String(Base64.getDecoder().decode(encodedNewPassword));
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "An error occurred during password reset."));
        }
    }
}
