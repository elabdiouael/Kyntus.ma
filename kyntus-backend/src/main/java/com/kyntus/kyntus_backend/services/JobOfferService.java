package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.JobOffer;
import com.kyntus.kyntus_backend.repositories.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;

    public List<JobOffer> getAllJobOffers() {
        return jobOfferRepository.findAll();
    }

    public List<JobOffer> getActiveJobOffers() {
        return jobOfferRepository.findByIsActiveTrue();
    }

    public JobOffer getJobOfferById(Long id) {
        return jobOfferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre d'emploi introuvable b l'ID: " + id));
    }

    public JobOffer createJobOffer(JobOffer jobOffer) {
        return jobOfferRepository.save(jobOffer);
    }

    public JobOffer updateJobOffer(Long id, JobOffer jobOfferDetails) {
        JobOffer existingOffer = getJobOfferById(id);
        existingOffer.setTitle(jobOfferDetails.getTitle());
        existingOffer.setDescription(jobOfferDetails.getDescription());
        existingOffer.setRequirements(jobOfferDetails.getRequirements());
        existingOffer.setLocation(jobOfferDetails.getLocation());
        existingOffer.setIsActive(jobOfferDetails.getIsActive());
        return jobOfferRepository.save(existingOffer);
    }

    public void deleteJobOffer(Long id) {
        jobOfferRepository.deleteById(id);
    }
}