'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminCursor from '@/app/(admin)/dashboard/components/ux/AdminCursor'; 
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🚨 L'FIX HNA: L'Endpoint s7i7 howa /authenticate 🚨
      const response = await fetch('http://localhost:8081/api/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'ACCESS_DENIED: Invalid credentials.');
      }

      const data = await response.json();
      
      // Kan-sauvegardew l'Token li 3tana Spring Boot
      localStorage.setItem('jwt_token', data.token);
      
      // Routing l'Dashboard!
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'SYSTEM_ERROR: Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🚨 FIX: L'CURSOR WLLA BERRA L'CONTAINER DYAL 3D PERSPECTIVE 🚨 */}
      <AdminCursor />

      <div className={styles.container}>
        
        {/* ── 3D MOVING BACKGROUND ── */}
        <div className={styles.movingGrid} />
        
        {/* ── AMBIENT ORBS ── */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        <motion.div 
          className={styles.loginBox}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              Kyntus<span className={styles.logoAccent}>.</span>
            </div>
            <div className={styles.subtitle}>[ AUTHENTICATION_NODE ]</div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className={styles.errorMsg}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Admin_ID (Email)</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>&gt;</span>
                <input 
                  type="email" 
                  className={styles.input} 
                  placeholder="admin@kyntus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className={styles.focusLine} />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Passkey (Password)</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>&gt;</span>
                <input 
                  type="password" 
                  className={styles.input} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className={styles.focusLine} />
              </div>
            </div>

            <motion.button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {!loading && <div className={styles.btnLaser} />}
              <span style={{ position: 'relative', zIndex: 2 }}>
                {loading ? '[ VERIFYING... ]' : 'INITIATE_LOGIN()'}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}