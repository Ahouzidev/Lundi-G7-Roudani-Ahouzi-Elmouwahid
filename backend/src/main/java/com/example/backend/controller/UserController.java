package com.example.backend.controller;

import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4206")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .map(user -> {
                    // Check if username is being changed and if it's already taken
                    if (request.getUsername() != null && !request.getUsername().equals(username)) {
                        if (userRepository.existsByUsername(request.getUsername())) {
                            return ResponseEntity.badRequest().body("Username already taken");
                        }
                        user.setUsername(request.getUsername());
                    }

                    // Check if email is being changed and if it's already taken
                    if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                        if (userRepository.existsByEmail(request.getEmail())) {
                            return ResponseEntity.badRequest().body("Email already taken");
                        }
                        user.setEmail(request.getEmail());
                    }

                    // Handle password change if requested
                    if (request.getCurrentPassword() != null && request.getNewPassword() != null) {
                        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                            return ResponseEntity.badRequest().body("Current password is incorrect");
                        }
                        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    }

                    User updatedUser = userRepository.save(user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 