package com.sourav.portfolio.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class RateLimitConfig {
    
    /**
     * Rate limiter for contact form submissions
     */
    @Bean("contactRateLimiter")
    public Bucket contactRateLimiter() {
        // Allow 5 requests per hour per IP
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofHours(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Rate limiter for project API calls
     */
    @Bean("projectRateLimiter")
    public Bucket projectRateLimiter() {
        // Allow 100 requests per minute per IP
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Rate limiter for admin endpoints
     */
    @Bean("adminRateLimiter")
    public Bucket adminRateLimiter() {
        // Allow 30 requests per minute per IP
        Bandwidth limit = Bandwidth.classic(30, Refill.greedy(30, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
} 