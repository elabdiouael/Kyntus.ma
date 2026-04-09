package com.kyntus.kyntus_backend.repositories;

import com.kyntus.kyntus_backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Methode darouriya bach Spring Security y-9elleb 3la l'user f l'login
    Optional<User> findByEmail(String email);

}