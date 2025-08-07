package com.sourav.portfolio.controller;

import com.sourav.portfolio.model.ContactMessage;
import com.sourav.portfolio.service.AnalyticsService;
import com.sourav.portfolio.service.ContactService;
import io.micrometer.core.annotation.Timed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    
    private final ContactService contactService;
    private final AnalyticsService analyticsService;

    @Autowired
    public ContactController(ContactService contactService, AnalyticsService analyticsService) {
        this.contactService = contactService;
        this.analyticsService = analyticsService;
    }

    /**
     * Save a new contact message
     */
    @PostMapping
    @Timed(value = "contact.submit", description = "Time taken to submit contact message")
    public ResponseEntity<Map<String, String>> saveMessage(@Valid @RequestBody ContactMessage message, 
                                                          HttpServletRequest request) {
        logger.info("POST /api/contact called from: {}", message.getEmail());
        
        try {
            ContactMessage savedMessage = contactService.saveMessage(message, request);
            logger.info("Contact message saved successfully with ID: {}", savedMessage.getId());
            
            // Track analytics
            analyticsService.trackContactSubmission(message.getEmail(), request);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Message received successfully! I'll get back to you soon.");
            response.put("id", savedMessage.getId().toString());
            response.put("timestamp", savedMessage.getCreatedDate().toString());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            logger.warn("Message rejected: {}", e.getMessage());
            analyticsService.trackError("contact_rejection", "/api/contact");
            
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Error saving contact message: ", e);
            analyticsService.trackError("contact_save_error", "/api/contact");
            
            Map<String, String> response = new HashMap<>();
            response.put("error", "Internal server error. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get all messages (admin only)
     */
    @GetMapping
    @Timed(value = "contact.list", description = "Time taken to list all contact messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages(HttpServletRequest request) {
        logger.info("GET /api/contact called");
        
        try {
            List<ContactMessage> messages = contactService.getAllMessages();
            logger.info("Returning {} contact messages", messages.size());
            
            // Track analytics
            analyticsService.trackPageView("contact-admin", request);
            
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching contact messages: ", e);
            analyticsService.trackError("contact_list_error", "/api/contact");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get message by ID
     */
    @GetMapping("/{id}")
    @Timed(value = "contact.get", description = "Time taken to get contact message by ID")
    public ResponseEntity<ContactMessage> getMessageById(@PathVariable Long id, HttpServletRequest request) {
        logger.info("GET /api/contact/{} called", id);
        
        try {
            return contactService.getMessageById(id)
                    .map(message -> {
                        logger.info("Contact message found: {}", message.getId());
                        return ResponseEntity.ok(message);
                    })
                    .orElseGet(() -> {
                        logger.warn("Contact message not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching contact message with ID {}: ", id, e);
            analyticsService.trackError("contact_get_error", "/api/contact/" + id);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Mark message as read
     */
    @PutMapping("/{id}/read")
    @Timed(value = "contact.mark-read", description = "Time taken to mark message as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        logger.info("PUT /api/contact/{}/read called", id);
        
        try {
            if (contactService.markAsRead(id)) {
                logger.info("Message marked as read: {}", id);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Message not found for marking as read: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error marking message as read with ID {}: ", id, e);
            analyticsService.trackError("contact_mark_read_error", "/api/contact/" + id + "/read");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete a message
     */
    @DeleteMapping("/{id}")
    @Timed(value = "contact.delete", description = "Time taken to delete contact message")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        logger.info("DELETE /api/contact/{} called", id);
        
        try {
            if (contactService.deleteMessage(id)) {
                logger.info("Contact message deleted successfully");
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Contact message not found for deletion with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting contact message with ID {}: ", id, e);
            analyticsService.trackError("contact_delete_error", "/api/contact/" + id);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get unread count
     */
    @GetMapping("/unread/count")
    @Timed(value = "contact.unread-count", description = "Time taken to get unread count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        logger.info("GET /api/contact/unread/count called");
        
        try {
            long count = contactService.getUnreadCount();
            Map<String, Long> response = new HashMap<>();
            response.put("unreadCount", count);
            
            logger.info("Unread message count: {}", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting unread count: ", e);
            analyticsService.trackError("contact_unread_count_error", "/api/contact/unread/count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get recent messages
     */
    @GetMapping("/recent")
    @Timed(value = "contact.recent", description = "Time taken to get recent messages")
    public ResponseEntity<List<ContactMessage>> getRecentMessages() {
        logger.info("GET /api/contact/recent called");
        
        try {
            List<ContactMessage> messages = contactService.getRecentMessages(10);
            logger.info("Returning {} recent messages", messages.size());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching recent messages: ", e);
            analyticsService.trackError("contact_recent_error", "/api/contact/recent");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logger.warn("Validation errors: {}", errors);
        analyticsService.trackError("contact_validation_error", "/api/contact");
        return ResponseEntity.badRequest().body(errors);
    }
}
