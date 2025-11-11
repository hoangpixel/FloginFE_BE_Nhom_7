package com.flogin.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.dto.ApiError;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.AuthUserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthUserRepository repo;
  private final PasswordEncoder encoder;

  public AuthController(AuthUserRepository repo, PasswordEncoder encoder) {
    this.repo = repo; this.encoder = encoder;
  }

@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
  return repo.findByUsername(req.getUsername())
      .filter(u -> matches(req.getPassword(), u.getPasswordHash()))
      .<ResponseEntity<?>>map(u -> ResponseEntity.ok(
          new LoginResponse(UUID.randomUUID().toString(), u.getUsername())))
      .orElseGet(() -> {
        ApiError err = new ApiError(401, "Unauthorized", "Invalid username or password");
        err.setPath("/api/auth/login");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
      });
}

  private boolean matches(String raw, String hash) {
    if (hash == null) return false;
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      return encoder.matches(raw, hash); // BCrypt
    }
    return raw.equals(hash); // if DB stores plain text temporarily
  }
}
