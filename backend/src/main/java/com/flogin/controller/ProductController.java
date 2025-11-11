package com.flogin.controller;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductRepository repo;
  public ProductController(ProductRepository repo) { this.repo = repo; }

  @GetMapping
  public List<Product> list() { return repo.findAll(); }

  @PostMapping
  public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest req) {
    Product p = new Product();
    fill(p, req);
    return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(p));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
    return repo.findById(id).map(old -> {
      fill(old, req);
      return ResponseEntity.ok(repo.save(old));
    }).orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!repo.existsById(id)) return ResponseEntity.notFound().build();
    repo.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
public ResponseEntity<Product> read(@PathVariable Long id) {
  return repo.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
}

  private void fill(Product p, ProductRequest req) {
    p.setName(req.getName());
    p.setPrice(req.getPrice());
    p.setQuantity(req.getQuantity());
    p.setDescription(req.getDescription());
    p.setCategory(parseCategory(req.getCategory()));
  }

  private Category parseCategory(String raw) {
    try {
      return Category.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category không hợp lệ");
    }
  }
}
