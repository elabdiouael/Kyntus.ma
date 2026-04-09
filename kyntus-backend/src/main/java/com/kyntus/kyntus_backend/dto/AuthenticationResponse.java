package com.kyntus.kyntus_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token; // Hada hwa l'JWT li ghay-stocké Next.js f LocalStorage ola Cookies
}