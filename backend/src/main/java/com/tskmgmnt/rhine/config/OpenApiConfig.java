package com.tskmgmnt.rhine.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Rhine Project Manager API")
                        .version("1.0")
                        .description("API documentation for Rhine Project Management System"))
                .tags(List.of(
                        new Tag().name("Authentication").description("Login, Registration, and Verification"),
                        new Tag().name("Users").description("User profile and account management"),
                        new Tag().name("Projects").description("Manage projects, memberships, and roles"),
                        new Tag().name("Tasks").description("Manage project tasks"),
                        new Tag().name("Comments").description("Manage task comments")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .name("bearerAuth")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
