package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.JobApplication;
import com.kyntus.kyntus_backend.entities.JobOffer;
import com.kyntus.kyntus_backend.repositories.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferService jobOfferService;
    private final FileStorageService fileStorageService; // L'INJECTION JDIDA

    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    public List<JobApplication> getApplicationsByOfferId(Long offerId) {
        return jobApplicationRepository.findByJobOfferId(offerId);
    }

    // L'UPDATE HNA: Zidna MultipartFile
    public JobApplication createApplication(Long offerId, JobApplication application, MultipartFile file) {
        // 1. N-sauvghardiw l'fichier lwel
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            application.setResumeUrl(fileName); // N-savou smiya d l'fichier f l'BDD
        }

        // 2. Ila kan sayft offerId, n-linkiwha. Ila makanch (Spontanée), atb9a null
        if (offerId != null) {
            JobOffer offer = jobOfferService.getJobOfferById(offerId);
            application.setJobOffer(offer);
        }

        return jobApplicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        jobApplicationRepository.deleteById(id);
    }
}