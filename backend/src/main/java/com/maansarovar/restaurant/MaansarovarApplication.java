package com.maansarovar.restaurant;

import com.maansarovar.restaurant.entity.AdminUser;
import com.maansarovar.restaurant.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class MaansarovarApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaansarovarApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdminUser(
            AdminUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.initial-username:admin}") String initialUsername,
            @Value("${app.admin.initial-password:Admin@Maansarovar2026}") String initialPassword,
            @Value("${app.admin.initial-email:admin@maansarovar.com}") String initialEmail) {

        return args -> {
            if (!userRepository.existsByUsername(initialUsername)) {
                AdminUser admin = AdminUser.builder()
                        .username(initialUsername)
                        .passwordHash(passwordEncoder.encode(initialPassword))
                        .email(initialEmail)
                        .role("ROLE_ADMIN")
                        .build();

                userRepository.save(admin);
                System.out.println(">>> Initialized default Admin User: " + initialUsername);
            }
        };
    }
}
