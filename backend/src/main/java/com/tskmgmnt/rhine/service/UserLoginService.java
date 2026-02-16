package com.tskmgmnt.rhine.service;

import com.tskmgmnt.rhine.dto.LoginResponse;
import com.tskmgmnt.rhine.entity.User;
import com.tskmgmnt.rhine.repository.ProjectMemberRepository;
import com.tskmgmnt.rhine.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectMemberRepository projectMemberRepository;

    public UserLoginService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                            ProjectMemberRepository projectMemberRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectMemberRepository = projectMemberRepository;
    }

    public LoginResponse loginUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Invalid email or password"));
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalStateException("Invalid email or password");
        }
        boolean hasProjects = !projectMemberRepository.findByUserEmail(email).isEmpty();
        return new LoginResponse("Login successful", user.getEmail(), user.getName(), hasProjects, user.getLastProjectId(), user.isVerified());
    }
}
