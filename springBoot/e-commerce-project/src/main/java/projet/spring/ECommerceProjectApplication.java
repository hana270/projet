package projet.spring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import projet.spring.entities.User;
import projet.spring.service.UserService;

@SpringBootApplication
public class ECommerceProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(ECommerceProjectApplication.class, args);
    }

    @Bean
    public CommandLineRunner init(UserService userService) {
        return args -> {
            // Create admin user if it doesn't exist
            if (userService.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("123456");
                admin.setRole("ADMIN");
                userService.saveUser(admin);
                System.out.println("Admin user created successfully.");
            }
        };
    }
}