package com.flogin.controller;

import com.flogin.dto.ProductRequest;
import com.flogin.entity.Category;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

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
