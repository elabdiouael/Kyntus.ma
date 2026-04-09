package com.kyntus.kyntus_backend.repositories;

import com.kyntus.kyntus_backend.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
}