package com.tskmgmnt.rhine.controller;

import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.dto.UserRegReq;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.service.UserSignupService;
import com.tskmgmnt.rhine.service.OtpService;
import com.tskmgmnt.rhine.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
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
import java.util.Map;

@RestController
@RequestMapping("api/users")
@Tag(name = "Authentication")
public class UserSignupController {
    private static final Logger logger = LoggerFactory.getLogger(UserSignupController.class);

    private final UserSignupService userRegistrationService;
    private final OtpService otpService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserSignupController(UserSignupService userRegistrationService, OtpService otpService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRegistrationService = userRegistrationService;
        this.otpService = otpService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account. User must verify email before logging in.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully registered user"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "409", description = "User already exists"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping(path = "/register")
    public LoginResponse register(@RequestBody UserRegReq request, HttpServletRequest httpServletRequest) {
        String decodedPassword = new String(Base64.getDecoder().decode(request.getPwd()));
        UserRegReq decodedRequest = new UserRegReq(request.getName(), request.getEmail(), decodedPassword);
        User user = userRegistrationService.createUser(decodedRequest);

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
            logger.error("Authentication failed for user: {}", decodedRequest.getEmail(), e);
        }

        return new LoginResponse("Registration successful. Please verify your email.", user.getEmail(), user.getName(), false, false, token);
    }

    @Operation(
            summary = "Verify user email",
            description = "Verifies the user's email with the provided OTP code",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Email verified successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid or expired OTP"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping(path = "/verify")
    public LoginResponse verify(@RequestParam String email, @RequestParam String code) {
        boolean isValid = otpService.validateOtp(email, code);
        if (isValid) {
            userRegistrationService.verifyUser(email);
            User user = userRegistrationService.getUserByEmail(email);
            String token = jwtService.generateToken(user);
            return new LoginResponse("Verification successful", email, user.getName(), false, true, token);
        } else {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }
    }

    @Operation(
            summary = "Resend OTP",
            description = "Resends OTP to the user's email",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OTP sent successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid email"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    @PostMapping(path = "/resend-otp")
    public Map<String, String> resendOtp(@RequestParam String email) {
        otpService.generateOtp(email);
        return Map.of("message", "OTP sent");
    }
}
