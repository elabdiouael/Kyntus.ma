package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.Article;
import com.kyntus.kyntus_backend.repositories.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final FileStorageService fileStorageService; // Injectina storage

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable b l'ID: " + id));
    }

    // UPDATE: Zidna MultipartFile f l'Create
    public Article createArticle(Article article, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            article.setMediaUrl(fileName);
            article.setMediaType(determineMediaType(file.getContentType()));
        }
        return articleRepository.save(article);
    }

    // UPDATE: Zidna MultipartFile f l'Update
    public Article updateArticle(Long id, Article articleDetails, MultipartFile file) {
        Article existingArticle = getArticleById(id);
        existingArticle.setTitle(articleDetails.getTitle());
        existingArticle.setContent(articleDetails.getContent());

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            existingArticle.setMediaUrl(fileName);
            existingArticle.setMediaType(determineMediaType(file.getContentType()));
        }

        return articleRepository.save(existingArticle);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    // Helper bach n3erfou chno sayfet l'user
    private String determineMediaType(String contentType) {
        if (contentType == null) return "UNKNOWN";
        if (contentType.startsWith("image/")) return "IMAGE";
        if (contentType.startsWith("video/")) return "VIDEO";
        if (contentType.equals("application/pdf")) return "PDF";
        return "DOCUMENT";
    }
}