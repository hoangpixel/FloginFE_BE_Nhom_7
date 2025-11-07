package com.flogin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flogin.entity.AuthUser;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {
  Optional<AuthUser> findByUsername(String username);
}
