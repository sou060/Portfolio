package com.portfolio.exception;

import com.portfolio.dto.BaseResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Global exception handler for the application
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Validation error for request {}: {}", requestId, ex.getMessage());
        
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(fieldName + ": " + errorMessage);
        });
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Validation failed")
                .errors(errors)
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle constraint violation errors
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Constraint violation for request {}: {}", requestId, ex.getMessage());
        
        List<String> errors = new ArrayList<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.add(violation.getPropertyPath() + ": " + violation.getMessage());
        }
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Constraint violation")
                .errors(errors)
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle resource not found errors
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Resource not found for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * Handle business logic errors
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<BaseResponse<Void>> handleBusinessException(
            BusinessException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Business exception for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message(ex.getMessage())
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    /**
     * Handle authentication errors
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<BaseResponse<Void>> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Authentication failed for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Authentication failed")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle authorization errors
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<BaseResponse<Void>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Access denied for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Access denied")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
    
    /**
     * Handle bad credentials
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<BaseResponse<Void>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Bad credentials for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Invalid credentials")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
    
    /**
     * Handle method not supported
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<BaseResponse<Void>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Method not supported for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("HTTP method not supported")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
    }
    
    /**
     * Handle missing request parameters
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<BaseResponse<Void>> handleMissingParameter(
            MissingServletRequestParameterException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Missing parameter for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Missing required parameter: " + ex.getParameterName())
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle type mismatch
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<BaseResponse<Void>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Type mismatch for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Invalid parameter type for: " + ex.getName())
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle malformed JSON
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseResponse<Void>> handleMalformedJson(
            HttpMessageNotReadableException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Malformed JSON for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Malformed JSON request")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * Handle file upload size exceeded
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<BaseResponse<Void>> handleMaxUploadSizeExceeded(
            MaxUploadSizeExceededException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("File size exceeded for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("File size exceeds maximum allowed size")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
    }
    
    /**
     * Handle 404 errors
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<BaseResponse<Void>> handleNoHandlerFound(
            NoHandlerFoundException ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("No handler found for request {}: {}", requestId, ex.getMessage());
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("Endpoint not found")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    /**
     * Handle generic exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleGenericException(
            Exception ex, WebRequest request) {
        
        String requestId = generateRequestId();
        log.error("Unexpected error for request {}: {}", requestId, ex.getMessage(), ex);
        
        BaseResponse<Void> response = BaseResponse.<Void>builder()
                .success(false)
                .message("An unexpected error occurred")
                .requestId(requestId)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
    
    /**
     * Generate unique request ID for tracking
     */
    private String generateRequestId() {
        return UUID.randomUUID().toString();
    }
}
