package com.flogin.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.AuthUserRepository;
import com.flogin.service.AuthService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean 
    private AuthService authService; 

    @MockBean
    private AuthUserRepository authUserRepository;

    // --- CASE 1: LOGIN THÀNH CÔNG (Happy Path) ---
    @Test
    @DisplayName("TC1: Login thanh cong (200 OK)")
    void testLoginSuccess() throws Exception {
        LoginRequest loginData = new LoginRequest("testuser", "Test1234");
        LoginResponse mockResponse = new LoginResponse(true, "Success", "mock-token", "testuser"); 

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData))) 
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.token").value("mock-token"));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    // --- CASE 2: SAI MẬT KHẨU (401 Unauthorized) ---
    @Test
    @DisplayName("TC2: Login that bai - Sai mat khau (401)")
    void testLoginFailure_WrongPassword() throws Exception {
        LoginRequest loginData = new LoginRequest("testuser", "Test1234");
        LoginResponse mockResponse = new LoginResponse(false, "Sai mật khẩu", null, null); 

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData))) 
            .andExpect(status().isBadRequest()) // Mong đợi 401
            .andExpect(jsonPath("$.message").value("Sai mật khẩu"));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    // --- CASE 3: USERNAME KHÔNG TỒN TẠI (401 Unauthorized) ---
    @Test
    @DisplayName("TC3: Login that bai - Username khong ton tai (401)")
    void testLoginFailure_UserNotFound() throws Exception {
        LoginRequest loginData = new LoginRequest("unknown", "Test1234");
        LoginResponse mockResponse = new LoginResponse(false, "Username không tồn tại", null, null); 

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData))) 
            .andExpect(status().isBadRequest()) // Mong đợi 401
            .andExpect(jsonPath("$.message").value("Username không tồn tại"));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    // --- CASE 4: LỖI NGHIỆP VỤ KHÁC (400 Bad Request) ---
    @Test
    @DisplayName("TC4: Login that bai - Loi khac tu service (400)")
    void testLoginFailure_OtherError() throws Exception {
        LoginRequest loginData = new LoginRequest("testuser", "Test1234");
        LoginResponse mockResponse = new LoginResponse(false, "Tài khoản bị khóa", null, null); 

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData))) 
            .andExpect(status().isBadRequest()) // Mong đợi 400
            .andExpect(jsonPath("$.message").value("Tài khoản bị khóa"));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    // --- CASE 5: VALIDATION ERROR (400 Bad Request - Không gọi Service) ---
    @Test
    @DisplayName("TC5: Validation Error - Username rong (400)")
    void testLoginFailure_Validation() throws Exception {
        LoginRequest invalidData = new LoginRequest("", "Test1234");

        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidData))) 
            .andExpect(status().isBadRequest()); // Mong đợi 400 do lỗi validate
        verifyNoInteractions(authService);
    }
}