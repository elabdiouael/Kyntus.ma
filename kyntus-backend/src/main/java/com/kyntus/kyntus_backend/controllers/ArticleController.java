package com.kyntus.kyntus_backend.controllers;

import com.kyntus.kyntus_backend.entities.Article;
import com.kyntus.kyntus_backend.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    // UPDATE: Consumes multipart/form-data
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Article> createArticle(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Article article = Article.builder()
                .title(title)
                .content(content)
                .build();
        return new ResponseEntity<>(articleService.createArticle(article, file), HttpStatus.CREATED);
    }

    // UPDATE: Consumes multipart/form-data
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Article> updateArticle(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Article articleDetails = Article.builder()
                .title(title)
                .content(content)
                .build();
        return ResponseEntity.ok(articleService.updateArticle(id, articleDetails, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}