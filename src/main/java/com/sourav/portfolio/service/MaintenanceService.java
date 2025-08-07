package com.sourav.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class MaintenanceService {
    
    private static final Logger logger = LoggerFactory.getLogger(MaintenanceService.class);
    
    private final CacheManager cacheManager;
    private final ContactService contactService;
    private final ProjectService projectService;
    
    @Autowired
    public MaintenanceService(CacheManager cacheManager, 
                            ContactService contactService, 
                            ProjectService projectService) {
        this.cacheManager = cacheManager;
        this.contactService = contactService;
        this.projectService = projectService;
    }
    
    /**
     * Daily cache cleanup at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void dailyCacheCleanup() {
        logger.info("Starting daily cache cleanup");
        
        try {
            cacheManager.getCacheNames().forEach(cacheName -> {
                cacheManager.getCache(cacheName).clear();
                logger.info("Cleared cache: {}", cacheName);
            });
            
            logger.info("Daily cache cleanup completed successfully");
        } catch (Exception e) {
            logger.error("Error during daily cache cleanup: ", e);
        }
    }
    
    /**
     * Weekly system health check every Sunday at 3 AM
     */
    @Scheduled(cron = "0 0 3 ? * SUN")
    public void weeklyHealthCheck() {
        logger.info("Starting weekly system health check");
        
        try {
            // Check project count
            long projectCount = projectService.getProjectCount();
            logger.info("Total projects: {}", projectCount);
            
            // Check message count
            long messageCount = contactService.getAllMessages().size();
            long unreadCount = contactService.getUnreadCount();
            logger.info("Total messages: {}, Unread: {}", messageCount, unreadCount);
            
            // Check memory usage
            Runtime runtime = Runtime.getRuntime();
            long usedMemory = runtime.totalMemory() - runtime.freeMemory();
            long maxMemory = runtime.maxMemory();
            double memoryUsagePercent = (double) usedMemory / maxMemory * 100;
            
            logger.info("Memory usage: {} MB / {} MB ({:.2f}%)", 
                usedMemory / 1024 / 1024, 
                maxMemory / 1024 / 1024, 
                memoryUsagePercent);
            
            // Alert if memory usage is high
            if (memoryUsagePercent > 80) {
                logger.warn("High memory usage detected: {:.2f}%", memoryUsagePercent);
            }
            
            logger.info("Weekly health check completed successfully");
        } catch (Exception e) {
            logger.error("Error during weekly health check: ", e);
        }
    }
    
    /**
     * Monthly cleanup of old data (first day of month at 4 AM)
     */
    @Scheduled(cron = "0 0 4 1 * ?")
    public void monthlyDataCleanup() {
        logger.info("Starting monthly data cleanup");
        
        try {
            // Clean up old contact messages (older than 1 year)
            LocalDateTime oneYearAgo = LocalDateTime.now().minus(1, ChronoUnit.YEARS);
            // This would require adding a method to ContactService to delete old messages
            // For now, just log the intention
            logger.info("Would clean up messages older than: {}", oneYearAgo);
            
            // Clear all caches
            projectService.clearCache();
            logger.info("Cleared project cache");
            
            logger.info("Monthly data cleanup completed successfully");
        } catch (Exception e) {
            logger.error("Error during monthly data cleanup: ", e);
        }
    }
    
    /**
     * Hourly cache statistics (every hour)
     */
    @Scheduled(fixedRate = 3600000) // 1 hour in milliseconds
    public void hourlyCacheStats() {
        logger.debug("Cache statistics:");
        cacheManager.getCacheNames().forEach(cacheName -> {
            // Note: Getting cache statistics would require additional configuration
            // For now, just log cache names
            logger.debug("Cache: {}", cacheName);
        });
    }
    
    /**
     * Manual cache cleanup method
     */
    public void manualCacheCleanup() {
        logger.info("Manual cache cleanup requested");
        dailyCacheCleanup();
    }
    
    /**
     * Get system statistics
     */
    public SystemStats getSystemStats() {
        Runtime runtime = Runtime.getRuntime();
        
        return new SystemStats(
            projectService.getProjectCount(),
            contactService.getAllMessages().size(),
            contactService.getUnreadCount(),
            runtime.totalMemory() - runtime.freeMemory(),
            runtime.maxMemory(),
            runtime.availableProcessors(),
            LocalDateTime.now()
        );
    }
    
    // System statistics data class
    public static class SystemStats {
        private final long totalProjects;
        private final long totalMessages;
        private final long unreadMessages;
        private final long usedMemory;
        private final long maxMemory;
        private final int availableProcessors;
        private final LocalDateTime timestamp;
        
        public SystemStats(long totalProjects, long totalMessages, long unreadMessages,
                          long usedMemory, long maxMemory, int availableProcessors, 
                          LocalDateTime timestamp) {
            this.totalProjects = totalProjects;
            this.totalMessages = totalMessages;
            this.unreadMessages = unreadMessages;
            this.usedMemory = usedMemory;
            this.maxMemory = maxMemory;
            this.availableProcessors = availableProcessors;
            this.timestamp = timestamp;
        }
        
        // Getters
        public long getTotalProjects() { return totalProjects; }
        public long getTotalMessages() { return totalMessages; }
        public long getUnreadMessages() { return unreadMessages; }
        public long getUsedMemory() { return usedMemory; }
        public long getMaxMemory() { return maxMemory; }
        public int getAvailableProcessors() { return availableProcessors; }
        public LocalDateTime getTimestamp() { return timestamp; }
        
        public double getMemoryUsagePercent() {
            return (double) usedMemory / maxMemory * 100;
        }
    }
} 