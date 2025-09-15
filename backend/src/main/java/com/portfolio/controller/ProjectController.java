package com.portfolio.controller;

import com.portfolio.dto.BaseResponse;
import com.portfolio.dto.ProjectDTO;
import com.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import java.util.List;

/**
 * REST controller for Project operations
 */
@Slf4j
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Validated
@Tag(name = "Projects", description = "Project management API")
public class ProjectController {
    
    private final ProjectService projectService;
    
    /**
     * Get all projects with pagination and sorting
     */
    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieve all projects with pagination and sorting")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<Page<ProjectDTO>>> getAllProjects(
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Sort by field") 
            @RequestParam(defaultValue = "priority") String sortBy,
            
            @Parameter(description = "Sort direction") 
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        log.info("GET /api/projects - page: {}, size: {}, sortBy: {}, sortDirection: {}", 
                page, size, sortBy, sortDirection);
        
        Page<ProjectDTO> projects = projectService.getAllProjects(page, size, sortBy, sortDirection);
        
        BaseResponse<Page<ProjectDTO>> response = BaseResponse.success(projects, "Projects retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get project by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieve a specific project by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<ProjectDTO>> getProjectById(
            @Parameter(description = "Project ID") 
            @PathVariable Long id) {
        
        log.info("GET /api/projects/{}", id);
        
        ProjectDTO project = projectService.getProjectById(id);
        
        BaseResponse<ProjectDTO> response = BaseResponse.success(project, "Project retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get projects by status
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Get projects by status", description = "Retrieve projects filtered by status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<Page<ProjectDTO>>> getProjectsByStatus(
            @Parameter(description = "Project status") 
            @PathVariable String status,
            
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        
        log.info("GET /api/projects/status/{} - page: {}, size: {}", status, page, size);
        
        Page<ProjectDTO> projects = projectService.getProjectsByStatus(status, page, size);
        
        BaseResponse<Page<ProjectDTO>> response = BaseResponse.success(projects, "Projects retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get projects by technology
     */
    @GetMapping("/technology/{technology}")
    @Operation(summary = "Get projects by technology", description = "Retrieve projects filtered by technology")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid technology"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<Page<ProjectDTO>>> getProjectsByTechnology(
            @Parameter(description = "Technology name") 
            @PathVariable String technology,
            
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        
        log.info("GET /api/projects/technology/{} - page: {}, size: {}", technology, page, size);
        
        Page<ProjectDTO> projects = projectService.getProjectsByTechnology(technology, page, size);
        
        BaseResponse<Page<ProjectDTO>> response = BaseResponse.success(projects, "Projects retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Search projects
     */
    @GetMapping("/search")
    @Operation(summary = "Search projects", description = "Search projects by title or description")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search query"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<Page<ProjectDTO>>> searchProjects(
            @Parameter(description = "Search query") 
            @RequestParam String q,
            
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        
        log.info("GET /api/projects/search?q={} - page: {}, size: {}", q, page, size);
        
        Page<ProjectDTO> projects = projectService.searchProjects(q, page, size);
        
        BaseResponse<Page<ProjectDTO>> response = BaseResponse.success(projects, "Projects retrieved successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create a new project
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create project", description = "Create a new project (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid project data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<ProjectDTO>> createProject(
            @Parameter(description = "Project data") 
            @Valid @RequestBody ProjectDTO projectDTO) {
        
        log.info("POST /api/projects - Creating project: {}", projectDTO.getTitle());
        
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        
        BaseResponse<ProjectDTO> response = BaseResponse.success(createdProject, "Project created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Update an existing project
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update project", description = "Update an existing project (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid project data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Project not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<ProjectDTO>> updateProject(
            @Parameter(description = "Project ID") 
            @PathVariable Long id,
            
            @Parameter(description = "Project data") 
            @Valid @RequestBody ProjectDTO projectDTO) {
        
        log.info("PUT /api/projects/{} - Updating project", id);
        
        ProjectDTO updatedProject = projectService.updateProject(id, projectDTO);
        
        BaseResponse<ProjectDTO> response = BaseResponse.success(updatedProject, "Project updated successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete a project
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project", description = "Delete a project (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Project not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<Void>> deleteProject(
            @Parameter(description = "Project ID") 
            @PathVariable Long id) {
        
        log.info("DELETE /api/projects/{} - Deleting project", id);
        
        projectService.deleteProject(id);
        
        BaseResponse<Void> response = BaseResponse.success(null, "Project deleted successfully");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
    
    /**
     * Get project statistics
     */
    @GetMapping("/stats")
    @Operation(summary = "Get project statistics", description = "Get project statistics and metrics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<BaseResponse<ProjectService.ProjectStats>> getProjectStatistics() {
        log.info("GET /api/projects/stats - Getting project statistics");
        
        ProjectService.ProjectStats stats = projectService.getProjectStatistics();
        
        BaseResponse<ProjectService.ProjectStats> response = BaseResponse.success(stats, "Statistics retrieved successfully");
        return ResponseEntity.ok(response);
    }
}
