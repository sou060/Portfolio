package com.sourav.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);
    private static final String RESUME_PDF_PATH = "static/resume.pdf";

    public Resource getResumePdf() throws IOException {
        log.info("Loading resume PDF from classpath: {}", RESUME_PDF_PATH);
        
        Resource resource = new ClassPathResource(RESUME_PDF_PATH);
        
        if (!resource.exists()) {
            log.error("Resume PDF not found at: {}", RESUME_PDF_PATH);
            throw new IOException("Resume PDF file not found");
        }
        
        log.info("Resume PDF loaded successfully");
        return resource;
    }
} 