package com.portfolio.service;

import com.portfolio.dto.ContactDTO;
import com.portfolio.entity.Contact;
import org.springframework.stereotype.Component;

/**
 * Mapper class for converting between Contact entity and ContactDTO
 */
@Component
public class ContactMapper {
    
    /**
     * Convert Contact entity to ContactDTO
     */
    public ContactDTO toDTO(Contact contact) {
        if (contact == null) {
            return null;
        }
        
        return ContactDTO.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .phoneNumber(contact.getPhoneNumber())
                .company(contact.getCompany())
                .jobTitle(contact.getJobTitle())
                .website(contact.getWebsite())
                .contactType(contact.getContactType())
                .status(contact.getStatus())
                .adminNotes(contact.getAdminNotes())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .createdBy(contact.getCreatedBy())
                .updatedBy(contact.getUpdatedBy())
                .build();
    }
    
    /**
     * Convert ContactDTO to Contact entity
     */
    public Contact toEntity(ContactDTO contactDTO) {
        if (contactDTO == null) {
            return null;
        }
        
        Contact contact = new Contact();
        contact.setId(contactDTO.getId());
        contact.setName(contactDTO.getName());
        contact.setEmail(contactDTO.getEmail());
        contact.setSubject(contactDTO.getSubject());
        contact.setMessage(contactDTO.getMessage());
        contact.setPhoneNumber(contactDTO.getPhoneNumber());
        contact.setCompany(contactDTO.getCompany());
        contact.setJobTitle(contactDTO.getJobTitle());
        contact.setWebsite(contactDTO.getWebsite());
        contact.setContactType(contactDTO.getContactType());
        contact.setStatus(contactDTO.getStatus());
        contact.setAdminNotes(contactDTO.getAdminNotes());
        contact.setCreatedAt(contactDTO.getCreatedAt());
        contact.setUpdatedAt(contactDTO.getUpdatedAt());
        contact.setCreatedBy(contactDTO.getCreatedBy());
        contact.setUpdatedBy(contactDTO.getUpdatedBy());
        
        return contact;
    }
    
    /**
     * Update existing Contact entity with ContactDTO data
     */
    public void updateEntity(Contact existingContact, ContactDTO contactDTO) {
        if (existingContact == null || contactDTO == null) {
            return;
        }
        
        existingContact.setName(contactDTO.getName());
        existingContact.setEmail(contactDTO.getEmail());
        existingContact.setSubject(contactDTO.getSubject());
        existingContact.setMessage(contactDTO.getMessage());
        existingContact.setPhoneNumber(contactDTO.getPhoneNumber());
        existingContact.setCompany(contactDTO.getCompany());
        existingContact.setJobTitle(contactDTO.getJobTitle());
        existingContact.setWebsite(contactDTO.getWebsite());
        existingContact.setContactType(contactDTO.getContactType());
        existingContact.setStatus(contactDTO.getStatus());
        existingContact.setAdminNotes(contactDTO.getAdminNotes());
        existingContact.setUpdatedAt(java.time.LocalDateTime.now());
        existingContact.setUpdatedBy(contactDTO.getUpdatedBy());
    }
}
