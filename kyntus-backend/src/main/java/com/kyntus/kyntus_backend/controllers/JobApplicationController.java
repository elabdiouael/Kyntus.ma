package com.kyntus.kyntus_backend.controllers;

import com.kyntus.kyntus_backend.entities.JobApplication;
import com.kyntus.kyntus_backend.services.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/offer/{offerId}")
    public ResponseEntity<JobApplication> createApplication(@PathVariable Long offerId, @RequestBody JobApplication application) {
        return new ResponseEntity<>(jobApplicationService.createApplication(offerId, application), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}