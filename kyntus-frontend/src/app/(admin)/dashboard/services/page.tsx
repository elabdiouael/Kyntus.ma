'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import styles from './services.module.css';

interface Service {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // States dyal l'Modal w l'Formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  // READ (Njibou les services)
  const loadServices = async () => {
    try {
      const data = await fetchApi('/services');
      setServices(data);
    } catch (error) {
      console.error("Erreur chargement services", error);
    } finally {
      setLoading(false);
    }
  };

  // 7el l'Modal (Ila kan service, rah Update, ila makanch rah Create)
  const openModal = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({ title: service.title, description: service.description });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '' });
    }
    setIsModalOpen(true);
  };

  // Sed l'Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
    setEditingId(null);
  };

  // CREATE w UPDATE (Sauvegarder)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        // Update (PUT)
        await fetchApi(`/services/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        // Create (POST)
        await fetchApi('/services', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      closeModal();
      loadServices(); // R-charger l'tableau mn be3d l'ajout
    } catch (error) {
      console.error("Erreur d'enregistrement", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  // DELETE (Suppression)
  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await fetchApi(`/services/${id}`, {
          method: 'DELETE',
        });
        loadServices(); // R-charger l'tableau mn be3d l'suppression
      } catch (error) {
        console.error("Erreur de suppression", error);
        alert("Une erreur s'est produite lors de la suppression.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestion des Services</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          + Nouveau Service
        </button>
      </div>

      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>#{service.id}</td>
                <td><strong>{service.title}</strong></td>
                <td>{service.description.length > 50 ? service.description.substring(0, 50) + '...' : service.description}</td>
                <td>
                  <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(service)} title="Modifier">
                    ✏️
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(service.id)} title="Supprimer">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  Aucun service trouvé. Cliquez sur "+ Nouveau Service" pour en ajouter un.
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
              {editingId ? 'Modifier le Service' : 'Ajouter un Service'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Titre du service</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ex: Fibre Optique (FTTH)"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Détails du service..."
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={closeModal} disabled={isSaving}>
                  Annuler
                </button>
                <button type="submit" className={styles.btnSave} disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}