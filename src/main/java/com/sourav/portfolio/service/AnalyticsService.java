package com.sourav.portfolio.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    
    private final MeterRegistry meterRegistry;
    private final Counter pageViewCounter;
    private final Counter contactFormCounter;
    private final Counter projectViewCounter;
    private final Timer requestTimer;
    
    @Autowired
    public AnalyticsService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        // Initialize counters
        this.pageViewCounter = Counter.builder("portfolio.page.views")
                .description("Number of page views")
                .register(meterRegistry);
        
        this.contactFormCounter = Counter.builder("portfolio.contact.submissions")
                .description("Number of contact form submissions")
                .register(meterRegistry);
        
        this.projectViewCounter = Counter.builder("portfolio.project.views")
                .description("Number of project views")
                .register(meterRegistry);
        
        this.requestTimer = Timer.builder("portfolio.request.duration")
                .description("Request duration")
                .register(meterRegistry);
    }
    
    /**
     * Track page view
     */
    @Async("taskExecutor")
    public void trackPageView(String page, HttpServletRequest request) {
        try {
            pageViewCounter.increment();
            
            // Track additional metrics
            meterRegistry.counter("portfolio.page.views", 
                "page", page,
                "user_agent", getClientInfo(request))
                .increment();
            
            logger.info("Page view tracked: {} from IP: {}", page, getClientIpAddress(request));
        } catch (Exception e) {
            logger.error("Error tracking page view: ", e);
        }
    }
    
    /**
     * Track contact form submission
     */
    @Async("taskExecutor")
    public void trackContactSubmission(String email, HttpServletRequest request) {
        try {
            contactFormCounter.increment();
            
            meterRegistry.counter("portfolio.contact.submissions",
                "email_domain", extractDomain(email))
                .increment();
            
            logger.info("Contact submission tracked from: {} IP: {}", email, getClientIpAddress(request));
        } catch (Exception e) {
            logger.error("Error tracking contact submission: ", e);
        }
    }
    
    /**
     * Track project view
     */
    @Async("taskExecutor")
    public void trackProjectView(Long projectId, String projectTitle, HttpServletRequest request) {
        try {
            projectViewCounter.increment();
            
            meterRegistry.counter("portfolio.project.views",
                "project_id", projectId.toString(),
                "project_title", projectTitle)
                .increment();
            
            logger.info("Project view tracked: {} (ID: {}) from IP: {}", 
                projectTitle, projectId, getClientIpAddress(request));
        } catch (Exception e) {
            logger.error("Error tracking project view: ", e);
        }
    }
    
    /**
     * Track request duration
     */
    public Timer.Sample startRequestTimer() {
        return Timer.start(meterRegistry);
    }
    
    public void stopRequestTimer(Timer.Sample sample, String endpoint) {
        try {
            sample.stop(Timer.builder("portfolio.request.duration")
                    .tag("endpoint", endpoint)
                    .register(meterRegistry));
        } catch (Exception e) {
            logger.error("Error stopping request timer: ", e);
        }
    }
    
    /**
     * Track error occurrence
     */
    public void trackError(String errorType, String endpoint) {
        try {
            meterRegistry.counter("portfolio.errors",
                "type", errorType,
                "endpoint", endpoint)
                .increment();
            
            logger.warn("Error tracked: {} at endpoint: {}", errorType, endpoint);
        } catch (Exception e) {
            logger.error("Error tracking error: ", e);
        }
    }
    
    /**
     * Get analytics summary
     */
    public AnalyticsSummary getAnalyticsSummary() {
        return new AnalyticsSummary(
            (long) pageViewCounter.count(),
            (long) contactFormCounter.count(),
            (long) projectViewCounter.count(),
            LocalDateTime.now()
        );
    }
    
    // Helper methods
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private String getClientInfo(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent != null && userAgent.length() > 100) {
            return userAgent.substring(0, 100) + "...";
        }
        return userAgent != null ? userAgent : "Unknown";
    }
    
    private String extractDomain(String email) {
        if (email != null && email.contains("@")) {
            return email.substring(email.indexOf("@") + 1);
        }
        return "unknown";
    }
    
    // Analytics summary data class
    public static class AnalyticsSummary {
        private final long totalPageViews;
        private final long totalContactSubmissions;
        private final long totalProjectViews;
        private final LocalDateTime lastUpdated;
        
        public AnalyticsSummary(long totalPageViews, long totalContactSubmissions, 
                              long totalProjectViews, LocalDateTime lastUpdated) {
            this.totalPageViews = totalPageViews;
            this.totalContactSubmissions = totalContactSubmissions;
            this.totalProjectViews = totalProjectViews;
            this.lastUpdated = lastUpdated;
        }
        
        // Getters
        public long getTotalPageViews() { return totalPageViews; }
        public long getTotalContactSubmissions() { return totalContactSubmissions; }
        public long getTotalProjectViews() { return totalProjectViews; }
        public LocalDateTime getLastUpdated() { return lastUpdated; }
    }
} 