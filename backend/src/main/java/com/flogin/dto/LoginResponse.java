package com.flogin.dto;

public class LoginResponse {
  private String token;
  private String username;
  public LoginResponse() {}
  public LoginResponse(String token, String username){ this.token=token; this.username=username; }
  public String getToken(){ return token; }
  public void setToken(String t){ this.token = t; }
  public String getUsername(){ return username; }
  public void setUsername(String u){ this.username = u; }
}
