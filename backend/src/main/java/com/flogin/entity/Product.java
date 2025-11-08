package com.flogin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity @Table(name = "products")
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 3–100 ký tự, không rỗng
  @NotBlank
  @Size(min = 3, max = 100)
  @Column(nullable = false, length = 100)
  private String name;

  // > 0 và <= 999,999,999
  @NotNull
  @Min(1)
  @Max(999_999_999)
  @Column(nullable = false)
  private Integer price;

  // >= 0 và <= 99,999
  @NotNull
  @PositiveOrZero
  @Max(99_999)
  @Column(nullable = false)
  private Integer quantity = 0;

  // <= 500 ký tự, có thể null
  @Size(max = 500)
  @Column(length = 500)
  private String description;

  // phải thuộc danh sách có sẵn
  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 50)
  private Category category;

  public Product() {}

  // getters/setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public Integer getPrice() { return price; }
  public void setPrice(Integer price) { this.price = price; }
  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public Category getCategory() { return category; }
  public void setCategory(Category category) { this.category = category; }
}
