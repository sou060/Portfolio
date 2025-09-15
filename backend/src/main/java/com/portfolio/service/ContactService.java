package com.portfolio.service;

import com.portfolio.dto.ContactDTO;
import com.portfolio.entity.Contact;
import com.portfolio.exception.BusinessException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Contact operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {
    
    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;
    private final JavaMailSender mailSender;
    
    /**
     * Get all contacts with pagination and sorting
     */
    @Cacheable(value = "contacts", key = "#page + '_' + #size + '_' + #sortBy + '_' + #sortDirection")
    public Page<ContactDTO> getAllContacts(int page, int size, String sortBy, String sortDirection) {
        log.info("Fetching contacts - page: {}, size: {}, sortBy: {}, sortDirection: {}", 
                page, size, sortBy, sortDirection);
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Contact> contacts = contactRepository.findAll(pageable);
        
        return contacts.map(contactMapper::toDTO);
    }
    
    /**
     * Get contact by ID
     */
    @Cacheable(value = "contact", key = "#id")
    public ContactDTO getContactById(Long id) {
        log.info("Fetching contact with ID: {}", id);
        
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        
        return contactMapper.toDTO(contact);
    }
    
    /**
     * Get contacts by status
     */
    @Cacheable(value = "contactsByStatus", key = "#status + '_' + #page + '_' + #size")
    public Page<ContactDTO> getContactsByStatus(String status, int page, int size) {
        log.info("Fetching contacts by status: {} - page: {}, size: {}", status, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> contacts = contactRepository.findByStatus(status, pageable);
        
        return contacts.map(contactMapper::toDTO);
    }
    
    /**
     * Get contacts by type
     */
    @Cacheable(value = "contactsByType", key = "#contactType + '_' + #page + '_' + #size")
    public Page<ContactDTO> getContactsByType(String contactType, int page, int size) {
        log.info("Fetching contacts by type: {} - page: {}, size: {}", contactType, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> contacts = contactRepository.findByContactType(contactType, pageable);
        
        return contacts.map(contactMapper::toDTO);
    }
    
    /**
     * Search contacts
     */
    @Cacheable(value = "contactsSearch", key = "#query + '_' + #page + '_' + #size")
    public Page<ContactDTO> searchContacts(String query, int page, int size) {
        log.info("Searching contacts with query: {} - page: {}, size: {}", query, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> contacts = contactRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrSubjectContainingIgnoreCase(
                query, query, query, pageable);
        
        return contacts.map(contactMapper::toDTO);
    }
    
    /**
     * Create a new contact
     */
    @Transactional
    @CacheEvict(value = {"contacts", "contactsByStatus", "contactsByType", "contactsSearch"}, allEntries = true)
    public ContactDTO createContact(ContactDTO contactDTO) {
        log.info("Creating new contact from: {}", contactDTO.getEmail());
        
        // Validate contact data
        validateContactData(contactDTO);
        
        // Check if contact with same email and subject already exists within last 24 hours
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        if (contactRepository.existsByEmailAndSubjectAndCreatedAtAfter(
                contactDTO.getEmail(), contactDTO.getSubject(), twentyFourHoursAgo)) {
            throw new BusinessException("A contact with the same email and subject was already submitted within the last 24 hours", 
                    "DUPLICATE_CONTACT");
        }
        
        Contact contact = contactMapper.toEntity(contactDTO);
        contact.setStatus("NEW");
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());
        
        Contact savedContact = contactRepository.save(contact);
        
        // Send notification email
        sendNotificationEmail(savedContact);
        
        log.info("Successfully created contact with ID: {}", savedContact.getId());
        return contactMapper.toDTO(savedContact);
    }
    
    /**
     * Update contact status (Admin only)
     */
    @Transactional
    @CacheEvict(value = {"contact", "contacts", "contactsByStatus", "contactsByType", "contactsSearch"}, allEntries = true)
    public ContactDTO updateContactStatus(Long id, String status, String adminNotes) {
        log.info("Updating contact status for ID: {} to: {}", id, status);
        
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new BusinessException("Invalid status: " + status, "INVALID_STATUS");
        }
        
        contact.setStatus(status);
        contact.setAdminNotes(adminNotes);
        contact.setUpdatedAt(LocalDateTime.now());
        
        Contact updatedContact = contactRepository.save(contact);
        
        log.info("Successfully updated contact status for ID: {}", id);
        return contactMapper.toDTO(updatedContact);
    }
    
    /**
     * Delete a contact
     */
    @Transactional
    @CacheEvict(value = {"contact", "contacts", "contactsByStatus", "contactsByType", "contactsSearch"}, allEntries = true)
    public void deleteContact(Long id) {
        log.info("Deleting contact with ID: {}", id);
        
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        
        contactRepository.delete(contact);
        
        log.info("Successfully deleted contact with ID: {}", id);
    }
    
    /**
     * Get contact statistics
     */
    @Cacheable(value = "contactStats")
    public ContactStats getContactStatistics() {
        log.info("Fetching contact statistics");
        
        long totalContacts = contactRepository.count();
        long newContacts = contactRepository.countByStatus("NEW");
        long inProgressContacts = contactRepository.countByStatus("IN_PROGRESS");
        long resolvedContacts = contactRepository.countByStatus("RESOLVED");
        long closedContacts = contactRepository.countByStatus("CLOSED");
        
        return ContactStats.builder()
                .totalContacts(totalContacts)
                .newContacts(newContacts)
                .inProgressContacts(inProgressContacts)
                .resolvedContacts(resolvedContacts)
                .closedContacts(closedContacts)
                .build();
    }
    
    /**
     * Validate contact data
     */
    private void validateContactData(ContactDTO contactDTO) {
        if (contactDTO.getName() == null || contactDTO.getName().trim().isEmpty()) {
            throw new BusinessException("Name is required", "INVALID_NAME");
        }
        
        if (contactDTO.getEmail() == null || contactDTO.getEmail().trim().isEmpty()) {
            throw new BusinessException("Email is required", "INVALID_EMAIL");
        }
        
        if (contactDTO.getSubject() == null || contactDTO.getSubject().trim().isEmpty()) {
            throw new BusinessException("Subject is required", "INVALID_SUBJECT");
        }
        
        if (contactDTO.getMessage() == null || contactDTO.getMessage().trim().isEmpty()) {
            throw new BusinessException("Message is required", "INVALID_MESSAGE");
        }
        
        // Validate email format
        if (!isValidEmail(contactDTO.getEmail())) {
            throw new BusinessException("Invalid email format", "INVALID_EMAIL_FORMAT");
        }
    }
    
    /**
     * Validate email format
     */
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    }
    
    /**
     * Validate status
     */
    private boolean isValidStatus(String status) {
        return List.of("NEW", "IN_PROGRESS", "RESOLVED", "CLOSED").contains(status);
    }
    
    /**
     * Send notification email
     */
    private void sendNotificationEmail(Contact contact) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@portfolio.com"); // Replace with actual admin email
            message.setSubject("New Contact Form Submission: " + contact.getSubject());
            message.setText(buildEmailContent(contact));
            
            mailSender.send(message);
            log.info("Notification email sent for contact ID: {}", contact.getId());
        } catch (Exception e) {
            log.error("Failed to send notification email for contact ID: {}", contact.getId(), e);
        }
    }
    
    /**
     * Build email content
     */
    private String buildEmailContent(Contact contact) {
        StringBuilder content = new StringBuilder();
        content.append("New contact form submission received:\n\n");
        content.append("Name: ").append(contact.getName()).append("\n");
        content.append("Email: ").append(contact.getEmail()).append("\n");
        content.append("Subject: ").append(contact.getSubject()).append("\n");
        content.append("Message: ").append(contact.getMessage()).append("\n");
        
        if (contact.getPhoneNumber() != null) {
            content.append("Phone: ").append(contact.getPhoneNumber()).append("\n");
        }
        
        if (contact.getCompany() != null) {
            content.append("Company: ").append(contact.getCompany()).append("\n");
        }
        
        if (contact.getJobTitle() != null) {
            content.append("Job Title: ").append(contact.getJobTitle()).append("\n");
        }
        
        content.append("\nSubmitted at: ").append(contact.getCreatedAt()).append("\n");
        
        return content.toString();
    }
    
    /**
     * Contact statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ContactStats {
        private long totalContacts;
        private long newContacts;
        private long inProgressContacts;
        private long resolvedContacts;
        private long closedContacts;
    }
}
