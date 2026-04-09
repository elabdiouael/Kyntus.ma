package com.kyntus.kyntus_backend.config;

import com.kyntus.kyntus_backend.entities.Role;
import com.kyntus.kyntus_backend.entities.User;
import com.kyntus.kyntus_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@kyntus.com";

        // Kan-verifiw wesh l'admin deja kayn f l'BDD bach man-creyiwhch jouj merrat
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstname("Admin")
                    .lastname("Kyntus")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("password123")) // L'mot de passe par défaut
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ COMPTE ADMIN CRÉÉ AVEC SUCCÈS !");
            System.out.println("📧 Email: " + adminEmail);
            System.out.println("🔑 Password: password123");
        } else {
            System.out.println("ℹ️ Le compte admin existe déjà.");
        }
    }
}