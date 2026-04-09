package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.ContactMessage;
import com.kyntus.kyntus_backend.repositories.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalse();
    }

    public ContactMessage createMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message introuvable b l'ID: " + id));
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }

    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }
}