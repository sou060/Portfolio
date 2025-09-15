package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.entity.Project;
import org.springframework.stereotype.Component;

/**
 * Mapper class for converting between Project entity and ProjectDTO
 */
@Component
public class ProjectMapper {
    
    /**
     * Convert Project entity to ProjectDTO
     */
    public ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }
        
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .shortDescription(project.getShortDescription())
                .technologies(project.getTechnologies())
                .liveUrl(project.getLiveUrl())
                .githubUrl(project.getGithubUrl())
                .imageUrl(project.getImageUrl())
                .status(project.getStatus())
                .priority(project.getPriority())
                .durationInWeeks(project.getDurationInWeeks())
                .features(project.getFeatures())
                .challenges(project.getChallenges())
                .achievements(project.getAchievements())
                .teamSize(project.getTeamSize())
                .clientName(project.getClientName())
                .clientFeedback(project.getClientFeedback())
                .rating(project.getRating())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .createdBy(project.getCreatedBy())
                .updatedBy(project.getUpdatedBy())
                .build();
    }
    
    /**
     * Convert ProjectDTO to Project entity
     */
    public Project toEntity(ProjectDTO projectDTO) {
        if (projectDTO == null) {
            return null;
        }
        
        Project project = new Project();
        project.setId(projectDTO.getId());
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setShortDescription(projectDTO.getShortDescription());
        project.setTechnologies(projectDTO.getTechnologies());
        project.setLiveUrl(projectDTO.getLiveUrl());
        project.setGithubUrl(projectDTO.getGithubUrl());
        project.setImageUrl(projectDTO.getImageUrl());
        project.setStatus(projectDTO.getStatus());
        project.setPriority(projectDTO.getPriority());
        project.setDurationInWeeks(projectDTO.getDurationInWeeks());
        project.setFeatures(projectDTO.getFeatures());
        project.setChallenges(projectDTO.getChallenges());
        project.setAchievements(projectDTO.getAchievements());
        project.setTeamSize(projectDTO.getTeamSize());
        project.setClientName(projectDTO.getClientName());
        project.setClientFeedback(projectDTO.getClientFeedback());
        project.setRating(projectDTO.getRating());
        project.setCreatedAt(projectDTO.getCreatedAt());
        project.setUpdatedAt(projectDTO.getUpdatedAt());
        project.setCreatedBy(projectDTO.getCreatedBy());
        project.setUpdatedBy(projectDTO.getUpdatedBy());
        
        return project;
    }
    
    /**
     * Update existing Project entity with ProjectDTO data
     */
    public void updateEntity(Project existingProject, ProjectDTO projectDTO) {
        if (existingProject == null || projectDTO == null) {
            return;
        }
        
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
        existingProject.setUpdatedAt(java.time.LocalDateTime.now());
        existingProject.setUpdatedBy(projectDTO.getUpdatedBy());
    }
}
