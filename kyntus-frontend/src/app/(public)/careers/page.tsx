'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './careers.module.css';

import Navbar from '@/app/(public)/(home)/components/Navbar';
import CustomCursor from '@/app/(public)/(home)/ux/CustomCursor';
import KyntusJoinUs from './threejs/KyntusJoinUs'; 
import JobNodeCard from './components/JobNodeCard';
import JobApplicationModal from './components/JobApplicationModal';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

// 🚨 DATA STATIQUE (FALLBACK) ILA L'BACKEND KAN TAYE7 🚨
const STATIC_FALLBACK_OFFERS = [
  {
    id: 101,
    title: "Lead AI Systems Engineer",
    description: "Architect and deploy next-generation neural networks for automated infrastructure management. You will be responsible for overseeing the core Kyntus intelligence node.",
    location: "Sector 7, Mars (Remote)",
    requirements: "Python, TensorFlow, Kubernetes, 5+ years experience in high-availability systems.",
    imageUrl: null
  },
  {
    id: 102,
    title: "Quantum Security Analyst",
    description: "Protect Kyntus core systems against advanced cyber threats. Implement post-quantum cryptographic protocols across all communication nodes and secure data payloads.",
    location: "Oujda Node, Morocco",
    requirements: "Cryptography, Rust, Network Security, Zero-Trust Architecture.",
    imageUrl: null
  },
  {
    id: 103,
    title: "Frontend Interface Architect",
    description: "Design and build immersive 3D web interfaces. Create the visual layer for our control systems using advanced animations and raw CSS.",
    location: "Hybrid / Local",
    requirements: "React, Three.js, Framer Motion, strict adherence to Pure CSS architecture.",
    imageUrl: null
  }
];

export default function ArchitectCareersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  
  useEffect(() => {
    // Kanjibou data mn l'API
    fetch("http://localhost:8081/api/job-offers/active")
      .then(res => {
        if (!res.ok) throw new Error("Backend Unreachable");
        return res.json();
      })
      .then(data => {
        // Ila backend khdam ms mafih hta offre, n-affichiw statique (optionnel)
        if (data.length === 0) {
          setOffers(STATIC_FALLBACK_OFFERS);
        } else {
          setOffers(data);
        }
      })
      .catch(err => {
        console.warn("SYS_WARNING: Backend offline. Switching to Static Backup Nodes.");
        // 🚨 ILA FATAL ERROR (Vercel), KAN-AFFICHIW DATA STATIQUE 🚨
        setOffers(STATIC_FALLBACK_OFFERS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.globalWrapper}>
      <CustomCursor />
      <Navbar />

      <main className={styles.container}>
        <div className={styles.contentWrapper}>
          
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <KyntusJoinUs />
            <p className={styles.subtitle} style={{ marginTop: "-20px" }}>
              Deploy your skills in a system designed for precision.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, filter: "blur(10px)" }} 
                className={styles.loaderText}
                style={{ textAlign: "center", padding: "4rem 0" }}
              >
                [ COMPILING_NODES... ]
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                className={styles.grid} 
                variants={gridVariants}
                initial="hidden" 
                animate="visible"
              >
                {offers.map(offer => (
                  <JobNodeCard 
                    key={offer.id} 
                    offer={offer} 
                    variants={{ 
                      hidden: { opacity: 0, scale: 0.9 }, 
                      visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } } 
                    }}
                    onClick={() => setSelectedOffer(offer)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {selectedOffer && (
          <JobApplicationModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}