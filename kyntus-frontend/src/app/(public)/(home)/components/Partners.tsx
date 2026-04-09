"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useAnimationFrame } from "framer-motion";
import styles from "./partners.module.css";

// ========================================================
// ENGINE: TEXT REVEAL
// ========================================================
const CyberTextReveal = ({ text, delayOffset = 0, className = "", inView }: { text: string; delayOffset?: number; className?: string; inView: boolean }) => {
  const words = text.split(" ");
  return (
    <span className={styles.cyberTextWrapper}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordMask}>
          <motion.span
            className={`${styles.wordSpan} ${className}`}
            initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
            animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delayOffset + i * 0.05 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// ========================================================
// MAIN COMPONENT: PARTNERS 3D CAROUSEL (Cinematic Focus)
// ========================================================
export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-15%" });

  // 6 Items bach l'7al9a tji m3mra w lorr yban fih 3 dyal charikat ky-tllou
  const carouselItems = [
    { brand: 'bytel', color: 'rgba(0, 164, 228' },   
    { brand: 'orange', color: 'rgba(255, 121, 0' }, 
    { brand: 'SFR', color: 'rgba(226, 0, 26' },     
    { brand: 'bytel', color: 'rgba(0, 164, 228' },
    { brand: 'orange', color: 'rgba(255, 121, 0' },
    { brand: 'SFR', color: 'rgba(226, 0, 26' }
  ];

  const rotationY = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false); 

  // L'Vitesse dyal d-doran
  useAnimationFrame((t, delta) => {
    if (!isHovering) {
      rotationY.set(rotationY.get() - (delta * 0.015)); 
    }
  });

  useMotionValueEvent(rotationY, "change", (latest) => {
    let angle = ((-latest % 360) + 360) % 360; 
    let index = Math.round(angle / 60) % 6; 
    setActiveIndex(index);
  });

  const getAuraColor = () => {
    return `${carouselItems[activeIndex].color}, 0.2)`; 
  };

  return (
    <section className={styles.partnersSection} ref={sectionRef}>
      
      {/* BACKGROUND AURA */}
      <motion.div 
        className={styles.dynamicAura}
        animate={{ background: `radial-gradient(circle at 75% 50%, ${getAuraColor()} 0%, transparent 60%)` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <div className={styles.topGlowLine}></div>
      
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          
          {/* ================= LEFT: TEXT ================= */}
          <div className={styles.textColumn}>
            <motion.div 
              className={styles.badge}
              initial={{ opacity: 0, x: -50, letterSpacing: "15px", filter: "blur(10px)" }}
              animate={isSectionInView ? { opacity: 1, x: 0, letterSpacing: "0.1em", filter: "blur(0px)" } : {}}
              transition={{ duration: 1, ease: "circOut", delay: 0.1 }}
            >
              Our Network
            </motion.div>

            <h3 className={styles.title}>
              <CyberTextReveal text="Trusted by" delayOffset={0.3} inView={isSectionInView} />
              <br />
              <span className={styles.shimmerWrapper}>
                <CyberTextReveal text="Industry Leaders" delayOffset={0.6} className={styles.shimmerHighlight} inView={isSectionInView} />
              </span>
            </h3>

            <p className={styles.description}>
              <CyberTextReveal 
                text="We partner with the world's most innovative telecom and energy providers to build the infrastructure of tomorrow. Precision, speed, and absolute reliability at every node." 
                delayOffset={0.9} inView={isSectionInView}
              />
            </p>
          </div>

          {/* ================= RIGHT: 3D ROTATING CAROUSEL ================= */}
          <div 
            className={styles.carouselColumn}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* L'HBAAL HNA: Zedt rotateX: "-15deg" bach l'Ring t-miel lta7t w li lorr y-tllou mn lfo9! */}
            <motion.div 
              className={styles.carouselScene}
              style={{ rotateX: "-15deg", rotateY: rotationY, transformStyle: "preserve-3d" }}
            >
              {carouselItems.map((item, i) => {
                const isFront = activeIndex === i;
                
                return (
                  <motion.div 
                    key={i} 
                    className={styles.carouselItem}
                    // Kberna l'Radius l 350px bach maydzamtouch tsawer 7it homa kbar db
                    style={{ transform: `rotateY(${i * 60}deg) translateZ(350px)` }}
                    animate={{ 
                      // 1.3 Scale l'Front (3imlaa9a), 0.8 l'Back
                      scale: isFront ? 1.3 : 0.8,
                      opacity: isFront ? 1 : 0.25,
                      // L'Moulouk: Blur w k7el wbyed l'lor, w Clear N9iii l'9ddam!
                      filter: isFront ? "grayscale(0%) blur(0px)" : "grayscale(100%) brightness(0.3) blur(5px)"
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className={styles.imageContainer}>
                      <img src={`/part/${item.brand}.jpg`} alt={`${item.brand} logo`} className={styles.partnerImg} />
                      <div className={styles.scanlines}></div>
                    </div>
                    
                    {/* Ddow lta7t kiche3el ghir mn ykoun f l'Front */}
                    <div 
                      className={styles.bottomGlow} 
                      style={{ 
                        background: `${item.color}, 0.8)`,
                        opacity: isFront ? 1 : 0 
                      }} 
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          
        </div>
      </div>
      
      <div className={styles.bottomGradient}></div>
    </section>
  );
}