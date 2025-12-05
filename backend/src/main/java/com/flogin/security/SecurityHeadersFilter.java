package com.flogin.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Simple filter to add common security headers.
 * Note: HSTS only applies over HTTPS; kept for production deployments.
 */
public class SecurityHeadersFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // MIME type sniffing protection
    response.setHeader("X-Content-Type-Options", "nosniff");

    // Clickjacking protection
    response.setHeader("X-Frame-Options", "DENY");

    // Basic CSP to block inline scripts; adjust as needed for app
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");

    // HSTS for HTTPS (has effect only when served over HTTPS)
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    filterChain.doFilter(request, response);
  }
}
