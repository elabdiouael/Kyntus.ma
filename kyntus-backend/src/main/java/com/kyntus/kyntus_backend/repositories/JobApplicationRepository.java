package com.kyntus.kyntus_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.kyntus.kyntus_backend.entities.JobApplication; // <--- HADA HOWA L'IMPORT LI KAN NA9ESS
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobOfferId(Long jobOfferId); // Bach njiboo les candidatures dyal offre specifique
}