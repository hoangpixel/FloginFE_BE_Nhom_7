package com.flogin.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
    return repo.findByUsername(req.getUsername())
      .filter(u -> encoder.matches(req.getPassword(), u.getPasswordHash()))
      .map(u -> ResponseEntity.ok(
        new LoginResponse(UUID.randomUUID().toString(), u.getUsername())))
      .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }
}
