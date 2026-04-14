"use client";

// Zedt Variants hna lfo9
import { motion, useMotionTemplate, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { MouseEvent, useRef } from "react";
import styles from "../careers.module.css";

const PREMIUM_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
];

// T7addou les types hna b Variants
const visorVariants: Variants = {
  rest: { height: "100%", y: 0, borderRadius: "12px", filter: "brightness(0.95)" },
  hover: { height: "35%", y: -10, borderRadius: "12px 12px 4px 4px", filter: "brightness(0.7)", transition: { type: "spring", stiffness: 250, damping: 25 } }
};

const coreVariants: Variants = {
  rest: { opacity: 0, y: 40, scale: 0.95, rotateX: -15 },
  hover: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
  rest: { opacity: 0, y: 15, z: -10 },
  hover: { opacity: 1, y: 0, z: 20, transition: { type: "spring", stiffness: 350, damping: 20 } }
};

// Zedt lik `Variants` 3wad `any` hna bach teb9a safe 100%
export default function JobNodeCard({ offer, variants, onClick }: { offer: any, variants: Variants, onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(200);

  const tiltX = useSpring(useTransform(mouseY, [0, 400], [10, -10]), { damping: 40, stiffness: 300 });
  const tiltY = useSpring(useTransform(mouseX, [0, 400], [-10, 10]), { damping: 40, stiffness: 300 });

  const imageUrl = PREMIUM_IMAGES[offer.id % PREMIUM_IMAGES.length];

  function handleMouseMove(e: MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(200);
    mouseY.set(200);
  }

  return (
    <motion.div 
      ref={cardRef}
      className={styles.mechChassis} 
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{ rotateX: tiltX, rotateY: tiltY }}
    >
      <motion.div 
        className={styles.mechGlow} 
        style={{ background: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(0, 255, 163, 0.25), transparent 60%)` }} 
      />

      <motion.div className={styles.mechVisor} variants={visorVariants}>
        <img src={imageUrl} alt={offer.title} className={styles.heroImg} />
        <div className={styles.visorOverlay} />
        
        <motion.div className={styles.hardwareLed} variants={{ hover: { opacity: 1, z: 30 }, rest: { opacity: 0.8, z: 0 } }}>
          <span className={styles.pulseDotCore} /> OVR_RIDE_READY
        </motion.div>
      </motion.div>

      <motion.div className={styles.mechCore} variants={coreVariants}>
        <div className={styles.coreGrid} />
        <div className={styles.screwTopLeft} />
        <div className={styles.screwTopRight} />
        
        <motion.div variants={itemVariants}>
          <span className={styles.serialCode}>// SERIAL_NO: KYN-{offer.id}99X</span>
        </motion.div>

        <motion.h2 className={styles.coreTitle} variants={itemVariants}>
          {offer.title}
        </motion.h2>
        
        <motion.div className={styles.coreLocation} variants={itemVariants}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {offer.location}
        </motion.div>
        
        <motion.p className={styles.coreDesc} variants={itemVariants}>
          {offer.description.length > 80 ? offer.description.substring(0, 80) + "..." : offer.description}
        </motion.p>

        <motion.div className={styles.coreFooter} variants={itemVariants}>
          <div className={styles.warningTape} />
          
          <button className={styles.mechSwitchBtn}>
            <span className={styles.switchText}>DECRYPT_DATA</span>
            <div className={styles.switchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}