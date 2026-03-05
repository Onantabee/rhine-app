package com.tskmgmnt.rhine.auth.service;
import com.tskmgmnt.rhine.otp.service.OtpService;
import com.tskmgmnt.rhine.user.entity.User;
import com.tskmgmnt.rhine.user.repository.UserRepository;
import com.tskmgmnt.rhine.project.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.auth.dto.UserRegReq;
import com.tskmgmnt.rhine.auth.dto.LoginResponse;
import com.tskmgmnt.rhine.auth.entity.UserResetToken;
import com.tskmgmnt.rhine.auth.repository.UserResetTokenRepository;
import com.tskmgmnt.rhine.core.service.MailService;

import java.time.LocalDateTime;
import java.util.UUID;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserResetTokenRepository userResetTokenRepository;
    private final MailService mailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       OtpService otpService, ProjectMemberRepository projectMemberRepository,
                       UserResetTokenRepository userResetTokenRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.projectMemberRepository = projectMemberRepository;
        this.userResetTokenRepository = userResetTokenRepository;
        this.mailService = mailService;
    }

    public LoginResponse loginUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Invalid email or password"));
        
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalStateException("Invalid email or password");
        }
        
        boolean hasProjects = !projectMemberRepository.findByUserEmail(email).isEmpty();
        return new LoginResponse("Login successful", user.getEmail(), user.getName(), hasProjects, user.getLastProjectId(), user.isVerified(), null);
    }

    public User registerUser(UserRegReq userRegReq) {
        if (userRepository.findByEmail(userRegReq.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setName(userRegReq.getName());
        user.setEmail(userRegReq.getEmail());
        user.setPwd(passwordEncoder.encode(userRegReq.getPwd()));

        User savedUser = userRepository.save(user);
        otpService.generateOtp(savedUser.getEmail());
        return savedUser;
    }

    public void verifyUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("No account found with that email address.");
        }

        userResetTokenRepository.findByUser(user).ifPresent(userResetTokenRepository::delete);

        String token = UUID.randomUUID().toString();
        
        UserResetToken resetToken = new UserResetToken(token, user, LocalDateTime.now().plusHours(1));
        userResetTokenRepository.save(resetToken);

        mailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void validateResetToken(String token) {
        UserResetToken resetToken = userResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or non-existent token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            userResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token has expired");
        }
    }

    public void resetPassword(String token, String newRawPassword) {
        UserResetToken resetToken = userResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            userResetTokenRepository.delete(resetToken);
            throw new IllegalArgumentException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPwd(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);

        userResetTokenRepository.delete(resetToken);
    }
}
