// src/lib/api.ts
const BASE_URL = 'http://localhost:8081/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    
    // 1. Njibou l'token mn LocalStorage (M-verifiyin bli 7na f l'Client-side)
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('jwt_token') || '';
    }

    // 2. N-gadou les headers
    const headers = new Headers(options.headers || {});
    
    // 🚨 L'FIX L'KBEER 🚨: N-verifiw wesh l'body fih fichier (FormData) awla JSON 3adi
    if (!(options.body instanceof FormData)) {
        // Ila machi fichier, n-forciw JSON
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    } else {
        // CRITICAL: Ila kan FormData (fih Fichier), l'browser khasso y-géré Content-Type bo7do (bach yzid l'boundary)
        headers.delete('Content-Type');
    }

    // 3. Nls9ou l'Token f l'Authorization Header
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        
        // 🚨 RISK MANAGEMENT: Ila l'token sala l'we9t dyalo awla t-beddel (401 Unauthorized / 403 Forbidden)
        if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('jwt_token');
                window.location.href = '/login'; // N-tejriw 3lih l'page login automatiquement
            }
            throw new Error("Session expirée ou accès refusé.");
        }

        // Ila l'backend red lina erreur khra
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Erreur API: ${response.status}`);
        }

        // Kaynin des requêtes li makayredouch JSON (bhal DELETE) awla 204 No Content
        if (response.status === 204) {
            return null; 
        }

        // N-gériw l'parsing dyal JSON b rzana bach maycrachich ila kan l'body khawi
        const text = await response.text();
        return text ? JSON.parse(text) : {};
        
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
}