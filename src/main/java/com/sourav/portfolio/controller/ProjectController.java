
package com.sourav.portfolio.controller;

import com.sourav.portfolio.model.Project;
import com.sourav.portfolio.service.AnalyticsService;
import com.sourav.portfolio.service.ProjectService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@Tag(name = "Projects", description = "Project management endpoints")
public class ProjectController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
    
    private final ProjectService projectService;
    private final AnalyticsService analyticsService;
    
    @Autowired
    public ProjectController(ProjectService projectService, AnalyticsService analyticsService) {
        this.projectService = projectService;
        this.analyticsService = analyticsService;
    }

    /**
     * Get all projects
     */
    @Operation(
        summary = "Get all projects",
        description = "Retrieve a list of all portfolio projects with their details"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved projects",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Project.class),
                examples = @ExampleObject(
                    name = "Projects List",
                    value = "[{\"id\": 1, \"title\": \"E-Commerce Platform\", \"description\": \"Full-stack e-commerce solution\", \"technologies\": [\"Spring Boot\", \"React\", \"MySQL\"], \"githubUrl\": \"https://github.com/username/project\", \"liveUrl\": \"https://project.example.com\", \"imageUrl\": \"https://example.com/image.jpg\", \"createdAt\": \"2024-01-01T00:00:00Z\", \"updatedAt\": \"2024-01-01T00:00:00Z\"}]"
                )
            )
        ),
        @ApiResponse(
            responseCode = "204",
            description = "No projects found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    @GetMapping
    @Timed(value = "projects.list", description = "Time taken to list all projects")
    public ResponseEntity<List<Project>> getAllProjects(HttpServletRequest request) {
        logger.info("GET /api/projects called");
        try {
            List<Project> projects = projectService.getAllProjects();
            logger.info("Returning {} projects", projects.size());
            
            // Track analytics
            analyticsService.trackPageView("projects", request);
            
            if (projects.isEmpty()) {
                logger.warn("No projects found");
                return ResponseEntity.noContent().build();
            }
            
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            logger.error("Error fetching projects: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get project by ID
     */
    @Operation(
        summary = "Get project by ID",
        description = "Retrieve a specific project by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Project found and returned",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Project.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Project not found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    @GetMapping("/{id}")
    @Timed(value = "projects.get", description = "Time taken to get project by ID")
    public ResponseEntity<Project> getProjectById(
        @Parameter(description = "Project ID", required = true, example = "1")
        @PathVariable Long id, 
        HttpServletRequest request) {
        logger.info("GET /api/projects/{} called", id);
        
        try {
            return projectService.getProjectById(id)
                    .map(project -> {
                        logger.info("Project found: {}", project.getTitle());
                        // Track project view
                        analyticsService.trackProjectView(id, project.getTitle(), request);
                        return ResponseEntity.ok(project);
                    })
                    .orElseGet(() -> {
                        logger.warn("Project not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching project with ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create a new project
     */
    @Operation(
        summary = "Create a new project",
        description = "Create a new portfolio project with the provided details"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Project created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Project.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    @PostMapping
    public ResponseEntity<Project> createProject(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Project details",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Project.class),
                examples = @ExampleObject(
                    name = "Create Project",
                    value = "{\"title\": \"New Project\", \"description\": \"Project description\", \"technologies\": [\"Spring Boot\", \"React\"], \"githubUrl\": \"https://github.com/username/project\", \"liveUrl\": \"https://project.example.com\", \"imageUrl\": \"https://example.com/image.jpg\"}"
                )
            )
        )
        @Valid @RequestBody Project project) {
        logger.info("POST /api/projects called for project: {}", project.getTitle());
        
        try {
            Project createdProject = projectService.createProject(project);
            logger.info("Project created successfully with ID: {}", createdProject.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (Exception e) {
            logger.error("Error creating project: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update an existing project
     */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, 
                                               @Valid @RequestBody Project projectDetails) {
        logger.info("PUT /api/projects/{} called", id);
        
        try {
            return projectService.updateProject(id, projectDetails)
                    .map(updatedProject -> {
                        logger.info("Project updated successfully: {}", updatedProject.getTitle());
                        return ResponseEntity.ok(updatedProject);
                    })
                    .orElseGet(() -> {
                        logger.warn("Project not found for update with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error updating project with ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    }
    
    /**
     * Delete a project
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        logger.info("DELETE /api/projects/{} called", id);
        
        try {
            if (projectService.deleteProject(id)) {
                logger.info("Project deleted successfully");
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Project not found for deletion with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting project with ID {}: ", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get project count
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getProjectCount() {
        logger.info("GET /api/projects/count called");
        
        try {
            long count = projectService.getProjectCount();
            Map<String, Long> response = new HashMap<>();
            response.put("count", count);
            
            logger.info("Project count: {}", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting project count: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Clear cache
     */
    @PostMapping("/cache/clear")
    public ResponseEntity<Void> clearCache() {
        logger.info("POST /api/projects/cache/clear called");
        
        try {
            projectService.clearCache();
            logger.info("Project cache cleared successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error clearing cache: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logger.warn("Validation errors: {}", errors);
        return ResponseEntity.badRequest().body(errors);
    }
}
