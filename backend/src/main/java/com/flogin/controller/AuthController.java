package com.flogin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
    LoginResponse res = authService.authenticate(req);

    if (res.isSuccess()) {
      // Đăng nhập OK
      return ResponseEntity.ok(res);
    }

    // Phân loại lỗi để map status code “đúng REST”
    String msg = res.getMessage();
    if ("Username không tồn tại".equals(msg) || "Sai mật khẩu".equals(msg)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res); // 401
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);     // 400 (lỗi validate)
  }
}
