'use client';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import styles from './articles.module.css';

interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // States dyal l'Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchApi('/articles');
      setArticles(data);
    } catch (error) {
      console.error("Erreur chargement articles", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (article?: Article) => {
    if (article) {
      setEditingId(article.id);
      setFormData({ title: article.title, content: article.content, imageUrl: article.imageUrl || '' });
    } else {
      setEditingId(null);
      setFormData({ title: '', content: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', content: '', imageUrl: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await fetchApi(`/articles/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/articles', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      closeModal();
      loadArticles();
    } catch (error) {
      console.error("Erreur d'enregistrement", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        await fetchApi(`/articles/${id}`, {
          method: 'DELETE',
        });
        loadArticles();
      } catch (error) {
        console.error("Erreur de suppression", error);
        alert("Une erreur s'est produite.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Actualités & News</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          + Nouvel Article
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Chargement des actualités...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Image</th>
              <th>Titre de l'article</th>
              <th>Date de publication</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className={styles.articleImage} />
                  ) : (
                    <div className={styles.articleImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                      N/A
                    </div>
                  )}
                </td>
                <td>
                  <strong style={{ color: '#0f172a', fontSize: '1.05rem' }}>{article.title}</strong>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {article.content.length > 60 ? article.content.substring(0, 60) + '...' : article.content}
                  </div>
                </td>
                <td>
                  <span className={styles.dateBadge}>
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={`${styles.actionBtn} ${styles.edit}`} onClick={() => openModal(article)} title="Modifier">
                    ✏️
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(article.id)} title="Supprimer">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  Aucune actualité pour le moment. Cliquez sur "+ Nouvel Article".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* MODAL AJOUT / MODIFICATION (Luxe Edition) */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {editingId ? 'Modifier l\'Article' : 'Rédiger un Article'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Titre de l'article</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Le titre accrocheur de votre news..."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Lien de l'image (URL)</label>
                <input
                  type="url"
                  className={styles.input}
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Contenu complet</label>
                <textarea
                  className={styles.textarea}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Écrivez le corps de votre article ici..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={closeModal} disabled={isSaving}>
                  Annuler
                </button>
                <button type="submit" className={styles.btnSave} disabled={isSaving}>
                  {isSaving ? 'Publication...' : (editingId ? 'Mettre à jour' : 'Publier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}