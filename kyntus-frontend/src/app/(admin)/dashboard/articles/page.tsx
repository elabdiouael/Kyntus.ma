'use client';
import { useEffect, useState, useRef } from 'react';
import { fetchApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './articles.module.css';

interface Article { id: number; title: string; content: string; mediaUrl: string; mediaType: string; publishedAt: string; }

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadArticles(); }, []);

  const loadArticles = async () => {
    try { const data = await fetchApi('/articles'); setArticles(data.sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())); } 
    catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const openModal = (article?: Article) => {
    if (article) { setEditingId(article.id); setFormData({ title: article.title, content: article.content }); setSelectedFile(null); } 
    else { setEditingId(null); setFormData({ title: '', content: '' }); setSelectedFile(null); }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setFormData({ title: '', content: '' }); setSelectedFile(null); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (selectedFile) data.append("file", selectedFile);

    try {
      if (editingId) await fetchApi(`/articles/${editingId}`, { method: 'PUT', body: data });
      else await fetchApi('/articles', { method: 'POST', body: data });
      closeModal(); loadArticles();
    } catch (error) { alert("Erreur d'enregistrement."); } finally { setIsSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("CONFIRM_DELETE: Voulez-vous vraiment supprimer cet article ?")) {
      try { await fetchApi(`/articles/${id}`, { method: 'DELETE' }); loadArticles(); } 
      catch (error) { alert("Erreur de suppression."); }
    }
  };

  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const rowVars = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } };

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className={styles.headerCard}>
        <div className={styles.headerGlow} />
        <h1 className={styles.title}>Publications Node</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          DEPLOY_ARTICLE
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#a78bfa", fontFamily: "monospace" }}>[ FETCHING_PUBLICATIONS... ]</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Media</th>
                <th>Title & Content</th>
                <th>Timestamp</th>
                <th style={{ textAlign: 'right' }}>Execute</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVars} initial="hidden" animate="visible">
              {articles.map((article) => (
                <motion.tr key={article.id} variants={rowVars} className={styles.tableRow}>
                  <td>
                    {article.mediaUrl ? (
                      article.mediaType === "IMAGE" ? (
                        <img src={`http://localhost:8081/uploads/${article.mediaUrl}`} alt="media" className={styles.articleImage} />
                      ) : (
                        <div className={styles.noImage}>[ {article.mediaType} ]</div>
                      )
                    ) : (
                      <div className={styles.noImage}>NULL</div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff', fontSize: '1.05rem' }}>{article.title}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      {article.content.length > 60 ? article.content.substring(0, 60) + '...' : article.content}
                    </div>
                  </td>
                  <td>
                    <span className={styles.dateBadge}>
                      {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(article)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(article.id)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
              {articles.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>NO_PUBLICATIONS_FOUND</td></tr>
              )}
            </motion.tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div className={styles.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{ y: 50, scale: 0.9, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <h2 className={styles.modalTitle}>{editingId ? 'Update_Data_Packet' : 'Inject_New_Packet'}</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title_Identifier</label>
                  <input type="text" className={styles.input} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="Enter article designation..." />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Media_Attachment (Image/Video/Doc)</label>
                  <div className={styles.fileUploadBox} onClick={() => fileInputRef.current?.click()}>
                    <input ref={fileInputRef} type="file" onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} style={{ display: "none" }} />
                    {selectedFile ? (
                      <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontWeight: 'bold' }}>{selectedFile.name} [ SELECTED ]</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>&lt; CLICK TO BROWSE &gt;</span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Core_Content</label>
                  <textarea className={styles.textarea} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required placeholder="Execute data entry here..." />
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