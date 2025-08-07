package com.sourav.portfolio.service;

import com.sourav.portfolio.model.ContactMessage;
import com.sourav.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
    
    private final ContactMessageRepository contactMessageRepository;
    
    @Autowired
    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }
    
    /**
     * Save a new contact message with spam protection
     */
    public ContactMessage saveMessage(ContactMessage message, HttpServletRequest request) {
        logger.info("Processing contact message from: {}", message.getEmail());
        
        // Extract client information
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        
        message.setIpAddress(ipAddress);
        message.setUserAgent(userAgent);
        
        // Basic spam protection
        if (isSpam(message, ipAddress)) {
            logger.warn("Potential spam detected from IP: {}", ipAddress);
            throw new RuntimeException("Message rejected due to spam protection");
        }
        
        ContactMessage savedMessage = contactMessageRepository.save(message);
        logger.info("Contact message saved successfully with ID: {}", savedMessage.getId());
        
        return savedMessage;
    }
    
    /**
     * Get all contact messages (admin only)
     */
    public List<ContactMessage> getAllMessages() {
        logger.info("Fetching all contact messages");
        return contactMessageRepository.findAll();
    }
    
    /**
     * Get message by ID
     */
    public Optional<ContactMessage> getMessageById(Long id) {
        logger.info("Fetching contact message with ID: {}", id);
        return contactMessageRepository.findById(id);
    }
    
    /**
     * Mark message as read
     */
    public boolean markAsRead(Long id) {
        logger.info("Marking message as read: {}", id);
        
        return contactMessageRepository.findById(id)
                .map(message -> {
                    message.setIsRead(true);
                    contactMessageRepository.save(message);
                    logger.info("Message marked as read: {}", id);
                    return true;
                })
                .orElse(false);
    }
    
    /**
     * Delete a message
     */
    public boolean deleteMessage(Long id) {
        logger.info("Deleting contact message: {}", id);
        
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            logger.info("Contact message deleted successfully");
            return true;
        }
        
        logger.warn("Contact message with ID {} not found for deletion", id);
        return false;
    }
    
    /**
     * Get unread message count
     */
    public long getUnreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }
    
    /**
     * Get messages by email
     */
    public List<ContactMessage> getMessagesByEmail(String email) {
        logger.info("Fetching messages for email: {}", email);
        return contactMessageRepository.findByEmailOrderByCreatedDateDesc(email);
    }
    
    /**
     * Get recent messages
     */
    public List<ContactMessage> getRecentMessages(int limit) {
        logger.info("Fetching {} recent messages", limit);
        return contactMessageRepository.findTop10ByOrderByCreatedDateDesc();
    }
    
    /**
     * Extract client IP address
     */
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
    
    /**
     * Basic spam protection
     */
    private boolean isSpam(ContactMessage message, String ipAddress) {
        // Check for suspicious patterns
        if (message.getMessage() != null && message.getMessage().toLowerCase().contains("buy now")) {
            return true;
        }
        
        if (message.getMessage() != null && message.getMessage().toLowerCase().contains("click here")) {
            return true;
        }
        
        // Check for multiple messages from same IP in short time
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentMessages = contactMessageRepository.countByIpAddressAndCreatedDateAfter(ipAddress, oneHourAgo);
        
        if (recentMessages >= 5) {
            logger.warn("Too many messages from IP {} in the last hour", ipAddress);
            return true;
        }
        
        return false;
    }
} 