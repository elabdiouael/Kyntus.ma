package com.kyntus.kyntus_backend.repositories;

import com.kyntus.kyntus_backend.entities.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
}