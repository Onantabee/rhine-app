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

import java.util.Base64;

@RestController
@RequestMapping("/users")
@Tag(
        name = "CRUD REST APIs for User Registration",
        description = "CRUD REST APIs - Create Account"
)
public class UserSignupController {

    private final UserRegistrationService userRegistrationService;
    private final com.tskmgmnt.rhine.service.OtpService otpService;

    private final AuthenticationManager authenticationManager;

    public UserSignupController(UserRegistrationService userRegistrationService, com.tskmgmnt.rhine.service.OtpService otpService, AuthenticationManager authenticationManager) {
        this.userRegistrationService = userRegistrationService;
        this.otpService = otpService;
        this.authenticationManager = authenticationManager;
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

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(decodedRequest.getEmail(), decodedRequest.getPwd())
            );
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            HttpSession session = httpServletRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new LoginResponse("Registration successful. Please verify your email.", user.getEmail(), user.getName(), false, false);
    }

    @PostMapping(path = "/verify")
    public LoginResponse verify(@RequestParam String email, @RequestParam String code) {
        boolean isValid = otpService.validateOtp(email, code);
        if (isValid) {
            userRegistrationService.verifyUser(email);
            return new LoginResponse("Verification successful", email, null, false, true);
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
