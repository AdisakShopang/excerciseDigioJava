package com.example.springboot;

import java.util.Collections;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
// @RestController
public class Application {

	public static void main(String[] args) {
		// SpringApplication.run(Application.class, args);
		SpringApplication app = new SpringApplication(Application.class);
        app.setDefaultProperties(Collections
          .singletonMap("server.port", "8083"));
        app.run(args);
	}

	// @GetMapping
	// public String hello(){
	// 	return "hello world";
	// }

}
