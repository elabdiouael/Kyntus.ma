package com.kyntus.kyntus_backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads/cvs/}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        try {
            // N-creyiw l'dossier ila makanch
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // N-generiw smiya unique bach mayw9e3ch ecrasement ila 2 drari semaw CV dyalhom "cv.pdf"
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            // N-copiw l'fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName; // Kan-rej3o ghir smiya dyal l'fichier bach n-savouha f l'BDD
        } catch (IOException e) {
            throw new RuntimeException("Erreur f l'enregistrement dyal l'CV", e);
        }
    }
}