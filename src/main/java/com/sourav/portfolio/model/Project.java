
package com.sourav.portfolio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_projects_title", columnList = "title"),
    @Index(name = "idx_projects_created_date", columnList = "created_date")
})
@EntityListeners(AuditingEntityListener.class)
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    @Column(nullable = false, length = 255)
    private String title;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(length = 1000)
    private String description;
    
    @Size(max = 500, message = "GitHub link cannot exceed 500 characters")
    @Column(length = 500)
    private String githubLink;
    
    @Size(max = 500, message = "Live link cannot exceed 500 characters")
    @Column(length = 500)
    private String liveLink;
    
    @Size(max = 500, message = "Tech stack cannot exceed 500 characters")
    @Column(length = 500)
    private String techStack;
    
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    @Column(length = 500)
    private String imageUrl;
    
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
    
    @Version
    @Column(name = "version")
    private Long version;
    
    // Constructors
    public Project() {}
    
    public Project(String title, String description, String githubLink, String liveLink, String techStack, String imageUrl) {
        this.title = title;
        this.description = description;
        this.githubLink = githubLink;
        this.liveLink = liveLink;
        this.techStack = techStack;
        this.imageUrl = imageUrl;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }
    
    public String getLiveLink() { return liveLink; }
    public void setLiveLink(String liveLink) { this.liveLink = liveLink; }
    
    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    
    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", githubLink='" + githubLink + '\'' +
                ", liveLink='" + liveLink + '\'' +
                ", techStack='" + techStack + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", createdDate=" + createdDate +
                ", updatedDate=" + updatedDate +
                ", version=" + version +
                '}';
    }
}
