'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import styles from './jobs.module.css';

interface JobOffer {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  isActive: boolean;
  postedAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // States dyal l'Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    description: '', 
    requirements: '', 
    isActive: true 
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await fetchApi('/job-offers');
      setJobs(data);
    } catch (error) {
      console.error("Erreur chargement jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job?: JobOffer) => {
    if (job) {
      setEditingId(job.id);
      setFormData({ 
        title: job.title, 
        location: job.location, 
        description: job.description, 
        requirements: job.requirements || '', 
        isActive: job.isActive 
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', location: '', description: '', requirements: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', location: '', description: '', requirements: '', isActive: true });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await fetchApi(`/job-offers/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/job-offers', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      closeModal();
      loadJobs();
    } catch (error) {
      console.error("Erreur d'enregistrement", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")) {
      try {
        await fetchApi(`/job-offers/${id}`, {
          method: 'DELETE',
        });
        loadJobs();
      } catch (error) {
        console.error("Erreur de suppression", error);
        alert("Une erreur s'est produite.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Carrières & Recrutement</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          + Nouvelle Offre
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Chargement des offres...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Poste & Description</th>
              <th>Lieu</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{job.title}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {job.description.length > 60 ? job.description.substring(0, 60) + '...' : job.description}
                  </div>
                </td>
                <td>
                  <span className={styles.locationBadge}>
                    📍 {job.location}
                  </span>
                </td>
                <td>
                  <span className={job.isActive ? styles.badgeActive : styles.badgeClosed}>
                    {job.isActive ? 'Active' : 'Fermée'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(job)} title="Modifier">
                    ✏️
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(job.id)} title="Supprimer">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  Aucune offre d'emploi. Cliquez sur "+ Nouvelle Offre".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* MODAL AJOUT / MODIFICATION */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {editingId ? 'Modifier l\'Offre d\'Emploi' : 'Publier une Offre d\'Emploi'}
            </h2>
            <form onSubmit={handleSubmit}>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Titre du poste</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ex: Ingénieur Réseaux"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Lieu (Localisation)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Ex: Oujda, Maroc"
                  />
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Description du poste</label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Missions, responsabilités..."
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.label}>Profil recherché (Exigences)</label>
                <textarea
                  className={styles.textarea}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Compétences, diplômes, expérience..."
                />
              </div>

              <div className={styles.formGroupFull}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    L'offre est actuellement active et ouverte aux candidatures
                  </span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={closeModal} disabled={isSaving}>
                  Annuler
                </button>
                <button type="submit" className={styles.btnSave} disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : (editingId ? 'Mettre à jour' : 'Publier l\'offre')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}