'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import styles from './home.module.css';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    services: 0,
    articles: 0,
    jobs: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Promise.all kat-khelina nsiftou ga3 les requêtes f de9a we7da (Performance x100)
      const [servicesRes, articlesRes, jobsRes, messagesRes] = await Promise.all([
        fetchApi('/services'),
        fetchApi('/articles'),
        fetchApi('/job-offers'),
        fetchApi('/contact/unread') // Njibou ghir les messages li mazal ma t9rawch
      ]);

      setStats({
        services: servicesRes.length,
        articles: articlesRes.length,
        jobs: jobsRes.length,
        unreadMessages: messagesRes.length
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>⏳ Chargement de vos statistiques...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Bonjour, Admin 👋</h1>
        <p className={styles.subtitle}>Voici le résumé en temps réel de l'activité de Kyntus.</p>
      </div>

      <div className={styles.grid}>
        
        {/* Carte Services */}
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3>Services Actifs</h3>
            <p>{stats.services}</p>
          </div>
          <div className={`${styles.cardIcon} ${styles.iconBlue}`}>
            ⚙️
          </div>
        </div>

        {/* Carte Articles */}
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3>Actualités</h3>
            <p>{stats.articles}</p>
          </div>
          <div className={`${styles.cardIcon} ${styles.iconPurple}`}>
            📰
          </div>
        </div>

        {/* Carte Jobs */}
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3>Offres d'emploi</h3>
            <p>{stats.jobs}</p>
          </div>
          <div className={`${styles.cardIcon} ${styles.iconGreen}`}>
            💼
          </div>
        </div>

        {/* Carte Messages (Rouge ila kayn jdid) */}
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <h3>Nouveaux Leads</h3>
            <p className={stats.unreadMessages > 0 ? styles.textRed : ''}>
              {stats.unreadMessages}
            </p>
          </div>
          <div className={`${styles.cardIcon} ${styles.iconRed}`}>
            ✉️
          </div>
        </div>

      </div>
    </div>
  );
}