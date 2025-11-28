package com.flogin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flogin.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {}
