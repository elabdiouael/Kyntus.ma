'use client';
import { useRouter } from 'next/navigation';
import styles from './topbar.module.css';

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    // N7iydou l'token w nrejj3ouh l page d'accueil wla login
    localStorage.removeItem('jwt_token');
    router.push('/login');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.pageTitle}>
        Tableau de bord
      </div>
      <div className={styles.userInfo}>
        <span>Bonjour, <strong>Admin</strong></span>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}