'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import styles from './messages.module.css';

interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  isRead: boolean;
  sentAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await fetchApi('/contact');
      setMessages(data);
    } catch (error) {
      console.error("Erreur chargement messages", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Boîte de réception</h1>
      </div>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Expéditeur</th>
              <th>Email</th>
              <th>Sujet</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} style={{ backgroundColor: msg.isRead ? 'transparent' : '#f8fafc' }}>
                <td><strong>{msg.fullName}</strong></td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{new Date(msg.sentAt).toLocaleDateString()}</td>
                <td>
                  {msg.isRead ? (
                    <span style={{ color: '#94a3b8' }}>Lu</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Nouveau</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}