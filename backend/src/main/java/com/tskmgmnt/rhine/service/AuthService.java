package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.dto.UserRegReq;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final ProjectMemberRepository projectMemberRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       OtpService otpService, ProjectMemberRepository projectMemberRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.projectMemberRepository = projectMemberRepository;
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
}
