package com.sourav.portfolio.service;

import com.sourav.portfolio.model.Project;
import com.sourav.portfolio.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    
    private final ProjectRepository projectRepository;
    
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    
    /**
     * Get all projects with caching
     */
    @Cacheable(value = "projects", key = "'all'")
    public List<Project> getAllProjects() {
        logger.info("Fetching all projects from database");
        List<Project> projects = projectRepository.findAll();
        logger.info("Found {} projects", projects.size());
        return projects;
    }
    
    /**
     * Get project by ID with caching
     */
    @Cacheable(value = "projects", key = "#id")
    public Optional<Project> getProjectById(Long id) {
        logger.info("Fetching project with ID: {}", id);
        return projectRepository.findById(id);
    }
    
    /**
     * Create a new project
     */
    @CacheEvict(value = "projects", allEntries = true)
    public Project createProject(Project project) {
        logger.info("Creating new project: {}", project.getTitle());
        Project savedProject = projectRepository.save(project);
        logger.info("Project created successfully with ID: {}", savedProject.getId());
        return savedProject;
    }
    
    /**
     * Update an existing project
     */
    @CacheEvict(value = "projects", allEntries = true)
    public Optional<Project> updateProject(Long id, Project projectDetails) {
        logger.info("Updating project with ID: {}", id);
        
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setTitle(projectDetails.getTitle());
                    existingProject.setDescription(projectDetails.getDescription());
                    existingProject.setGithubLink(projectDetails.getGithubLink());
                    existingProject.setLiveLink(projectDetails.getLiveLink());
                    existingProject.setTechStack(projectDetails.getTechStack());
                    existingProject.setImageUrl(projectDetails.getImageUrl());
                    
                    Project updatedProject = projectRepository.save(existingProject);
                    logger.info("Project updated successfully: {}", updatedProject.getTitle());
                    return updatedProject;
                });
    }
    
    /**
     * Delete a project
     */
    @CacheEvict(value = "projects", allEntries = true)
    public boolean deleteProject(Long id) {
        logger.info("Deleting project with ID: {}", id);
        
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            logger.info("Project deleted successfully");
            return true;
        }
        
        logger.warn("Project with ID {} not found for deletion", id);
        return false;
    }
    
    /**
     * Check if project exists
     */
    public boolean projectExists(Long id) {
        return projectRepository.existsById(id);
    }
    
    /**
     * Get project count
     */
    public long getProjectCount() {
        return projectRepository.count();
    }
    
    /**
     * Clear all caches
     */
    @CacheEvict(value = "projects", allEntries = true)
    public void clearCache() {
        logger.info("Clearing project cache");
    }
} 