package com.kyntus.kyntus_backend.controllers;

import com.kyntus.kyntus_backend.entities.JobApplication; // <--- HA L'IMPORT LI KAN NASS9
import com.kyntus.kyntus_backend.services.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllApplications() {
        return ResponseEntity.ok(jobApplicationService.getAllApplications());
    }

    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<JobApplication>> getApplicationsByOfferId(@PathVariable Long offerId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsByOfferId(offerId));
    }

    // L'UPDATE L'KBER: Endpoint jdid kay-supporter l'fichiers w offerId optionnel
    @PostMapping(value = "/apply", consumes = {"multipart/form-data"})
    public ResponseEntity<JobApplication> applyWithCv(
            @RequestParam(value = "offerId", required = false) Long offerId,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam("cvFile") MultipartFile cvFile
    ) {
        // N-bniw l'objet manuellement mn les params
        JobApplication application = JobApplication.builder()
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .build();

        return new ResponseEntity<>(jobApplicationService.createApplication(offerId, application, cvFile), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}