package com.sourav.portfolio.config;

import com.sourav.portfolio.model.Project;
import com.sourav.portfolio.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public void run(String... args) throws Exception {
        long count = projectRepository.count();
        logger.info("Current project count: {}", count);

        if (count == 0) {
            logger.info("Initializing sample projects...");

            projectRepository.save(new Project(
                    "Hospital Management System",
                    "Role-based HMS with appointment booking, payments, and video consultations. Built with Spring Boot, MySQL, and React.",
                    "https://github.com/sourav/hms",
                    "https://hms-demo.vercel.app",
                    "Java, Spring Boot, MySQL, React, Docker",
                    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
            ));

            projectRepository.save(new Project(
                    "E-Commerce Microservices",
                    "Scalable e-commerce platform using microservices architecture with Spring Cloud, Eureka, and API Gateway.",
                    "https://github.com/sourav/ecommerce-microservices",
                    "https://ecommerce-demo.herokuapp.com",
                    "Java, Spring Boot, Spring Cloud, PostgreSQL, Docker, Kubernetes",
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
            ));

            projectRepository.save(new Project(
                    "Task Management API",
                    "RESTful API for task management with JWT authentication, role-based access control, and real-time notifications.",
                    "https://github.com/sourav/task-api",
                    "https://task-api-demo.herokuapp.com",
                    "Java, Spring Boot, JWT, WebSocket, MySQL",
                    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
            ));

            logger.info("Sample projects initialized successfully");
        }
    }
}