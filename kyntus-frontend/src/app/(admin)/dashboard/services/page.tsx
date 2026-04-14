'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './services.module.css';

interface Service { id: number; title: string; description: string; createdAt: string; }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try { const data = await fetchApi('/services'); setServices(data); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const openModal = (service?: Service) => {
    if (service) { setEditingId(service.id); setFormData({ title: service.title, description: service.description }); } 
    else { setEditingId(null); setFormData({ title: '', description: '' }); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setFormData({ title: '', description: '' }); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      if (editingId) await fetchApi(`/services/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      else await fetchApi('/services', { method: 'POST', body: JSON.stringify(formData) });
      closeModal(); loadServices();
    } catch (error) { alert("Erreur d'enregistrement."); } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("CONFIRM_DELETE: Voulez-vous vraiment supprimer ce service ?")) {
      try { await fetchApi(`/services/${id}`, { method: 'DELETE' }); loadServices(); } 
      catch (error) { alert("Erreur de suppression."); }
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const rowVars = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />
        <h1 className={styles.title}>System Services</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          DEPLOY_SERVICE
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#3b82f6", fontFamily: "monospace" }}>[ FETCHING_DATA... ]</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Node_ID</th>
                <th>Service_Name</th>
                <th>Protocol_Description</th>
                <th style={{ textAlign: 'right' }}>Execute</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVars} initial="hidden" animate="visible">
              {services.map((service) => (
                <motion.tr key={service.id} variants={rowVars} className={styles.tableRow}>
                  <td><span className={styles.idBadge}>#{service.id}</span></td>
                  <td><strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{service.title}</strong></td>
                  <td style={{ color: 'rgba(255,255,255,0.6)' }}>{service.description.length > 60 ? service.description.substring(0, 60) + '...' : service.description}</td>
                  <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                    {/* SVGs in place of Emojis */}
                    <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(service)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(service.id)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>NO_SERVICES_DEPLOYED</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ y: 50, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <h2 className={styles.modalTitle}>{editingId ? 'Update_Service_Node' : 'Initialize_New_Service'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Service_Designation</label>
                  <input type="text" className={styles.input} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Ex: Quantum Network..." />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Data_Payload (Description)</label>
                  <textarea className={styles.textarea} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required placeholder="Enter service parameters..." />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnCancel} onClick={closeModal} disabled={isSaving}>Abort</button>
                  <button type="submit" className={styles.btnSave} disabled={isSaving}>{isSaving ? 'Processing...' : 'Execute()'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}