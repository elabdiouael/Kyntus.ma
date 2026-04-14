'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';
import styles from './home.module.css';

export default function DashboardHome() {
  const [stats, setStats] = useState({ services: 0, articles: 0, jobs: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [servicesRes, articlesRes, jobsRes, messagesRes] = await Promise.all([
        fetchApi('/services'), fetchApi('/articles'), fetchApi('/job-offers'), fetchApi('/contact/unread')
      ]);
      setStats({ services: servicesRes.length, articles: articlesRes.length, jobs: jobsRes.length, unreadMessages: messagesRes.length });
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loader}>[ SYSTEM_LOADING... ]</div></div>;

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVars = { hidden: { opacity: 0, y: 30, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } } };

  return (
    <motion.div className={styles.container} variants={containerVars} initial="hidden" animate="visible">
      
      {/* ── HEADER BANNER ── */}
      <motion.div className={styles.headerCard} variants={cardVars}>
        <h1 className={styles.greeting}>
          System Override, <span className={styles.greetingAccent}>Commander</span>
        </h1>
        <p style={{ color: '#94a3b8', fontFamily: 'monospace', letterSpacing: '1px' }}>
          &gt; KYNTUS_CENTRAL_NODE_ONLINE
        </p>
      </motion.div>

      {/* ── HOLOGRAPHIC BENTO GRID ── */}
      <div className={styles.grid}>
        
        {/* CARD 1: SERVICES */}
        <motion.div className={`${styles.statCard} ${styles.themeBlue}`} variants={cardVars} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div className={styles.scanline} />
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Active Nodes<br/>[ Services ]</span>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
          </div>
          <div className={styles.cardValue}>
            {stats.services} <span className={styles.cardStatus}>SYS_OPT</span>
          </div>
        </motion.div>

        {/* CARD 2: ARTICLES */}
        <motion.div className={`${styles.statCard} ${styles.themePurple}`} variants={cardVars} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div className={styles.scanline} />
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Data Packets<br/>[ News ]</span>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
            </div>
          </div>
          <div className={styles.cardValue}>
            {stats.articles} <span className={styles.cardStatus}>SYNCED</span>
          </div>
        </motion.div>

        {/* CARD 3: JOBS */}
        <motion.div className={`${styles.statCard} ${styles.themeGreen}`} variants={cardVars} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div className={styles.scanline} />
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Open Channels<br/>[ Careers ]</span>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
          </div>
          <div className={styles.cardValue}>
            {stats.jobs} <span className={styles.cardStatus}>BROADCAST</span>
          </div>
        </motion.div>

        {/* CARD 4: MESSAGES */}
        <motion.div className={`${styles.statCard} ${styles.themeRed}`} variants={cardVars} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <div className={styles.scanline} />
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Unread Comms<br/>[ Inbox ]</span>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
          </div>
          <div className={styles.cardValue}>
            {stats.unreadMessages} 
            {stats.unreadMessages > 0 ? <span className={styles.cardStatus}>ALERT</span> : <span className={styles.cardStatus} style={{color: '#94a3b8', background: 'rgba(255,255,255,0.05)'}}>CLEAR</span>}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}