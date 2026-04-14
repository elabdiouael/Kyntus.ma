'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';
import styles from './applications.module.css';

interface JobOffer { id: number; title: string; }
interface JobApplication { id: number; fullName: string; email: string; phone: string; resumeUrl: string; appliedAt: string; jobOffer: JobOffer | null; }

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    try {
      const data = await fetchApi('/job-applications');
      setApplications(data.sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()));
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("CONFIRM_DELETE: Voulez-vous vraiment supprimer cette candidature ?")) {
      try { await fetchApi(`/job-applications/${id}`, { method: 'DELETE' }); loadApplications(); } 
      catch (error) { console.error(error); }
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const rowVars = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />
        <h1 className={styles.title}>Candidate Databanks</h1>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#22d3ee", fontFamily: "monospace" }}>[ DECRYPTING_CV_PACKETS... ]</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Identity</th>
                <th>Comms_Link</th>
                <th>Target_Node (Poste)</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Execute</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVars} initial="hidden" animate="visible">
              {applications.map((app) => (
                <motion.tr key={app.id} variants={rowVars} className={styles.tableRow}>
                  <td>
                    <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{app.fullName}</strong>
                  </td>
                  <td>
                    <div style={{ color: '#22d3ee', fontSize: '0.9rem', fontWeight: 600 }}>{app.email}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{app.phone || 'NO_SIGNAL'}</div>
                  </td>
                  <td>
                    {app.jobOffer ? (
                      <span className={styles.badgeOffer}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        {app.jobOffer.title}
                      </span>
                    ) : (
                      <span className={styles.badgeSpontaneous}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Spontaneous
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                      {new Date(app.appliedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <a 
                      href={`http://localhost:8081/uploads/${app.resumeUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.cvBtn}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      EXTRACT_CV
                    </a>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(app.id)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>NO_DATABANKS_FOUND</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}