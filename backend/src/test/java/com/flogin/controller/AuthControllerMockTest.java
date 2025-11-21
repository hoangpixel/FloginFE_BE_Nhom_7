package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.repository.AuthUserRepository;
import com.flogin.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

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

    @Test
    @DisplayName("Mock: Controller voi mocked service success")
    void testLoginWithMockedService() throws Exception {

        LoginRequest loginData = new LoginRequest("test", "Pass123");

        LoginResponse mockResponse = new LoginResponse(true, "Success", "mock-token", "testuser"); 

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);
        mockMvc.perform(post("/api/auth/login") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginData))) 
            .andExpect(status().isOk()); 
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}