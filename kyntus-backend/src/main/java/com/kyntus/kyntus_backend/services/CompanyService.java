package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.Service;
import com.kyntus.kyntus_backend.repositories.ServiceRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class CompanyService {

    private final ServiceRepository serviceRepository;

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service introuvable b l'ID: " + id));
    }

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Service updateService(Long id, Service serviceDetails) {
        Service existingService = getServiceById(id);
        existingService.setTitle(serviceDetails.getTitle());
        existingService.setDescription(serviceDetails.getDescription());
        existingService.setIconUrl(serviceDetails.getIconUrl());
        return serviceRepository.save(existingService);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}