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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

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

    @Test
    @DisplayName("GET /api/products - Lay danh sach san pham") 
    void testGetAllProducts() throws Exception {
        
        // 1. CHUẨN BỊ DATA
        Product laptop = new Product();
        laptop.setId(1L);
        laptop.setName("Laptop");
        
        Product mouse = new Product();
        mouse.setId(2L);
        mouse.setName("Mouse");

        List<Product> listGia = Arrays.asList(laptop, mouse);

        // 2. MOCK (Dùng repo.findAll())
        when(productRepository.findAll()).thenReturn(listGia); 

        // 3. TEST
        mockMvc.perform(get("/api/products")) 
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2))) 
            .andExpect(jsonPath("$[0].name", is("Laptop"))); 
    }
    
    @Test
    @DisplayName("POST /api/products - Tao san pham moi") 
    void testCreateProduct() throws Exception {
        
        // 1. DATA GỬI LÊN
        ProductRequest requestData = new ProductRequest(); 
        requestData.setName("New Laptop");
        requestData.setPrice(1000);
        requestData.setCategory("ELECTRONICS"); // Thêm category string hợp lệ
        requestData.setQuantity(10); // Thêm số lượng (int)
        // 2. DATA TRẢ VỀ
        Product responseData = new Product(); 
        responseData.setId(1L);
        responseData.setName("New Laptop");
        responseData.setPrice(1000);

        // 3. MOCK (Dùng repo.save())
        when(productRepository.save(any(Product.class))).thenReturn(responseData);

        // 4. TEST
        mockMvc.perform(post("/api/products") 
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestData)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.name", is("New Laptop")));
    }
}