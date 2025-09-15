package com.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Contact operations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ContactDTO {
    
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name can only contain letters and spaces")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email cannot exceed 255 characters")
    private String email;
    
    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 200, message = "Subject must be between 5 and 200 characters")
    private String subject;
    
    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    private String message;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @Size(max = 100, message = "Company name cannot exceed 100 characters")
    private String company;
    
    @Size(max = 100, message = "Job title cannot exceed 100 characters")
    private String jobTitle;
    
    @Size(max = 500, message = "Website URL cannot exceed 500 characters")
    @Pattern(regexp = "^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*/?$", 
             message = "Invalid website URL format")
    private String website;
    
    @Pattern(regexp = "^(INQUIRY|COLLABORATION|JOB_OFFER|FEEDBACK|OTHER)$", 
             message = "Contact type must be one of: INQUIRY, COLLABORATION, JOB_OFFER, FEEDBACK, OTHER")
    private String contactType;
    
    @Pattern(regexp = "^(NEW|IN_PROGRESS|RESOLVED|CLOSED)$", 
             message = "Status must be one of: NEW, IN_PROGRESS, RESOLVED, CLOSED")
    private String status;
    
    @Size(max = 1000, message = "Admin notes cannot exceed 1000 characters")
    private String adminNotes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    
    /**
     * Validation groups for different operations
     */
    public interface Create {}
    public interface Update {}
    public interface AdminUpdate {}
}
