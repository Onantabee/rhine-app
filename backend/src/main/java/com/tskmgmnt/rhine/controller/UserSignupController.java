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
    private final com.tskmgmnt.rhine.service.OtpService otpService;

    public UserSignupController(UserRegistrationService userRegistrationService, com.tskmgmnt.rhine.service.OtpService otpService) {
        this.userRegistrationService = userRegistrationService;
        this.otpService = otpService;
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
    public LoginResponse register(@RequestBody UserRegReq request) {
        User user = userRegistrationService.createUser(request);
        // No auto-login. User must verify.
        return new LoginResponse("Registration successful. Please verify your email.", user.getEmail(), user.getName(), false);
    }

    @PostMapping(path = "/verify")
    public LoginResponse verify(@RequestParam String email, @RequestParam String code) {
        boolean isValid = otpService.validateOtp(email, code);
        if (isValid) {
            // Mark user as verified
            // Ideally we'd move this to a service method, but for now:
             com.tskmgmnt.rhine.entity.User user = userRegistrationService.getUserByEmail(email); // Need to expose this or use repo
             // Actually, validating OTP should probably trigger the verified update in service.
             // Let's assume otpService.validateOtp just returns boolean.
             // I need to update the user entity. 
             // Refactoring: I'll add verifyUser to UserRegistrationService.
             userRegistrationService.verifyUser(email);
             return new LoginResponse("Verification successful", email, null, false);
        } else {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }
    }

    @PostMapping(path = "/resend-otp")
    public String resendOtp(@RequestParam String email) {
        otpService.generateOtp(email);
        return "OTP sent";
    }
}
