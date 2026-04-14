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

export default function ArchitectCareersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  
  useEffect(() => {
    // Kanjibou data mn l'API public dyal les jobs actifs
    fetch("http://localhost:8081/api/job-offers/active")
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(err => console.error("SYS_ERR:", err))
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