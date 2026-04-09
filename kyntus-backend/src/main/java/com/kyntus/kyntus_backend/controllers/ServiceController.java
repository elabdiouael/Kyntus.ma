package com.kyntus.kyntus_backend.controllers;

import com.kyntus.kyntus_backend.entities.Service;
import com.kyntus.kyntus_backend.services.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(companyService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getServiceById(id));
    }

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return new ResponseEntity<>(companyService.createService(service), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        return ResponseEntity.ok(companyService.updateService(id, serviceDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        companyService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}