package com.flogin.service;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.entity.AuthUser;
import com.flogin.repository.AuthUserRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@ExtendWith(MockitoExtension.class)
@DisplayName("Login Service Unit Tests")
public class AuthServiceTest {
    //Mock framework
    @Mock AuthUserRepository repo;
    @Mock PasswordEncoder encoder;
    @Mock Validator vali;

    //framework của Mock sẽ tự động tạo new AuthService rồi nó tự truyền 3 tham số là repo,encoder,vali
    @InjectMocks AuthService authService;

    // a) Test method authenticate() với các scenarios
    @Test
    @DisplayName("TC1: Login thanh cong")
    void testLoginSuccess()
    {
        LoginRequest req = new LoginRequest("testuser","Test123");

        AuthUser user = new AuthUser(null, "testuser", "$2a$10$hash");

        when(vali.validate(req)).thenReturn(Set.of());
        when(repo.findByUsername("testuser")).thenReturn(Optional.of(user)); 
        when(encoder.matches("Test123", "$2a$10$hash")).thenReturn(true);
        
        LoginResponse res = authService.authenticate(req);
        assertTrue(res.isSuccess());
        assertEquals("Dang nhap thanh cong", res.getMessage());
        assertEquals("testuser", res.getUsername());
        assertNotNull(res.getToken());
    }

    @Test
    @DisplayName("TC2: Login that bai voi username sai")
    void testLoginFailureUsername()
    {
        LoginRequest req = new LoginRequest("wronguser", "Pass123");
        when(vali.validate(req)).thenReturn(Set.of());
        when(repo.findByUsername("wronguser")).thenReturn(Optional.empty());
        
        LoginResponse res = authService.authenticate(req);
        assertFalse(res.isSuccess());
        assertEquals("Username khong ton tai", res.getMessage());
        assertNull(res.getToken());
    }

    @Test
    @DisplayName("TC3: Login that bai voi password sai")
    void testLoginFailurePassword()
    {
        LoginRequest req = new LoginRequest("testuser","Test123");
        AuthUser user = new AuthUser(null,"testuser","$2a$10$hash");
        when(vali.validate(req)).thenReturn(Set.of());
        when(repo.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(encoder.matches("Test123", "$2a$10$hash")).thenReturn(false);

        LoginResponse res = authService.authenticate(req);
        assertFalse(res.isSuccess());
        assertEquals("Sai mat khau", res.getMessage());
        assertNull(res.getToken());
    }

    @Test
    @DisplayName("TC4: Login that bai voi loi Validation errors")
    void testValidationerrors()
    {
        LoginRequest req = new LoginRequest("","Test123");
        
        @SuppressWarnings("unchecked")
        ConstraintViolation<LoginRequest> v = (ConstraintViolation<LoginRequest>) mock(ConstraintViolation.class);
        when(v.getMessage()).thenReturn("Khong duoc de trong username");
        when(vali.validate(req)).thenReturn(Set.of(v));

        LoginResponse res = authService.authenticate(req);
        assertFalse(res.isSuccess());
        assertEquals("Khong duoc de trong username", res.getMessage());
        assertNull(res.getToken());
    }

    @Test
    @DisplayName("TC5: Login that bai do loi du lieu (Password Hash null)")
    void testLoginFailure_HashNull() {
        LoginRequest req = new LoginRequest("testuser", "Test123");
        AuthUser user = new AuthUser(null, "testuser", null); 

        when(vali.validate(req)).thenReturn(Set.of()); 
        when(repo.findByUsername("testuser")).thenReturn(Optional.of(user));
        LoginResponse res = authService.authenticate(req);

        assertFalse(res.isSuccess());
        assertEquals("Sai mat khau", res.getMessage()); 
    }
    
    // b) Test validation methods riêng lẻ
    @Test
    @DisplayName("TC6: Test validation methods DTO hop le")
    void testDTO_HopLe()
    {
        LoginRequest req = new LoginRequest("mhoang","Mhoang123");
        when(vali.validate(req)).thenReturn(Set.of());
        assertDoesNotThrow(() -> authService.validateRequest(req));
    }

    @Test
    @DisplayName("TC7: Test validation methods username rong")
    void testDTO_KhongHopLe_1()
    {
        LoginRequest req = new LoginRequest("","Mhoang123");
        @SuppressWarnings("unchecked")
        ConstraintViolation<LoginRequest> v = (ConstraintViolation<LoginRequest>) mock(ConstraintViolation.class);
        when(v.getMessage()).thenReturn("Khong duoc de trong username");
        when(vali.validate(req)).thenReturn(Set.of(v));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> authService.validateRequest(req));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertEquals("Khong duoc de trong username", ex.getReason());
    }
}
