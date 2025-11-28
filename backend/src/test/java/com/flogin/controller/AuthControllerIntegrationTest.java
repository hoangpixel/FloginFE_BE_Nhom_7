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
@DisplayName("Login API Integration Tests (a,b,c)")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    
    @MockBean private AuthService authService;
    @MockBean private AuthUserRepository authUserRepository; 

    @Test
    @DisplayName("a1) POST /api/auth/login - Thành công 200")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(true, "Đăng nhập thành công", "token123", "testuser");
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
            .andExpect(jsonPath("$.token").value("token123"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    @DisplayName("a2) POST /api/auth/login - Sai mật khẩu 401")
    void testLoginUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Wrong123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai mật khẩu", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai mật khẩu"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("a3) POST /api/auth/login - Username không tồn tại 401")
    void testLoginUsernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest("nouser", "Test123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Username không tồn tại", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Username không tồn tại"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("a4) POST /api/auth/login - Sai định dạng 400")
    void testLoginBadRequestFromService() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai định dạng username/password", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai định dạng username/password"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("a5) POST /api/auth/login - Username quá ngắn 400 (validation)")
    void testLoginValidationErrorUsernameShort() throws Exception {
        LoginRequest invalid = new LoginRequest("ab", "Test123");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());
        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("a6) POST /api/auth/login - Password quá ngắn 400 (validation)")
    void testLoginPasswordTooShortValidation() throws Exception {
        LoginRequest invalid = new LoginRequest("tester", "abc");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest());
        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("b1) Response structure success: success, message, token, username")
    void testResponseStructureSuccess() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(true, "Đăng nhập thành công", "t123", "tester"));
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","Pass123"))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
            .andExpect(jsonPath("$.token").value("t123"))
            .andExpect(jsonPath("$.username").value("tester"));
    }

    @Test
    @DisplayName("b2) Response structure failure: không có token")
    void testResponseStructureFailure() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai mật khẩu", null, null));
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","BadPass1"))))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai mật khẩu"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("c1) CORS Preflight OPTIONS /api/auth/login")
    void testCorsPreflight() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    @DisplayName("c2) Actual POST có header Access-Control-Allow-Origin")
    void testCorsOnActualPost() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(true, "Đăng nhập thành công", "tok", "tester"));
        mockMvc.perform(post("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","Pass123"))))
            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }
}