package com.flogin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ProductRequest {
  @NotBlank @Size(min = 3, max = 100)
  private String name;

  @NotNull @Min(1) @Max(999_999_999)
  private Integer price;

  @NotNull @PositiveOrZero @Max(99_999)
  private Integer quantity;

  @Size(max = 500)
  private String description;

  @NotBlank
  private String category;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public Integer getPrice() { return price; }
  public void setPrice(Integer price) { this.price = price; }
  public Integer getQuantity() { return quantity; }
  public void setQuantity(Integer quantity) { this.quantity = quantity; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
}
