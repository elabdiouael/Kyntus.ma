"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./services.module.css";
import ServiceCore3D from "../threejs/ServiceCore3D";

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
// TRANSFORMER COMPONENT: SERVICE CARD (THE REAL 3D SOUL)
// ========================================================
function ServiceCard({ service, index, inView, isAnyHovered, setHoveredCard }: { service: any, index: number, inView: boolean, isAnyHovered: boolean, setHoveredCard: (id: string | null) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], ["15deg", "-15deg"]), { damping: 20, stiffness: 100 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], ["-15deg", "15deg"]), { damping: 20, stiffness: 100 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(46, 237, 46, 0.2), transparent 80%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => { setIsHovered(true); setHoveredCard(service.id); };
  const handleMouseLeave = () => { setIsHovered(false); setHoveredCard(null); x.set(0); y.set(0); };

  // Ila knt m-hovri 3la chi carte akhra, had l'carte kat-k7al chwia
  const isDimmed = isAnyHovered && !isHovered;

  return (
    <div className={styles.perspectiveWrapper}>
      <motion.div 
        className={styles.dynamicCard}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", zIndex: isHovered ? 50 : 1 }}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ 
          opacity: inView ? (isDimmed ? 0.4 : 1) : 0, 
          y: inView ? 0 : 50, 
          scale: inView ? (isDimmed ? 0.95 : 1) : 0.95,
          filter: isDimmed ? "blur(3px)" : "blur(0px)"
        }}
        transition={{ delay: inView && !isAnyHovered ? 0.4 + index * 0.1 : 0, duration: 0.5 }}
      >
        {/* ========================================= */}
        {/* BACKGROUND LAYER - Design l'asli dyalek 100% */}
        {/* ========================================= */}
        <div className={styles.cardBgLayer}>
          <ServiceCore3D isHovered={isHovered} mouseX={x} mouseY={y} />
          <motion.div className={styles.spotlight} style={{ background }} />
          <div className={styles.borderGlow}></div>
        </div>
        
        {/* ========================================= */}
        {/* ORIGINAL CONTENT - Kaybluri w kaymchi l lorr fl Hover */}
        {/* ========================================= */}
        <motion.div 
          className={styles.originalContent}
          animate={{
            opacity: isHovered ? 0 : 1, 
            z: isHovered ? -50 : 20, 
            scale: isHovered ? 0.8 : 1,
            filter: isHovered ? "blur(20px)" : "blur(0px)" 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className={styles.iconWrapper}>
            {service.icon || <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
          </div>
          <h4 className={styles.cardTitle}>{service.title}</h4>
          <p className={styles.cardDescription}>{service.desc}</p>
          <div className={styles.exploreBtn}>
            <span>Discover More</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* RRO7 (THE REAL SOUL) - Design Hbil (Title + Desc only) */}
        {/* ========================================= */}
        <motion.div
          className={styles.soulCard}
          initial={{ opacity: 0, z: -20, scale: 0.5 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            z: isHovered ? 120 : -20,  // Katkhrej l brra f 3D
            scale: isHovered ? 1.05 : 0.5
          }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 14 }}
          style={{ pointerEvents: isHovered ? "auto" : "none" }}
        >
          <div className={styles.soulHologramBg}></div>
          <div className={styles.soulGridScanner}></div>
          
          <div className={styles.soulContentBox}>
            <div className={styles.soulHeader}>
              <div className={styles.soulIconPulse}>
                {service.icon}
              </div>
              <span className={styles.soulBadge}>KYNTUS // ACTIVE CORE</span>
            </div>
            
            <h4 className={styles.soulTitle}>{service.title}</h4>
            <p className={styles.soulDesc}>{service.desc}</p>
            
            <div className={styles.soulFooter}>
              <div className={styles.hologramLines}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.soulAction}>EXPLORE SYSTEM</div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// ========================================================
// MAIN COMPONENT: SERVICES
// ========================================================
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-15%" });
  
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const servicesData = [
    {
      id: "telecom", title: "Telecom Networks",
      desc: "End-to-end deployment of fiber optics and 5G infrastructure, ensuring high-speed connectivity for next-gen communications.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
      id: "energy", title: "Energy Solutions",
      desc: "Smart grid installations and renewable energy infrastructure designed for absolute efficiency and sustainability.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
    {
      id: "data", title: "Data Centers",
      desc: "Building high-availability server hubs with advanced cooling and power redundancy.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
    },
    {
      id: "civil", title: "Civil Engineering",
      desc: "Precision trenching, structural foundations, and complete site preparation.",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 22v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M12 12v10M8 22v-5M16 22v-5"/></svg>,
    }
  ];

  return (
    <section className={styles.servicesSection} ref={sectionRef}>
      <div className={styles.greenGrid}></div>

      <div className={styles.container}>
        <div className={styles.header}>
          <motion.div className={styles.badge} initial={{ opacity: 0, y: 20 }} animate={isSectionInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }}>
            Expertise
          </motion.div>
          <h2 className={styles.title}>
            <CyberTextReveal text="Architecting the" delayOffset={0.2} inView={isSectionInView} />
            <br />
            <span className={styles.shimmerWrapper}>
              <CyberTextReveal text="Future." delayOffset={0.5} className={styles.shimmerHighlight} inView={isSectionInView} />
            </span>
          </h2>
          <p className={styles.subtitle}>
            <CyberTextReveal text="Comprehensive infrastructure solutions across multiple domains, engineered for resilience and scale." delayOffset={0.7} inView={isSectionInView} />
          </p>
        </div>

        <div className={styles.smartGrid}>
          {servicesData.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              inView={isSectionInView} 
              isAnyHovered={hoveredCard !== null}
              setHoveredCard={setHoveredCard}
            />
          ))}
        </div>
      </div>

      <div className={styles.quantumRiftContainer}>
        <div className={styles.riftGlow}></div>
        <div className={styles.waveWrapperBack}>
          <svg viewBox="0 0 2880 320" preserveAspectRatio="none" className={styles.waveSvg}>
            <path fill="rgba(0, 68, 255, 0.4)" d="M0,180 Q360,300 720,180 T1440,180 T2160,180 T2880,180 L2880,320 L0,320 Z"></path>
          </svg>
        </div>
        <div className={styles.waveWrapperFront}>
          <svg viewBox="0 0 2880 320" preserveAspectRatio="none" className={styles.waveSvg}>
            <path fill="#020612" d="M0,160 Q360,280 720,160 T1440,160 T2160,160 T2880,160 L2880,320 L0,320 Z"></path>
            <path className={styles.riftLaser} fill="none" stroke="#2EED2E" strokeWidth="4" d="M0,160 Q360,280 720,160 T1440,160 T2160,160 T2880,160"></path>
          </svg>
        </div>
      </div>

    </section>
  );
}