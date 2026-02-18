package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.UserRegReq;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserSignupService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public UserSignupService(UserRepository userRepository, PasswordEncoder passwordEncoder, OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
    }

    public User createUser(UserRegReq userRegReq) {
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
