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
    @DisplayName("TC1: POST /api/auth/login - Thanh cong")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        LoginResponse mockResponse = new LoginResponse(true, "Dang nhap thanh cong", "token123", "testuser");
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))

            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
            .andExpect(jsonPath("$.token").value("token123"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    @DisplayName("TC2: POST /api/auth/login - Sai mat khau")
    void testLoginUnauthorized() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Wrong123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai mat khau", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai mat khau"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("TC3: POST /api/auth/login - Username khong ton tai")
    void testLoginUsernameNotFound() throws Exception {
        LoginRequest request = new LoginRequest("nouser", "Test123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Username khong ton tai", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Username khong ton tai"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("TC4: POST /api/auth/login - Sai dinh dang")
    void testLoginBadRequestFromService() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai dinh dang username/password", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))

            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai dinh dang username/password"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("TC5: POST /api/auth/login - Username qua ngan")
    void testLoginValidationErrorUsernameShort() throws Exception {
        LoginRequest invalid = new LoginRequest("ab", "Test123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))

            .andExpect(status().isBadRequest());
        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("TC6: POST /api/auth/login - Password qua ngan")
    void testLoginPasswordTooShortValidation() throws Exception {
        LoginRequest invalid = new LoginRequest("tester", "abc");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))

            .andExpect(status().isBadRequest());
        verify(authService, never()).authenticate(any());
    }

    @Test
    @DisplayName("TC7: Response structure success: success, message, token, username")
    void testResponseStructureSuccess() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(true, "Dang nhap thanh cong", "t123", "tester"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","Pass123"))))

            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("Dang nhap thanh cong"))
            .andExpect(jsonPath("$.token").value("t123"))
            .andExpect(jsonPath("$.username").value("tester"));
    }

    @Test
    @DisplayName("TC8: Response structure failure: khong co token")
    void testResponseStructureFailure() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(false, "Sai mat khau", null, null));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","BadPass1"))))

            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai mat khau"))
            .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("TC9: CORS Preflight OPTIONS /api/auth/login")
    void testCorsPreflight() throws Exception {

        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))

            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    @DisplayName("TC10: Actual POST có header Access-Control-Allow-Origin")
    void testCorsOnActualPost() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(new LoginResponse(true, "Dang nhap thanh cong", "tok", "tester"));

        mockMvc.perform(post("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new LoginRequest("tester","Pass123"))))

            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }
}