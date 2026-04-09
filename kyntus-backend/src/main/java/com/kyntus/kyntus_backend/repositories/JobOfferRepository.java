package com.kyntus.kyntus_backend.repositories;

import com.kyntus.kyntus_backend.entities.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByIsActiveTrue(); // Custom method bach njiboo ghir les offres li mhloulin
}