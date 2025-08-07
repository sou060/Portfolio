package com.sourav.portfolio.controller;

import com.sourav.portfolio.service.ResumeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://souravmondal.dev"})
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);
    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadResume() {
        try {
            log.info("Resume download requested");
            
            Resource resource = resumeService.getResumePdf();
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"resume.pdf\"")
                    .body(resource);
                    
        } catch (IOException e) {
            log.error("Error serving resume PDF: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/preview")
    public ResponseEntity<Resource> previewResume() {
        try {
            log.info("Resume preview requested");
            
            Resource resource = resumeService.getResumePdf();
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"Sourav_Mondal_Resume.pdf\"")
                    .body(resource);
                    
        } catch (IOException e) {
            log.error("Error serving resume PDF preview: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
} 