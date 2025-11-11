package com.flogin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {
  @NotBlank(message = "username is required")
  @Size(min = 3, max = 50, message = "username must be 3-50 chars")
  @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "username only allows a-z A-Z 0-9 . _ -")
  private String username;

  @NotBlank(message = "password is required")
  @Size(min = 6, max = 100, message = "password must be 6-100 chars")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "password must contain letters and digits")
  private String password;

  public LoginRequest() {}
  public LoginRequest(String username, String password) {
    this.username = username; this.password = password;
  }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}
