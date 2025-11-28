package com.flogin.exception;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.flogin.dto.ApiError;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApiExceptionHandler {
  private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest req) {

    ApiError body = new ApiError(400, "Yêu cầu không hợp lệ", "Xác thực dữ liệu thất bại");
    body.setPath(req.getRequestURI());
    body.setErrors(
        ex.getBindingResult().getFieldErrors()
          .stream()
          .map(e -> e.getField() + ": " + e.getDefaultMessage())
          .collect(Collectors.toList())
    );
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiError> handleBadJson(
      HttpMessageNotReadableException ex, HttpServletRequest req) {

    log.warn("Malformed JSON: {}", ex.getMessage());
    ApiError body = new ApiError(400, "Yêu cầu không hợp lệ", "Yêu cầu JSON không hợp lệ");
    body.setPath(req.getRequestURI());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
    log.error("Unhandled error", ex);
    ApiError body = new ApiError(500, "Lỗi máy chủ nội bộ", "Đã xảy ra lỗi không mong muốn");
    body.setPath(req.getRequestURI());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
