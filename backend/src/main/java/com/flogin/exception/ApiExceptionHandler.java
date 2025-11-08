package com.flogin.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String,Object> body = new HashMap<>();
    body.put("status", 400);
    body.put("error", "Bad Request");
    body.put("messages", ex.getBindingResult().getFieldErrors()
        .stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).toList());
    return ResponseEntity.badRequest().body(body);
  }
}
