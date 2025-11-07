package com.flogin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity @Table(name = "products")
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank @Size(min=3, max=100)
  @Column(nullable=false, length=100)
  private String name;

  @NotNull @Positive
  private Integer price;

  public Product() {}
  public Product(String name, Integer price){ this.name=name; this.price=price; }

  public Long getId(){ return id; }
  public void setId(Long id){ this.id = id; }
  public String getName(){ return name; }
  public void setName(String name){ this.name = name; }
  public Integer getPrice(){ return price; }
  public void setPrice(Integer price){ this.price = price; }
}
