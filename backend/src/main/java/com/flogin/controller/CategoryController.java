package com.flogin.controller;

import com.flogin.entity.Category;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
  @GetMapping
  public List<String> list() {
    return Arrays.stream(Category.values())
                 .map(Enum::name)
                 .toList(); // ["ELECTRONICS","FASHION",...]
  }
}
