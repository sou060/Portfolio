package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.entity.Project;
import com.portfolio.exception.BusinessException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Project operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    
    /**
     * Get all projects with pagination and sorting
     */
    @Cacheable(value = "projects", key = "#page + '_' + #size + '_' + #sortBy + '_' + #sortDirection")
    public Page<ProjectDTO> getAllProjects(int page, int size, String sortBy, String sortDirection) {
        log.info("Fetching projects - page: {}, size: {}, sortBy: {}, sortDirection: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Project> projects = projectRepository.findAll(pageable);
        
        return projects.map(projectMapper::toDTO);
    }
    
    /**
     * Get project by ID
     */
    @Cacheable(value = "project", key = "#id")
    public ProjectDTO getProjectById(Long id) {
        log.info("Fetching project with ID: {}", id);
        
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        return projectMapper.toDTO(project);
    }
    
    /**
     * Get projects by status
     */
    @Cacheable(value = "projectsByStatus", key = "#status + '_' + #page + '_' + #size")
    public Page<ProjectDTO> getProjectsByStatus(String status, int page, int size) {
        log.info("Fetching projects by status: {} - page: {}, size: {}", status, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("priority").descending());
        Page<Project> projects = projectRepository.findByStatus(status, pageable);
        
        return projects.map(projectMapper::toDTO);
    }
    
    /**
     * Get projects by technology
     */
    @Cacheable(value = "projectsByTechnology", key = "#technology + '_' + #page + '_' + #size")
    public Page<ProjectDTO> getProjectsByTechnology(String technology, int page, int size) {
        log.info("Fetching projects by technology: {} - page: {}, size: {}", technology, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("priority").descending());
        Page<Project> projects = projectRepository.findByTechnologiesContaining(technology, pageable);
        
        return projects.map(projectMapper::toDTO);
    }
    
    /**
     * Search projects by title or description
     */
    @Cacheable(value = "projectsSearch", key = "#query + '_' + #page + '_' + #size")
    public Page<ProjectDTO> searchProjects(String query, int page, int size) {
        log.info("Searching projects with query: {} - page: {}, size: {}", query, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("priority").descending());
        Page<Project> projects = projectRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                query, query, pageable);
        
        return projects.map(projectMapper::toDTO);
    }
    
    /**
     * Create a new project
     */
    @Transactional
    @CacheEvict(value = {"projects", "projectsByStatus", "projectsByTechnology", "projectsSearch"}, allEntries = true)
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        log.info("Creating new project: {}", projectDTO.getTitle());
        
        // Validate project data
        validateProjectData(projectDTO);
        
        // Check if project with same title already exists
        if (projectRepository.existsByTitle(projectDTO.getTitle())) {
            throw new BusinessException("Project with title '" + projectDTO.getTitle() + "' already exists", 
                    "DUPLICATE_PROJECT");
        }
        
        Project project = projectMapper.toEntity(projectDTO);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        
        Project savedProject = projectRepository.save(project);
        
        log.info("Successfully created project with ID: {}", savedProject.getId());
        return projectMapper.toDTO(savedProject);
    }
    
    /**
     * Update an existing project
     */
    @Transactional
    @CacheEvict(value = {"project", "projects", "projectsByStatus", "projectsByTechnology", "projectsSearch"}, allEntries = true)
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        log.info("Updating project with ID: {}", id);
        
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        // Validate project data
        validateProjectData(projectDTO);
        
        // Check if title is being changed and if new title already exists
        if (!existingProject.getTitle().equals(projectDTO.getTitle()) && 
            projectRepository.existsByTitle(projectDTO.getTitle())) {
            throw new BusinessException("Project with title '" + projectDTO.getTitle() + "' already exists", 
                    "DUPLICATE_PROJECT");
        }
        
        // Update project fields
        existingProject.setTitle(projectDTO.getTitle());
        existingProject.setDescription(projectDTO.getDescription());
        existingProject.setShortDescription(projectDTO.getShortDescription());
        existingProject.setTechnologies(projectDTO.getTechnologies());
        existingProject.setLiveUrl(projectDTO.getLiveUrl());
        existingProject.setGithubUrl(projectDTO.getGithubUrl());
        existingProject.setImageUrl(projectDTO.getImageUrl());
        existingProject.setStatus(projectDTO.getStatus());
        existingProject.setPriority(projectDTO.getPriority());
        existingProject.setDurationInWeeks(projectDTO.getDurationInWeeks());
        existingProject.setFeatures(projectDTO.getFeatures());
        existingProject.setChallenges(projectDTO.getChallenges());
        existingProject.setAchievements(projectDTO.getAchievements());
        existingProject.setTeamSize(projectDTO.getTeamSize());
        existingProject.setClientName(projectDTO.getClientName());
        existingProject.setClientFeedback(projectDTO.getClientFeedback());
        existingProject.setRating(projectDTO.getRating());
        existingProject.setUpdatedAt(LocalDateTime.now());
        
        Project updatedProject = projectRepository.save(existingProject);
        
        log.info("Successfully updated project with ID: {}", updatedProject.getId());
        return projectMapper.toDTO(updatedProject);
    }
    
    /**
     * Delete a project
     */
    @Transactional
    @CacheEvict(value = {"project", "projects", "projectsByStatus", "projectsByTechnology", "projectsSearch"}, allEntries = true)
    public void deleteProject(Long id) {
        log.info("Deleting project with ID: {}", id);
        
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        projectRepository.delete(project);
        
        log.info("Successfully deleted project with ID: {}", id);
    }
    
    /**
     * Get project statistics
     */
    @Cacheable(value = "projectStats")
    public ProjectStats getProjectStatistics() {
        log.info("Fetching project statistics");
        
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus("ACTIVE");
        long completedProjects = projectRepository.countByStatus("COMPLETED");
        long inProgressProjects = projectRepository.countByStatus("IN_PROGRESS");
        
        return ProjectStats.builder()
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .inProgressProjects(inProgressProjects)
                .build();
    }
    
    /**
     * Validate project data
     */
    private void validateProjectData(ProjectDTO projectDTO) {
        if (projectDTO.getTitle() == null || projectDTO.getTitle().trim().isEmpty()) {
            throw new BusinessException("Project title is required", "INVALID_TITLE");
        }
        
        if (projectDTO.getDescription() == null || projectDTO.getDescription().trim().isEmpty()) {
            throw new BusinessException("Project description is required", "INVALID_DESCRIPTION");
        }
        
        if (projectDTO.getTechnologies() == null || projectDTO.getTechnologies().isEmpty()) {
            throw new BusinessException("At least one technology must be specified", "INVALID_TECHNOLOGIES");
        }
        
        if (projectDTO.getPriority() != null && (projectDTO.getPriority() < 1 || projectDTO.getPriority() > 10)) {
            throw new BusinessException("Priority must be between 1 and 10", "INVALID_PRIORITY");
        }
        
        if (projectDTO.getRating() != null && (projectDTO.getRating() < 1 || projectDTO.getRating() > 5)) {
            throw new BusinessException("Rating must be between 1 and 5", "INVALID_RATING");
        }
    }
    
    /**
     * Project statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ProjectStats {
        private long totalProjects;
        private long activeProjects;
        private long completedProjects;
        private long inProgressProjects;
    }
}
