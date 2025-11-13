package com.flogin.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.AuthUser;
import com.flogin.repository.AuthUserRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@Service
public class AuthService {
  private final AuthUserRepository repo;
  private final PasswordEncoder encoder;
  private final Validator vali;

  public AuthService(AuthUserRepository repo, PasswordEncoder encoder, Validator vali) {
    this.repo = repo; this.encoder = encoder; this.vali = vali;
  }

  private String firstViolation(LoginRequest req) {
    Set<ConstraintViolation<LoginRequest>> v = vali.validate(req);
    if (!v.isEmpty()) return v.iterator().next().getMessage();
    return null;
  }

    public void validateRequest(LoginRequest req) {
    Set<ConstraintViolation<LoginRequest>> v = vali.validate(req);
    if (!v.isEmpty()) {
      String msg = v.iterator().next().getMessage();
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
  }

  boolean matches(String raw, String hash) {
    return hash != null && encoder.matches(raw, hash);
  }

  public LoginResponse authenticate(LoginRequest req) {
    String violation = firstViolation(req);
    if (violation != null) {
      return new LoginResponse(false, violation, null, null);
    }

    AuthUser user = repo.findByUsername(req.getUsername()).orElse(null);
    if (user == null) {
      return new LoginResponse(false, "Username không tồn tại", null, null);
    }

    if (!matches(req.getPassword(), user.getPasswordHash())) {
      return new LoginResponse(false, "Sai mật khẩu", null, null);
    }

    String token = UUID.randomUUID().toString();
    return new LoginResponse(true, "Đăng nhập thành công", token, user.getUsername());
  }
}
