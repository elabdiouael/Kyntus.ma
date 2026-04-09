package com.kyntus.kyntus_backend.services;

import com.kyntus.kyntus_backend.entities.Article;
import com.kyntus.kyntus_backend.repositories.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable b l'ID: " + id));
    }

    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    public Article updateArticle(Long id, Article articleDetails) {
        Article existingArticle = getArticleById(id);
        existingArticle.setTitle(articleDetails.getTitle());
        existingArticle.setContent(articleDetails.getContent());
        existingArticle.setImageUrl(articleDetails.getImageUrl());
        return articleRepository.save(existingArticle);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}