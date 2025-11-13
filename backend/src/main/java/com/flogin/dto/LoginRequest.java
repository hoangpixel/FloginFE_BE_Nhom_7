package com.flogin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LoginRequest {
  @NotBlank(message = "Không được để trống username")
  @Size(min = 3, max = 50, message = "username phải có từ 3 đến 50 ký tự")
  @Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "username chỉ chấp nhận a-z A-Z 0-9 . _ -")
  private String username;

  @NotBlank(message = "Không được để trống password")
  @Size(min = 6, max = 100, message = "password phải có từ 6 đến 100 ký tự")
  @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "password phải có ít nhất 1 chữ thường và hoa")
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
