package com.flogin.dto;

import java.time.Instant;
import java.util.List;

public class ApiError {
  private int status;
  private String error;
  private String message;
  private String path;            
  private Instant timestamp = Instant.now();
  private List<String> errors;

  public ApiError() {}
  public ApiError(int status, String error, String message) {
    this.status = status;
    this.error = error;
    this.message = message;
  }

  public int getStatus() { return status; }
  public void setStatus(int status) { this.status = status; }

  public String getError() { return error; }
  public void setError(String error) { this.error = error; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public String getPath() { return path; }        
  public void setPath(String path) { this.path = path; } 

  public Instant getTimestamp() { return timestamp; }
  public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

  public List<String> getErrors() { return errors; }      
  public void setErrors(List<String> errors) { this.errors = errors; } 
}
