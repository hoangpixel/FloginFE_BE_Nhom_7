package com.flogin.service;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    @DisplayName("TC1: Lay chi tiet san pham thanh cong")
    void testGetProductById() {
        Product mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Laptop Dell");
        mockProduct.setPrice(15000000); // Integer

        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        Product result = productService.getProduct(1L);

        assertNotNull(result);
        assertEquals("Laptop Dell", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("TC2: Tao san pham moi")
    void testCreateProduct() {
        ProductRequest req = new ProductRequest();
        req.setName("Iphone 15");
        req.setPrice(30000000);
        req.setQuantity(10);
        req.setCategory("ELECTRONICS");

        Product savedProduct = new Product();
        savedProduct.setId(2L);
        savedProduct.setName("Iphone 15");
        savedProduct.setPrice(30000000);
        savedProduct.setCategory(Category.ELECTRONICS);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(req);

        assertEquals(2L, result.getId());
        assertEquals("Iphone 15", result.getName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("TC3: Cap nhat san pham")
    void testUpdateProduct() {
        Product oldProduct = new Product();
        oldProduct.setId(1L);
        oldProduct.setName("Old Name");

        ProductRequest req = new ProductRequest();
        req.setName("New Name");
        req.setPrice(2000);
        req.setCategory("ELECTRONICS"); 

        when(productRepository.findById(1L)).thenReturn(Optional.of(oldProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        Product result = productService.updateProduct(1L, req);

        assertEquals("New Name", result.getName());
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("TC4: Xoa san pham")
    void testDeleteProduct() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.deleteProduct(1L);

        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    @DisplayName("TC5: Lay danh sach phan trang")
    void testGetAllProducts() {
        Product p1 = new Product(); p1.setName("A");
        Product p2 = new Product(); p2.setName("B");
        Page<Product> mockPage = new PageImpl<>(Arrays.asList(p1, p2));
        
        Pageable pageable = PageRequest.of(0, 10);

        when(productRepository.findAll(pageable)).thenReturn(mockPage);

        Page<Product> result = productService.getAll(pageable);

        assertEquals(2, result.getTotalElements());
        verify(productRepository).findAll(pageable);
    }
}