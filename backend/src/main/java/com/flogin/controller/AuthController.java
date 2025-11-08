package com.flogin.controller;

import java.util.UUID;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.AuthUser;
import com.flogin.repository.AuthUserRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
        .filter(u -> matches(req.getPassword(), u.getPasswordHash()))
        .map(u -> ResponseEntity.ok(new LoginResponse(UUID.randomUUID().toString(), u.getUsername())))
        .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
  }

  private boolean matches(String raw, String hash) {
    if (hash == null) return false;
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      return encoder.matches(raw, hash); // BCrypt
    }
    return raw.equals(hash); // nếu DB đang lưu plain text tạm thời
  }
}
