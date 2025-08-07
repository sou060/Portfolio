package com.sourav.portfolio.repository;

import com.sourav.portfolio.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    
    /**
     * Count unread messages
     */
    long countByIsReadFalse();
    
    /**
     * Find messages by email ordered by creation date
     */
    List<ContactMessage> findByEmailOrderByCreatedDateDesc(String email);
    
    /**
     * Find top 10 recent messages
     */
    @Query("SELECT cm FROM ContactMessage cm ORDER BY cm.createdDate DESC")
    List<ContactMessage> findTop10ByOrderByCreatedDateDesc();
    
    /**
     * Count messages by IP address and date range
     */
    long countByIpAddressAndCreatedDateAfter(String ipAddress, LocalDateTime after);
}
