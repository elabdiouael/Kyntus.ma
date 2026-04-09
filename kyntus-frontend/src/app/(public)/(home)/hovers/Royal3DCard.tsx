"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { MouseEvent } from "react";
import styles from "./royalCard.module.css";

export default function Royal3DCard({ imageSrc }: { imageSrc: string }) {
  // L'math d l'3abaqira: Kanjbdou Mouse X w Y
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs bach l'7araka tkon smooth machi m9zba
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]), { damping: 20, stiffness: 150 });

  // 1. MAGNETIC GLOW: Had l'code kay-generer Ddow kaytbe3 l'souris dyalk!
  const glowX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const glowY = useSpring(mouseY, { damping: 20, stiffness: 150 });
  const background = useMotionTemplate`radial-gradient(300px circle at calc(${glowX} * 100% + 50%) calc(${glowY} * 100% + 50%), rgba(46, 237, 46, 0.15), transparent 80%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Position relative mn -0.5 tal 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Katrje3 l'blassetha smooth mli t7iyd l'souris
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={styles.perspectiveWrapper}>
      <motion.div
        className={styles.royalCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* ================= CORNERS DYAL L'MOULOUK ================= */}
        <div className={`${styles.corner} ${styles.topLeft}`}></div>
        <div className={`${styles.corner} ${styles.topRight}`}></div>
        <div className={`${styles.corner} ${styles.bottomLeft}`}></div>
        <div className={`${styles.corner} ${styles.bottomRight}`}></div>

        {/* ================= L'IMAGE ================= */}
        <div className={styles.imageFrame}>
          <img src={imageSrc} alt="Kyntus Project" className={styles.image} />
          
          {/* Cyberpunk Overlay (Scanlines w Ddl) */}
          <div className={styles.cyberOverlay}></div>
        </div>

        {/* ================= MAGNETIC MOUSE GLOW ================= */}
        {/* Ddow li kaytbe3 l'souris dakhél f l'Card */}
        <motion.div 
          className={styles.mouseGlow} 
          style={{ background }} 
        />

        {/* Border Glow mn lorr */}
        <div className={styles.borderGlow}></div>
      </motion.div>
    </div>
  );
}