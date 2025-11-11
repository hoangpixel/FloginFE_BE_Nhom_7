package com.flogin;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.flogin.entity.AuthUser;
import com.flogin.repository.AuthUserRepository;

@SpringBootApplication
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // Seed 1 user admin/123456 nếu chưa có
  @Bean
  CommandLineRunner seedAdmin(AuthUserRepository repo, PasswordEncoder encoder) {
    return args -> {
      if (!repo.existsByUsername("admin")) {
        AuthUser u = new AuthUser();
        u.setUsername("admin");
        u.setPasswordHash(encoder.encode("Test123"));
        repo.save(u);
        System.out.println("Seeded user: admin/Test123");
      }
    };
  }
}
