package com.flogin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductRepository repo;
  public ProductController(ProductRepository repo){ this.repo = repo; }

  @GetMapping
  public List<Product> all(){ return repo.findAll(); }

  @PostMapping
  public ResponseEntity<Product> create(@Valid @RequestBody Product p){
    return ResponseEntity.ok(repo.save(p));
  }
  @PutMapping("/{id}")
public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody Product p){
  if (!repo.existsById(id)) return ResponseEntity.notFound().build();
  p.setId(id);
  return ResponseEntity.ok(repo.save(p));
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
  if (!repo.existsById(id)) return ResponseEntity.notFound().build();
  repo.deleteById(id);
  return ResponseEntity.noContent().build();
}

}
