package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserLoginService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public com.tskmgmnt.rhine.dto.LoginResponse loginUser (String email, String rawPassword) {
        User user = userRepository.findByEmail(String.valueOf(email))
                .orElseThrow(() -> new IllegalStateException("Invalid email or password"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalStateException("Invalid email or password");
        }
        return new com.tskmgmnt.rhine.dto.LoginResponse("Login successful", user.getEmail(), user.getName(), user.getUserRole());
    }
}
