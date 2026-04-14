'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './topbar.module.css';

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/login');
  };

  return (
    <div className={styles.topbarWrapper}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={styles.topbar}
      >
        <div className={styles.pageTitle}>
          Command Center <span style={{ color: "#3b82f6" }}>//</span>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>A</div>
            <span className={styles.greeting}>Sys.Admin <strong>Kyntus</strong></span>
          </div>
          
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Délier
          </button>
        </div>
      </motion.header>
    </div>
  );
}