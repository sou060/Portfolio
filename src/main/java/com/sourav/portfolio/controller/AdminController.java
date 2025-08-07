package com.sourav.portfolio.controller;

import com.sourav.portfolio.model.ContactMessage;
import com.sourav.portfolio.model.Project;
import com.sourav.portfolio.service.AnalyticsService;
import com.sourav.portfolio.service.ContactService;
import com.sourav.portfolio.service.ProjectService;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    private final AnalyticsService analyticsService;
    private final ProjectService projectService;
    private final ContactService contactService;
    
    @Autowired
    public AdminController(AnalyticsService analyticsService, 
                          ProjectService projectService, 
                          ContactService contactService) {
        this.analyticsService = analyticsService;
        this.projectService = projectService;
        this.contactService = contactService;
    }
    
    /**
     * Get analytics summary
     */
    @GetMapping("/analytics")
    @Timed(value = "admin.analytics.request", description = "Time taken to get analytics")
    public ResponseEntity<AnalyticsService.AnalyticsSummary> getAnalytics() {
        logger.info("GET /api/admin/analytics called");
        
        try {
            AnalyticsService.AnalyticsSummary summary = analyticsService.getAnalyticsSummary();
            logger.info("Analytics summary retrieved successfully");
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("Error getting analytics: ", e);
            analyticsService.trackError("analytics_fetch_error", "/api/admin/analytics");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get system health and statistics
     */
    @GetMapping("/system/health")
    @Timed(value = "admin.system.health", description = "Time taken to get system health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        logger.info("GET /api/admin/system/health called");
        
        try {
            Map<String, Object> health = new HashMap<>();
            
            // Project statistics
            health.put("totalProjects", projectService.getProjectCount());
            
            // Contact statistics
            health.put("totalMessages", contactService.getAllMessages().size());
            health.put("unreadMessages", contactService.getUnreadCount());
            
            // System information
            Runtime runtime = Runtime.getRuntime();
            health.put("memoryUsage", runtime.totalMemory() - runtime.freeMemory());
            health.put("totalMemory", runtime.totalMemory());
            health.put("maxMemory", runtime.maxMemory());
            health.put("availableProcessors", runtime.availableProcessors());
            
            logger.info("System health retrieved successfully");
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            logger.error("Error getting system health: ", e);
            analyticsService.trackError("system_health_error", "/api/admin/system/health");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all contact messages (admin only)
     */
    @GetMapping("/messages")
    @Timed(value = "admin.messages.list", description = "Time taken to list messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        logger.info("GET /api/admin/messages called");
        
        try {
            List<ContactMessage> messages = contactService.getAllMessages();
            logger.info("Retrieved {} messages", messages.size());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error getting messages: ", e);
            analyticsService.trackError("messages_fetch_error", "/api/admin/messages");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Mark message as read
     */
    @PutMapping("/messages/{id}/read")
    @Timed(value = "admin.messages.mark-read", description = "Time taken to mark message as read")
    public ResponseEntity<Void> markMessageAsRead(@PathVariable Long id) {
        logger.info("PUT /api/admin/messages/{}/read called", id);
        
        try {
            if (contactService.markAsRead(id)) {
                logger.info("Message marked as read: {}", id);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Message not found for marking as read: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error marking message as read: ", e);
            analyticsService.trackError("mark_read_error", "/api/admin/messages/" + id + "/read");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete message
     */
    @DeleteMapping("/messages/{id}")
    @Timed(value = "admin.messages.delete", description = "Time taken to delete message")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        logger.info("DELETE /api/admin/messages/{} called", id);
        
        try {
            if (contactService.deleteMessage(id)) {
                logger.info("Message deleted successfully: {}", id);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Message not found for deletion: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting message: ", e);
            analyticsService.trackError("message_delete_error", "/api/admin/messages/" + id);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Clear all caches
     */
    @PostMapping("/cache/clear")
    @Timed(value = "admin.cache.clear", description = "Time taken to clear cache")
    public ResponseEntity<Map<String, String>> clearAllCaches() {
        logger.info("POST /api/admin/cache/clear called");
        
        try {
            projectService.clearCache();
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "All caches cleared successfully");
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            logger.info("All caches cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error clearing caches: ", e);
            analyticsService.trackError("cache_clear_error", "/api/admin/cache/clear");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get recent activity
     */
    @GetMapping("/activity/recent")
    @Timed(value = "admin.activity.recent", description = "Time taken to get recent activity")
    public ResponseEntity<Map<String, Object>> getRecentActivity() {
        logger.info("GET /api/admin/activity/recent called");
        
        try {
            Map<String, Object> activity = new HashMap<>();
            
            // Recent messages
            activity.put("recentMessages", contactService.getRecentMessages(10));
            
            // Analytics summary
            activity.put("analytics", analyticsService.getAnalyticsSummary());
            
            logger.info("Recent activity retrieved successfully");
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            logger.error("Error getting recent activity: ", e);
            analyticsService.trackError("activity_fetch_error", "/api/admin/activity/recent");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 