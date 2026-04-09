package com.kyntus.kyntus_backend.controllers;

import com.kyntus.kyntus_backend.entities.JobOffer;
import com.kyntus.kyntus_backend.services.JobOfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping
    public ResponseEntity<List<JobOffer>> getAllJobOffers() {
        return ResponseEntity.ok(jobOfferService.getAllJobOffers());
    }

    @GetMapping("/active")
    public ResponseEntity<List<JobOffer>> getActiveJobOffers() {
        return ResponseEntity.ok(jobOfferService.getActiveJobOffers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOffer> getJobOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(jobOfferService.getJobOfferById(id));
    }

    @PostMapping
    public ResponseEntity<JobOffer> createJobOffer(@RequestBody JobOffer jobOffer) {
        return new ResponseEntity<>(jobOfferService.createJobOffer(jobOffer), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobOffer> updateJobOffer(@PathVariable Long id, @RequestBody JobOffer jobOfferDetails) {
        return ResponseEntity.ok(jobOfferService.updateJobOffer(id, jobOfferDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobOffer(@PathVariable Long id) {
        jobOfferService.deleteJobOffer(id);
        return ResponseEntity.noContent().build();
    }
}