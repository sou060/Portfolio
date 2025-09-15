package com.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for Project operations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectDTO {
    
    private Long id;
    
    @NotBlank(message = "Project title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @NotBlank(message = "Project description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;
    
    @Size(max = 500, message = "Short description cannot exceed 500 characters")
    private String shortDescription;
    
    @NotNull(message = "Technologies list is required")
    @Size(min = 1, message = "At least one technology must be specified")
    private List<String> technologies;
    
    @Pattern(regexp = "^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*/?$", 
             message = "Invalid URL format")
    private String liveUrl;
    
    @Pattern(regexp = "^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*/?$", 
             message = "Invalid URL format")
    private String githubUrl;
    
    @Pattern(regexp = "^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*/?$", 
             message = "Invalid URL format")
    private String imageUrl;
    
    @NotNull(message = "Project status is required")
    @Pattern(regexp = "^(ACTIVE|COMPLETED|IN_PROGRESS|ON_HOLD|CANCELLED)$", 
             message = "Status must be one of: ACTIVE, COMPLETED, IN_PROGRESS, ON_HOLD, CANCELLED")
    private String status;
    
    @NotNull(message = "Project priority is required")
    @Min(value = 1, message = "Priority must be between 1 and 10")
    @Max(value = 10, message = "Priority must be between 1 and 10")
    private Integer priority;
    
    @Min(value = 0, message = "Duration cannot be negative")
    private Integer durationInWeeks;
    
    @Size(max = 1000, message = "Features list cannot exceed 1000 characters")
    private List<String> features;
    
    @Size(max = 1000, message = "Challenges list cannot exceed 1000 characters")
    private List<String> challenges;
    
    @Size(max = 1000, message = "Achievements list cannot exceed 1000 characters")
    private List<String> achievements;
    
    @Min(value = 0, message = "Team size cannot be negative")
    private Integer teamSize;
    
    @Size(max = 200, message = "Client name cannot exceed 200 characters")
    private String clientName;
    
    @Size(max = 500, message = "Client feedback cannot exceed 500 characters")
    private String clientFeedback;
    
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    
    /**
     * Validation groups for different operations
     */
    public interface Create {}
    public interface Update {}
    public interface PartialUpdate {}
}
