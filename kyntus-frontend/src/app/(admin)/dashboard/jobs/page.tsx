'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './jobs.module.css';

interface JobOffer { 
  id: number; 
  title: string; 
  description: string; 
  requirements: string; 
  location: string; 
  isActive: boolean; 
  postedAt: string;
  imageUrl?: string; // Tzad l'attribut d tswira
}

// Bdelha 3la 7sab l'port dyal l'backend dyalk (8080 wla 8081)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', location: '', description: '', requirements: '', isActive: true, imageUrl: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try { const data = await fetchApi('/job-offers'); setJobs(data); } 
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const openModal = (job?: JobOffer) => {
    if (job) { 
      setEditingId(job.id); 
      setFormData({ title: job.title, location: job.location, description: job.description, requirements: job.requirements || '', isActive: job.isActive, imageUrl: job.imageUrl || '' }); 
    } else { 
      setEditingId(null); 
      setFormData({ title: '', location: '', description: '', requirements: '', isActive: true, imageUrl: '' }); 
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setFormData({ title: '', location: '', description: '', requirements: '', isActive: true, imageUrl: '' }); setEditingId(null); };

  // Logic jdid dyal upload tswira
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImg(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: uploadData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (error) {
      alert("Erreur f l'upload dyal l'image.");
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      if (editingId) await fetchApi(`/job-offers/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      else await fetchApi('/job-offers', { method: 'POST', body: JSON.stringify(formData) });
      closeModal(); loadJobs();
    } catch (error) { alert("Erreur d'enregistrement."); } finally { setIsSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("CONFIRM_DELETE: Voulez-vous vraiment supprimer cette offre ?")) {
      try { await fetchApi(`/job-offers/${id}`, { method: 'DELETE' }); loadJobs(); } 
      catch (error) { alert("Erreur de suppression."); }
    }
  };

  // T7addou les types hna b Variants
  const containerVars: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const rowVars: Variants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />
        <h1 className={styles.title}>Recruitment Node</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          DEPLOY_OFFER
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#34d399", fontFamily: "monospace" }}>[ FETCHING_JOBS... ]</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Designation & Specs</th>
                <th>Sector (Location)</th>
                <th>Node_Status</th>
                <th style={{ textAlign: 'right' }}>Execute</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVars} initial="hidden" animate="visible">
              {jobs.map((job) => (
                <motion.tr key={job.id} variants={rowVars} className={styles.tableRow}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {job.imageUrl && (
                        <img src={`${API_BASE_URL}${job.imageUrl}`} alt="Job Node" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #34d399' }} />
                      )}
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{job.title}</strong>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                          {job.description.length > 60 ? job.description.substring(0, 60) + '...' : job.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.locationBadge}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {job.location}
                    </span>
                  </td>
                  <td>
                    <span className={job.isActive ? styles.badgeActive : styles.badgeClosed}>
                      {job.isActive ? '[ ACTIVE ]' : '[ CLOSED ]'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(job)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(job.id)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>NO_OFFERS_DEPLOYED</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ y: 50, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <h2 className={styles.modalTitle}>{editingId ? 'Update_Offer_Node' : 'Initialize_New_Offer'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Designation</label>
                    <input type="text" className={styles.input} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Ex: Lead Engineer..." />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Sector (Location)</label>
                    <input type="text" className={styles.input} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required placeholder="Ex: Sector 7, Mars..." />
                  </div>
                </div>

                {/* Input jdid dyal tswira */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Node_Image (Optionnel)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.input} style={{ flex: 1 }} />
                    {isUploadingImg && <span style={{ color: '#34d399', fontSize: '0.85rem' }}>UPLOADING...</span>}
                  </div>
                  {formData.imageUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={`${API_BASE_URL}${formData.imageUrl}`} alt="Preview" style={{ height: '80px', borderRadius: '4px', border: '1px solid #34d399' }} />
                    </div>
                  )}
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Protocol_Description</label>
                  <textarea className={styles.textarea} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required placeholder="Enter role parameters..." />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>System_Requirements</label>
                  <textarea className={styles.textarea} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder="Skills, tools, stacks..." />
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    <input type="checkbox" className={styles.checkbox} checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span style={{ fontWeight: '600', color: '#ffffff', fontFamily: 'monospace', fontSize: '0.85rem', marginLeft: '10px' }}>SET_NODE_ACTIVE (Open for incoming packets)</span>
                  </label>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnCancel} onClick={closeModal} disabled={isSaving || isUploadingImg}>Abort</button>
                  <button type="submit" className={styles.btnSave} disabled={isSaving || isUploadingImg}>{isSaving ? 'Processing...' : 'Execute()'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}