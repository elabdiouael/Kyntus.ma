"use client";

import React from 'react';
// 🚨 Zedt Variants hna f l'import
import { motion, Variants } from 'framer-motion';
import styles from '../job.module.css';

// ========================================================
// 1. ENGINE: PREMIUM SMOOTH REVEAL
// ========================================================
const SmoothWordReveal = ({ text, delayOffset = 0, className = "" }: { text: string, delayOffset?: number, className?: string }) => {
  const words = text.split(" ");

  // 🚨 Typeyit had l'objet b Variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delayOffset }
    }
  };

  // 🚨 Typeyit had l'objet b Variants
  const child: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, filter: "blur(0px)", scale: 1, 
      transition: { type: "spring", damping: 20, stiffness: 100 } 
    }
  };

  return (
    <motion.span 
      className={className} 
      variants={container} 
      initial="hidden" 
      animate="visible" 
      style={{ display: "inline-block", overflow: "hidden", paddingBottom: "10px" }}
    >
      {words.map((word, index) => (
        <motion.span 
          key={index} 
          variants={child} 
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

// ========================================================
// 2. MAIN COMPONENT: JOB HERO
// ========================================================
export default function JobHero() {
  // 🚨 Typeyit had l'objet b Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.textContent}>
        
        {/* PREMIUM BADGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className={styles.badge}>
            <span className={styles.blinkingDot}></span>
            KYNTUS_RECRUITMENT_NODE
          </div>
        </motion.div>

        {/* MASSIVE HERO TITLE */}
        <h1 className={styles.title}>
          <SmoothWordReveal text="Shape The Future" delayOffset={0.2} /> <br />
          
          <motion.span 
            className={styles.highlight}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block", paddingBottom: "5px" }}
          >
            With Kyntus.
          </motion.span>
        </h1>

        {/* ELEGANT DESCRIPTION */}
        <motion.p 
          className={styles.description} 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 1.2 }}
        >
          We are looking for visionary engineers, strategists, and innovators. 
          Drop your CV below and let's build the next generation of telecom and energy infrastructure together.
        </motion.p>
        
        {/* CLEAN PERKS */}
        <motion.div 
          className={styles.perks} 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 1.4 }}
        >
          <motion.div className={styles.perkItem} whileHover={{ y: -3, color: "#166534" }}>
            <div className={styles.perkIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span>Cutting-edge Projects</span>
          </motion.div>

          <motion.div className={styles.perkItem} whileHover={{ y: -3, color: "#166534" }}>
            <div className={styles.perkIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <span>Global Impact</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}