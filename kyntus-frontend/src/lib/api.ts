// src/lib/api.ts
const BASE_URL = 'http://localhost:8080/api';

// Fonction helper bach n-gériw les requêtes facilement
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    
    // Njibou l'token mn LocalStorage ila kan l'utilisateur m-connecté (Admin)
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt_token') || '';
    }

    // N-gadou les headers (Nzidou l'token ila kayn)
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        // Ila l'backend red lina erreur
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erreur API: ${response.status}`);
        }

        // Kaynin des requêtes li makayredouch JSON (bhal DELETE)
        if (response.status === 204) {
            return null; 
        }

        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
}