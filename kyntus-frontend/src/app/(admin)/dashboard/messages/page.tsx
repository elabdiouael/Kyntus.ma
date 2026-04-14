'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';
import styles from './messages.module.css';

interface ContactMessage { id: number; fullName: string; email: string; subject: string; isRead: boolean; sentAt: string; }

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try { const data = await fetchApi('/contact'); setMessages(data.sort((a: any, b: any) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const markAsRead = async (id: number) => {
    try { await fetchApi(`/contact/${id}/read`, { method: 'PUT' }); loadMessages(); } 
    catch (error) { console.error(error); }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const rowVars = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />
        <h1 className={styles.title}>Comms_Link (Inbox)</h1>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444", fontFamily: "monospace" }}>[ SCANNING_FREQUENCIES... ]</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Transmitter</th>
                <th>Data_Payload (Subject)</th>
                <th>Timestamp</th>
                <th>Link_Status</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVars} initial="hidden" animate="visible">
              {messages.map((msg) => (
                <motion.tr 
                  key={msg.id} variants={rowVars} 
                  className={msg.isRead ? styles.rowRead : styles.rowUnread}
                  onClick={() => !msg.isRead && markAsRead(msg.id)}
                  style={{ cursor: msg.isRead ? 'default' : 'pointer' }}
                >
                  <td>
                    <strong style={{ color: msg.isRead ? '#cbd5e1' : '#ffffff', fontSize: '1rem' }}>{msg.fullName}</strong>
                    <div className={styles.emailText}>{msg.email}</div>
                  </td>
                  <td>
                    <div className={styles.subjectText} style={{ opacity: msg.isRead ? 0.7 : 1 }}>{msg.subject || 'NO_SUBJECT'}</div>
                  </td>
                  <td>
                    <span style={{ color: '#64748b', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {new Date(msg.sentAt).toLocaleString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    {msg.isRead ? (
                      <span className={`${styles.statusBadge} ${styles.statusRead}`}>[ READ ]</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusUnread}`}>
                        <span className={styles.blinkingDot} /> [ INCOMING ]
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>NO_INCOMING_TRANSMISSIONS</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}