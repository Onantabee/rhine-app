package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.UserRes;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserRes getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new UserRes(user.getEmail(), user.getName(), user.isVerified(), user.getLastProjectId());
    }

    public UserRes updateUserDetails(String userEmail, UserRes user) {
        User existingUser = userRepository.findById(userEmail)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        existingUser.setName(user.getName());
        User savedUser = userRepository.save(existingUser);
        return mapToUserResponse(savedUser);
    }

    private UserRes mapToUserResponse(User user) {
        UserRes response = new UserRes();
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setVerified(user.isVerified());
        response.setLastProjectId(user.getLastProjectId());
        return response;
    }

    public String changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(currentPassword, user.getPwd())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        if (passwordEncoder.matches(newPassword, user.getPwd())) {
            throw new IllegalArgumentException("New password cannot be the same as the old password.");
        }

        user.setPwd(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password changed successfully.";
    }

    public void updateLastProjectId(String email, Long projectId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setLastProjectId(projectId);
        userRepository.save(user);
    }
}