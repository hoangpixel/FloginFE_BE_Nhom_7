package com.flogin.service;

import java.util.Locale;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

@Service
@SuppressWarnings("null")
public class ProductService {
  private final ProductRepository repo;
  public ProductService(ProductRepository repo) { this.repo = repo; }

  @Transactional
  public Product createProduct(ProductRequest req) {
    Product p = new Product();
    fill(p, req);
    return repo.save(p);
  }

  @Transactional(readOnly = true)
  public Product getProduct(long id) {
    return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
  }

  @Transactional
  public Product updateProduct(long id, ProductRequest req) {
    Product existing = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    fill(existing, req);
    return repo.save(existing);
  }

  @Transactional
  public void deleteProduct(long id) {
    if (!repo.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
    }
    repo.deleteById(id);
  }

  @Transactional(readOnly = true)
  public Page<Product> getAll(Pageable pageable) {
    Objects.requireNonNull(pageable, "pageable must not be null");
    return repo.findAll(pageable);
  }

  private void fill(Product p, ProductRequest req) {
    p.setName(req.getName());
    p.setPrice(req.getPrice());
    p.setQuantity(req.getQuantity());
    p.setDescription(req.getDescription());
    p.setCategory(parseCategory(req.getCategory()));
  }

  private Category parseCategory(String raw) {
    if (raw == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category là bắt buộc");
    }
    try {
      return Category.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    } catch (IllegalArgumentException ex) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category không hợp lệ");
    }
  }
}
