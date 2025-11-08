package com.flogin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "auth", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class AuthUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String username;

  @JsonIgnore
  @Column(name = "password_hash", nullable = false, length = 100)
  private String passwordHash;

  public AuthUser() {}
  public AuthUser(Long id, String username, String passwordHash) {
    this.id = id; this.username = username; this.passwordHash = passwordHash;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
