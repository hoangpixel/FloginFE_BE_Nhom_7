package com.flogin.controller;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.repository.AuthUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@WebMvcTest(ProductController.class) 
@AutoConfigureMockMvc(addFilters = false) 
public class ProductControllerIntegrationTest { 

    @Autowired
    private MockMvc mockMvc; 

    @Autowired
    private ObjectMapper objectMapper; 

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private AuthUserRepository authUserRepository;

    // --- CASE 1: GET ALL (Lấy danh sách) ---
    @Test
    @DisplayName("GET /api/products - Lay danh sach san pham") 
    void testGetAllProducts() throws Exception {

        Product laptop = new Product();
        laptop.setId(1L);
        laptop.setName("Laptop");
        
        Product mouse = new Product();
        mouse.setId(2L);
        mouse.setName("Mouse");

        List<Product> listGia = Arrays.asList(laptop, mouse);

        when(productRepository.findAll()).thenReturn(listGia); 

        mockMvc.perform(get("/api/products")) 
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2))) 
            .andExpect(jsonPath("$[0].name", is("Laptop"))); 
        
        // 4. VERIFY (Kiểm tra tương tác)
        verify(productRepository, times(1)).findAll();
    }
    
    // --- CASE 2: GET ONE (Lấy chi tiết) ---
    @Test
    @DisplayName("GET /api/products/{id} - Lay chi tiet san pham")
    void testGetProductById() throws Exception {

        Product laptop = new Product();
        laptop.setId(1L);
        laptop.setName("Laptop Dell");

        when(productRepository.findById(1L)).thenReturn(Optional.of(laptop));

        mockMvc.perform(get("/api/products/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Laptop Dell")));

        verify(productRepository, times(1)).findById(1L);
    }

    // --- CASE 3: CREATE (Tạo mới) ---
    @Test
    @DisplayName("POST /api/products - Tao san pham moi") 
    void testCreateProduct() throws Exception {

        ProductRequest requestData = new ProductRequest(); 
        requestData.setName("New Laptop");
        requestData.setPrice(1000);
        requestData.setCategory("ELECTRONICS");
        requestData.setQuantity(10); 

        Product responseData = new Product(); 
        responseData.setId(1L);
        responseData.setName("New Laptop");
        responseData.setPrice(1000);

        when(productRepository.save(any(Product.class))).thenReturn(responseData);

        mockMvc.perform(post("/api/products") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestData)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("New Laptop")));
            
        // 5. VERIFY
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // --- CASE 4: UPDATE (Cập nhật) ---
    @Test
    @DisplayName("PUT /api/products/{id} - Cap nhat san pham")
    void testUpdateProduct() throws Exception {

        ProductRequest requestData = new ProductRequest();
        requestData.setName("Laptop Updated");
        requestData.setPrice(2000);
        requestData.setCategory("ELECTRONICS");
        requestData.setQuantity(5);

        Product oldProduct = new Product();
        oldProduct.setId(1L);
        oldProduct.setName("Laptop Old");

        Product updatedProduct = new Product();
        updatedProduct.setId(1L);
        updatedProduct.setName("Laptop Updated");
        updatedProduct.setPrice(2000);

        when(productRepository.findById(1L)).thenReturn(Optional.of(oldProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestData)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name", is("Laptop Updated")));

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // --- CASE 5: DELETE (Xóa) ---
    @Test
    @DisplayName("DELETE /api/products/{id} - Xoa san pham")
    void testDeleteProduct() throws Exception {

        when(productRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/products/1"))
            .andExpect(status().isNoContent()); // 204 No Content

        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }
}