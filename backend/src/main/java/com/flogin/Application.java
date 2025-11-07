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

  @Bean
  CommandLineRunner seedUsers(AuthUserRepository repo, PasswordEncoder encoder) {
    return args -> {
      repo.findByUsername("admin").orElseGet(() ->
          repo.save(new AuthUser("admin", encoder.encode("123456"), "ADMIN"))
      );
    };
  }
}
