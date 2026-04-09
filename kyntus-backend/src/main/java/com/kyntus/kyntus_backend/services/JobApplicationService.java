package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.JobApplication;
import com.kyntus.kyntus_backend.entities.JobOffer;
import com.kyntus.kyntus_backend.repositories.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferService jobOfferService; // Bach n-verifiw wesh l'offre kayna

    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    public List<JobApplication> getApplicationsByOfferId(Long offerId) {
        return jobApplicationRepository.findByJobOfferId(offerId);
    }

    public JobApplication createApplication(Long offerId, JobApplication application) {
        JobOffer offer = jobOfferService.getJobOfferById(offerId);
        application.setJobOffer(offer);
        return jobApplicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        jobApplicationRepository.deleteById(id);
    }
}