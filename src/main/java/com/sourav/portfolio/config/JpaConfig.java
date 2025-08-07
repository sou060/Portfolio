package com.sourav.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.sourav.portfolio.repository")
@EnableTransactionManagement
public class JpaConfig {
    // JPA configuration is handled by Spring Boot auto-configuration
    // This class enables auditing and transaction management
} 