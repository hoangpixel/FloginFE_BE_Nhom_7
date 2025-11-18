package com.flogin.controller;

import static org.hamcrest.Matchers.containsString;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.WebConfig;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.AuthUserRepository;
import com.flogin.service.AuthService;

@WebMvcTest(AuthController.class)
@Import(WebConfig.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    
    // Mock Service (được Controller gọi)
    @MockBean private AuthService authService;
    
    // Mock Repository này để khắc phục lỗi khởi tạo Context do Bean 'seedAdmin' yêu cầu.
    @MockBean private AuthUserRepository authUserRepository; 

    @Test
    @DisplayName("POST /api/auth/login - Thanh cong")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(
            true,
            "Dang nhap thanh cong",
            "token123",
            "testuser"
        );

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.token").value("token123"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Sai mat khau -> 401")
    void testLoginUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Wrong123");
        LoginResponse mockResponse = new LoginResponse(false, "Sai mật khẩu", null, null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai mật khẩu"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Loi khac (Bad request) -> 400")
    void testLoginBadRequestFromService() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(false, "Sai định dạng username/password", null, null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai định dạng username/password"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Validate username qua ngan -> 400 (khong goi service)")
    void testLoginValidationError() throws Exception {
        LoginRequest invalid = new LoginRequest("ab", "Test123"); // username quá ngắn

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());

        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("POST /api/auth/login - Username khong ton tai -> 401")
    void testLoginUsernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest("nouser", "Test123");
        LoginResponse mockResponse = new LoginResponse(false, "Username không tồn tại", null, null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Username không tồn tại"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Validate password qua ngan -> 400 (khong goi service)")
    void testLoginPasswordTooShortValidation() throws Exception {
        LoginRequest invalid = new LoginRequest("tester", "abc"); // password quá ngắn

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());

        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("CORS Preflight OPTIONS /api/auth/login")
    void testCorsPreflight() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }
}