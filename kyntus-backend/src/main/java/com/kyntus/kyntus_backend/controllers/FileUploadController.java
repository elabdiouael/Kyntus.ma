package com.kyntus.kyntus_backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Kan-creyiw dossier ila makanch
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Kan-bedlo smya dyal fichier bach mayw9e3ch conflit (UUID)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // Kan-sauvegardew l'fichier
            Files.write(filePath, file.getBytes());

            // Kan-rej3o l'URL dyal tswira (JSON Format)
            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(Map.of("imageUrl", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur f l'upload dyal tswira"));
        }
    }
}