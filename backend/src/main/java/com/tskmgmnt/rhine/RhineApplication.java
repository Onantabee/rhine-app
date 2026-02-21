package com.tskmgmnt.rhine;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@OpenAPIDefinition(
		info = @Info(
				title = "Rhine Project Manager"
		)
)
public class RhineApplication {
	public static void main(String[] args) {
		SpringApplication.run(RhineApplication.class, args);
	}
}
