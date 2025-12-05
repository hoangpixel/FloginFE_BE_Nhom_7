package com.flogin;

import com.flogin.security.SecurityHeadersFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins("http://localhost:5173")
          .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
          .allowedHeaders("*")
          .exposedHeaders("*");
      }
    };
  }

  @Bean
  public FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilter() {
    FilterRegistrationBean<SecurityHeadersFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new SecurityHeadersFilter());
    registrationBean.setOrder(1);
    registrationBean.addUrlPatterns("/*");
    return registrationBean;
  }
}
