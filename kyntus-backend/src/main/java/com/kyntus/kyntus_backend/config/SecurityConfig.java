package com.kyntus.kyntus_backend.config;

import com.kyntus.kyntus_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Ma kan7tajouhch m3a JWT
                .cors(cors -> cors.configure(http)) // Kay-récupérer l'configuration li derti f CorsConfig
                .authorizeHttpRequests(auth -> auth
                        // Les routes publiques (Ay wahed y9der ydkhel lihom)
                        .requestMatchers("/api/auth/**").permitAll() // Login & Register
                        .requestMatchers(HttpMethod.GET, "/api/services/**", "/api/articles/**", "/api/job-offers/**").permitAll() // Ychouf l'contenu
                        .requestMatchers(HttpMethod.POST, "/api/contact", "/api/job-applications/offer/**").permitAll() // Ysifet form

                        // Ay route khra (bhal POST, PUT, DELETE dyal les articles) khassha tkon ADMIN
                        .anyRequest().hasRole("ADMIN")
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Ma kan-stockiwch les sessions, kolchi b l'token
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}