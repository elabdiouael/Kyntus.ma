package com.kyntus.kyntus_backend.repositories;

import com.kyntus.kyntus_backend.entities.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByIsReadFalse(); // Bach njiboo les messages li mazal mat9rawch
}