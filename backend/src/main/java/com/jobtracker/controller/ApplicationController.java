package com.jobtracker.controller;

import com.jobtracker.model.Application;
import com.jobtracker.model.User;
import com.jobtracker.repository.ApplicationRepository;
import com.jobtracker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository repo;
    private final UserRepository userRepository;

    private User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<Application> getAll(@AuthenticationPrincipal String email) {
        User user = getCurrentUser(email);
        return repo.findByUserOrderByAppliedDateDesc(user);
    }

    @PostMapping
    public ResponseEntity<Application> create(
            @Valid @RequestBody Application application,
            @AuthenticationPrincipal String email) {
        User user = getCurrentUser(email);
        application.setId(null);
        application.setUser(user);
        return ResponseEntity.status(201).body(repo.save(application));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> update(
            @PathVariable Long id,
            @Valid @RequestBody Application application,
            @AuthenticationPrincipal String email) {
        User user = getCurrentUser(email);
        return repo.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .map(existing -> {
                    application.setId(id);
                    application.setUser(user);
                    return ResponseEntity.ok(repo.save(application));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal String email) {
        User user = getCurrentUser(email);
        return repo.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .map(app -> {
                    app.setStatus(Application.ApplicationStatus.valueOf(body.get("status")));
                    return ResponseEntity.ok(repo.save(app));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        User user = getCurrentUser(email);
        return repo.findById(id)
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .map(a -> {
                    repo.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}