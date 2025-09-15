package com.sourav.portfolio.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:5000}")
    private String serverPort;

    @Value("${spring.application.name:portfolio}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Portfolio API")
                        .description("""
                                A comprehensive REST API for Sourav Mondal's portfolio application.
                                
                                ## Features
                                - **Project Management**: CRUD operations for portfolio projects
                                - **Contact Management**: Handle contact messages and inquiries
                                - **Authentication**: JWT-based authentication for admin operations
                                - **Analytics**: Track visitor metrics and engagement
                                - **Resume Management**: Upload and serve resume documents
                                
                                ## Authentication
                                Most endpoints are public, but admin operations require JWT authentication.
                                Use the `/api/auth/login` endpoint to obtain a token.
                                
                                ## Rate Limiting
                                - Public endpoints: 100 requests per minute per IP
                                - Authenticated endpoints: 1000 requests per minute per user
                                - Admin endpoints: 500 requests per minute per user
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Sourav Mondal")
                                .email("sourav.mondal@email.com")
                                .url("https://github.com/souravmondal"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Development server"),
                        new Server()
                                .url("https://api.souravmondal.dev")
                                .description("Production server")))
                .tags(List.of(
                        new Tag().name("Authentication").description("Authentication and authorization endpoints"),
                        new Tag().name("Projects").description("Project management endpoints"),
                        new Tag().name("Contact").description("Contact message endpoints"),
                        new Tag().name("Admin").description("Administrative endpoints"),
                        new Tag().name("Analytics").description("Analytics and metrics endpoints"),
                        new Tag().name("Resume").description("Resume management endpoints"),
                        new Tag().name("Health").description("Health check and monitoring endpoints")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from login endpoint")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
