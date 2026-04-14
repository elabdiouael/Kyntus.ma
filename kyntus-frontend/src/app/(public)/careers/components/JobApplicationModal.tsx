"use client";

import { useState, ChangeEvent, FormEvent, useCallback, memo, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import styles from "../careers.module.css";
import CareersBootLoader from "../threejs/CareersBootLoader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

// Fallback image bch ila nsaw w ma-updawch tswira
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";

const modalFlip = {
  hidden: { opacity: 0, rotateX: -60, scale: 0.7, y: 150, z: -800 },
  visible: { opacity: 1, rotateX: 0, scale: 1, y: 0, z: 0, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1.2 } },
  exit: { opacity: 0, rotateX: 60, scale: 0.7, y: -150, z: -800, transition: { duration: 0.4 } }
};

const bentoContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const bentoBlock = {
  hidden: { opacity: 0, z: -150, scale: 0.8 },
  visible: { opacity: 1, z: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

const decodeTextVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const CyberInput = memo(({ label, name, type = "text", value, onChange, required = true }: any) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={styles.cyberInputGroup}>
      <motion.label 
        initial={false} 
        animate={{ y: active ? -28 : 0, fontSize: active ? "0.75rem" : "1rem", color: active ? "#00a86b" : "rgba(1, 8, 31, 0.5)" }} 
        className={styles.cyberLabel}
      >
        {label}
      </motion.label>
      <div className={`${styles.cyberInputWrapper} ${focused ? styles.cyberFocused : ""}`}>
        <input 
          type={type} name={name} required={required} value={value} onChange={onChange} 
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} 
          className={styles.cyberInputBase} 
        />
        <AnimatePresence>
          {focused && <motion.div className={styles.cyberNeon} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.3 }} />}
        </AnimatePresence>
      </div>
    </div>
  );
});
CyberInput.displayName = "CyberInput";

export default function JobApplicationModal({ offer, onClose }: { offer: any, onClose: () => void }) {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", file: null as File | null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooting, setIsBooting] = useState(true); 

  // L'URL dynamique li katji mn l'backend
  const imageUrl = offer.imageUrl ? `${API_BASE_URL}${offer.imageUrl}` : DEFAULT_IMAGE;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-500, 500], [5, -5]), { damping: 40, stiffness: 150 });
  const tiltY = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), { damping: 40, stiffness: 150 });

  function handleMouseMove(e: MouseEvent) {
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) setFormData(prev => ({ ...prev, file: acceptedFiles[0] }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] }, maxFiles: 1 });

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setFormData((p) => ({ ...p, [name]: value })); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.file) { toast.error("SYS_ERR: Missing Payload."); return; }
    
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); onClose(); }, 2000);
  };

  const renderDecodedText = (text: string) => {
    return text.split(" ").map((word, i) => (
      <motion.span key={i} variants={decodeTextVariants} style={{ display: "inline-block", marginRight: "0.25em" }}>
        {word}
      </motion.span>
    ));
  };

  return (
    <>
      <AnimatePresence>
        {isBooting ? (
          <motion.div 
            key="megaBoot" 
            className={styles.megaBootOverlay} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }} 
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <CareersBootLoader />
            <div className={styles.loaderText}>[ DECRYPTING_NODE_MATRIX... ]</div>
          </motion.div>
        ) : (
          <motion.div 
            key="bentoModal"
            className={styles.modalOverlay} 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(25px)" }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            onMouseMove={handleMouseMove}
          >
            <div className={styles.majesticGridBg} />
            <div className={styles.majesticCoreGlow} />

            <motion.div 
              className={styles.explodedContainer} 
              onClick={(e) => e.stopPropagation()} 
              variants={modalFlip}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
            >
              
              <button className={styles.cyberCloseBtn} onClick={onClose} style={{ transform: "translateZ(150px)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <motion.div className={styles.explodedGrid} variants={bentoContainer} initial="hidden" animate="visible" style={{ transformStyle: "preserve-3d" }}>
                
                {/* BLOCK 1: Hero */}
                <motion.div className={`${styles.explodedBox} ${styles.expHero}`} variants={bentoBlock} style={{ transform: "translateZ(-40px)" }}>
                  <img src={imageUrl} alt="Role" className={styles.expHeroImg} style={{ objectFit: 'cover' }} />
                  <div className={styles.expHeroOverlay} />
                  
                  <div className={styles.hudScanner} />
                  <div className={styles.hudCrosshair} />

                  <div className={styles.expHeroContent}>
                    <span className={styles.expTag}>KYNTUS_NODE_{offer.id}</span>
                    <motion.h2 className={styles.expTitle} variants={bentoContainer}>
                      {renderDecodedText(offer.title)}
                    </motion.h2>
                    <div className={styles.expLocation}>
                      <span className={styles.pulseDotWhite} /> {offer.location}
                    </div>
                  </div>
                </motion.div>

                {/* BLOCK 2: Description */}
                <motion.div className={`${styles.explodedBox} ${styles.expDesc}`} variants={bentoBlock} style={{ transform: "translateZ(10px)" }}>
                  <div className={styles.expSectionTitle}>Mission Protocol</div>
                  <motion.p className={styles.expText} variants={bentoContainer}>
                    {renderDecodedText(offer.description)}
                  </motion.p>
                </motion.div>

                {/* BLOCK 3: Requirements */}
                {offer.requirements && (
                  <motion.div className={`${styles.explodedBox} ${styles.expReq}`} variants={bentoBlock} style={{ transform: "translateZ(50px)" }}>
                    <div className={styles.expSectionTitle}>Sys Requirements</div>
                    <motion.p className={styles.expText} variants={bentoContainer}>
                      {renderDecodedText(offer.requirements)}
                    </motion.p>
                  </motion.div>
                )}

                {/* BLOCK 4: Terminal Form */}
                <motion.div className={`${styles.explodedBox} ${styles.expForm}`} variants={bentoBlock} style={{ transform: "translateZ(80px)" }}>
                  <div className={styles.formHeader}>
                    <motion.h3 className={styles.expFormTitle} variants={bentoContainer}>
                       {renderDecodedText("Uplink Terminal")}
                    </motion.h3>
                    <p className={styles.expFormSub}>Verify credentials to proceed.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className={styles.expFormGrid}>
                    <CyberInput label="Designation (Full Name)" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    <div className={styles.formRow}>
                      <CyberInput label="Comms Link (Email)" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                      <CyberInput label="Signal Freq (Phone)" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required={false} />
                    </div>

                    <div className={styles.expDropWrapper}>
                      <div className={styles.expSectionTitle} style={{ marginBottom: "0.8rem" }}>Encrypted Payload (CV)</div>
                      <div {...getRootProps()} className={`${styles.expDropzone} ${isDragActive ? styles.expDropActive : ''} ${formData.file ? styles.expDropLoaded : ''}`}>
                        <input {...getInputProps()} />
                        <div className={styles.expDropIcon}>
                          {formData.file ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>}
                        </div>
                        <div className={styles.expDropText}>
                          <span className={styles.expDropMain}>{formData.file ? formData.file.name : "Inject Packet"}</span>
                          <span className={styles.expDropSub}>{formData.file ? "Payload Secured" : "PDF / DOCX"}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.megaSubmitWrapper}>
                      <button type="submit" disabled={isSubmitting} className={styles.megaSubmitBtn3D}>
                        <span className={styles.submitBtnText}>{isSubmitting ? "TRANSMITTING..." : "INITIATE_UPLINK()"}</span>
                        {!isSubmitting && <div className={styles.laserScanLine} />}
                        {!isSubmitting && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ position: "relative", zIndex: 2 }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>}
                      </button>
                    </div>

                  </form>
                </motion.div>

              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}