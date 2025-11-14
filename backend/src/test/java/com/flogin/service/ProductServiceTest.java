package com.flogin.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService CRUD Unit Tests")
class ProductServiceTest {
  @Mock ProductRepository repo;
  @InjectMocks ProductService service;

  private ProductRequest buildRequest() {
    ProductRequest req = new ProductRequest();
    req.setName("iPhone 15");
    req.setPrice(25000000);
    req.setQuantity(5);
    req.setDescription("Flagship phone");
    req.setCategory("electronics"); // lower case to test case-insensitive parsing
    return req;
  }

  private Product buildExisting() {
    Product p = new Product();
    p.setId(1L);
    p.setName("Old name");
    p.setPrice(100);
    p.setQuantity(1);
    p.setDescription("Old desc");
    p.setCategory(Category.OTHER);
    return p;
  }

  @Test @DisplayName("createProduct: success")
  void testCreateProduct() {
    ProductRequest req = buildRequest();
    Product saved = new Product();
    saved.setId(10L);
    saved.setName(req.getName());
    saved.setPrice(req.getPrice());
    saved.setQuantity(req.getQuantity());
    saved.setDescription(req.getDescription());
    saved.setCategory(Category.ELECTRONICS);
    when(repo.save(any(Product.class))).thenReturn(saved);

    Product result = service.createProduct(req);
    assertNotNull(result.getId());
    assertEquals("iPhone 15", result.getName());
    assertEquals(Category.ELECTRONICS, result.getCategory());
    verify(repo).save(any(Product.class));
  }

  @Test @DisplayName("getProduct: found")
  void testGetProductFound() {
    Product existing = buildExisting();
    when(repo.findById(1L)).thenReturn(Optional.of(existing));
    Product result = service.getProduct(1L);
    assertEquals(existing, result);
    verify(repo).findById(1L);
  }

  @Test @DisplayName("getProduct: not found -> 404")
  void testGetProductNotFound() {
    when(repo.findById(99L)).thenReturn(Optional.empty());
    ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.getProduct(99L));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test @DisplayName("updateProduct: success")
  void testUpdateProductSuccess() {
    Product existing = buildExisting();
    ProductRequest req = buildRequest();
    when(repo.findById(1L)).thenReturn(Optional.of(existing));
    when(repo.save(existing)).thenAnswer(inv -> inv.getArgument(0));

    Product updated = service.updateProduct(1L, req);
    assertEquals("iPhone 15", updated.getName());
    assertEquals(25000000, updated.getPrice());
    assertEquals(Category.ELECTRONICS, updated.getCategory());
    verify(repo).save(existing);
  }

  @Test @DisplayName("updateProduct: not found -> 404")
  void testUpdateProductNotFound() {
    when(repo.findById(123L)).thenReturn(Optional.empty());
    ProductRequest req = buildRequest();
    ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.updateProduct(123L, req));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test @DisplayName("deleteProduct: success")
  void testDeleteProductSuccess() {
    when(repo.existsById(1L)).thenReturn(true);
    doNothing().when(repo).deleteById(1L);
    assertDoesNotThrow(() -> service.deleteProduct(1L));
    verify(repo).deleteById(1L);
  }

  @Test @DisplayName("deleteProduct: not found -> 404")
  void testDeleteProductNotFound() {
    when(repo.existsById(55L)).thenReturn(false);
    ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> service.deleteProduct(55L));
    assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
  }

  @Test @DisplayName("getAll: pagination")
  void testGetAllPagination() {
    PageRequest pageReq = PageRequest.of(0, 2);
    Product p1 = buildExisting();
    Product p2 = buildExisting(); p2.setId(2L);
    p2.setName("Second");
    Page<Product> page = new PageImpl<>(List.of(p1, p2), pageReq, 5); // total 5 items, first page size 2
    when(repo.findAll(pageReq)).thenReturn(page);

    Page<Product> result = service.getAll(pageReq);
    assertEquals(2, result.getContent().size());
    assertEquals(5, result.getTotalElements());
    assertEquals("Second", result.getContent().get(1).getName());
    verify(repo).findAll(pageReq);
  }
}
