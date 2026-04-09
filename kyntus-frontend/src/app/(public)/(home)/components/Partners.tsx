"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
// MAIN COMPONENT: PARTNERS COVERFLOW (PREMIUM FULL-CARD)
// ========================================================
export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-15%" });

  // Les items dyalek (6)
  const carouselItems = [
    { brand: 'bytel', rgb: '0, 164, 228' },   // Bouygues - Blue
    { brand: 'orange', rgb: '255, 121, 0' },  // Orange
    { brand: 'SFR', rgb: '226, 0, 26' },      // SFR - Red
    { brand: 'bytel', rgb: '0, 164, 228' },
    { brand: 'orange', rgb: '255, 121, 0' },
    { brand: 'SFR', rgb: '226, 0, 26' }
  ];

  const [position, setPosition] = useState(0);
  const [isHovering, setIsHovering] = useState(false); 

  // L'Moteur li kaybeddel l'blassa koul 2s
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setPosition((prev) => prev + 1);
    }, 2000); 
    return () => clearInterval(interval);
  }, [isHovering]);

  const activeIndex = ((position % carouselItems.length) + carouselItems.length) % carouselItems.length;

  const getAuraColor = () => {
    return `rgba(${carouselItems[activeIndex].rgb}, 0.25)`; 
  };

  return (
    <section className={styles.partnersSection} ref={sectionRef}>
      
      {/* BACKGROUND AURA LI KAYTBEDDEL */}
      <motion.div 
        className={styles.dynamicAura}
        animate={{ background: `radial-gradient(circle at 75% 50%, ${getAuraColor()} 0%, transparent 60%)` }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
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

          {/* ================= RIGHT: COVERFLOW (FULL CARD LOGOS) ================= */}
          <div 
            className={styles.carouselColumn}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={styles.carouselScene} style={{ transformStyle: "preserve-3d" }}>
              {carouselItems.map((item, i) => {
                let diff = i - activeIndex;
                if (diff > 3) diff -= 6;
                if (diff < -2) diff += 6;

                const absDiff = Math.abs(diff);
                const isFront = diff === 0;

                return (
                  <motion.div 
                    key={i} 
                    className={styles.carouselItem}
                    animate={{ 
                      x: diff * 160, 
                      z: absDiff * -120, 
                      rotateY: diff * -40, 
                      scale: isFront ? 1.3 : (absDiff === 1 ? 0.9 : 0.75),
                      opacity: absDiff >= 3 ? 0 : (isFront ? 1 : 0.4),
                      filter: isFront ? "blur(0px) brightness(1.1)" : "blur(3px) brightness(0.6)"
                    }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    style={{ 
                      zIndex: 10 - absDiff,
                      boxShadow: isFront 
                        ? `0 0 50px rgba(${item.rgb}, 0.6), inset 0 0 20px rgba(${item.rgb}, 0.5)` 
                        : `0 0 15px rgba(${item.rgb}, 0.2)`
                    }}
                  >
                    {/* 1. L'Image katakhod l'carte kamla */}
                    <img src={`/part/${item.brand}.jpg`} alt={`${item.brand} logo`} className={styles.fullCardImg} />
                    
                    {/* 2. Glass Overlay bach tb9a tbri w tban 3D / Premium */}
                    <div className={styles.glassOverlay} style={{ 
                      background: `linear-gradient(135deg, rgba(${item.rgb}, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.4) 100%)`
                    }}>
                      <div className={styles.energyStreaks}></div>
                    </div>
                    
                    {/* 3. Ddow lta7t kiche3el l'dik li En Face */}
                    <div 
                      className={styles.bottomGlow} 
                      style={{ 
                        background: `rgba(${item.rgb}, 1)`,
                        opacity: isFront ? 1 : 0 
                      }} 
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
      
      <div className={styles.bottomGradient}></div>
    </section>
  );
}