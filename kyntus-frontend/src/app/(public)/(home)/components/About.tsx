"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import styles from "./about.module.css";
import LuxeElement from "../framemotionandgsap/LuxeElement";
import Royal3DCard from "../hovers/Royal3DCard";
import KyntusParticles from "../threejs/KyntusParticles";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [isTextFullyFormed, setIsTextFullyFormed] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 45% = L'ktaba dyal Particles wllat KYNTUS ABOUT. 
    if (latest >= 0.45 && !isTextFullyFormed) {
      setIsTextFullyFormed(true);
    }
  });

  const panelVariants = {
    hidden: { opacity: 0, x: -50, filter: "blur(20px)" },
    visible: (customDelay: number) => ({
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { 
        delay: customDelay, // Delay mrigel hna
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: customDelay + 0.3 
      }
    })
  };

  const text3DVariants = {
    hidden: { y: 60, opacity: 0, rotateX: -50, filter: "blur(10px)" },
    visible: { 
      y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)",
      transition: { type: "spring", damping: 15, stiffness: 100 }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: { scaleX: 1, transition: { duration: 1, ease: "circOut" } }
  };

  // Center Pop dyal Tsawer (Hidden 100% 9bel l'wa9t)
  const centerPopVariants = {
    hidden: { opacity: 0, scale: 0.5, filter: "blur(20px)", pointerEvents: "none" as const },
    visible: (customDelay: number) => ({
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      pointerEvents: "auto" as const,
      transition: { 
        delay: customDelay, 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  const titleWords = "Empowering the future of".split(" ");

  return (
    <section ref={sectionRef} id="about" className={styles.aboutSection}>
      
      {/* BACKGROUND L'7EYY */}
      <div className={styles.movingAura}></div>
      <div className={styles.techGrid}></div>
      <KyntusParticles scrollYProgress={scrollYProgress} />
      <div className={styles.darkOverlay}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* ================= LEFT: CYBER GLASS PANEL ================= */}
          <motion.div 
            className={styles.glassPanel}
            variants={panelVariants}
            initial="hidden"
            animate={isTextFullyFormed ? "visible" : "hidden"}
            custom={0.1} // L'Panel kiban howa l'wl ghir tsali KYNTUS
          >
            <motion.div className={styles.cyberLine} variants={lineVariants} />

            <motion.div variants={text3DVariants} className={styles.badge}>
              Our Core
            </motion.div>

            <h2 className={styles.title}>
              <div className={styles.wordWrapper}>
                {titleWords.map((word, i) => (
                  <motion.span key={i} variants={text3DVariants} className={styles.word}>
                    {word}&nbsp;
                  </motion.span>
                ))}
              </div>
              <div className={styles.wordWrapper}>
                <motion.span variants={text3DVariants} className={styles.highlight}>
                  Telecoms & Energy.
                </motion.span>
              </div>
            </h2>

            <motion.p variants={text3DVariants} className={styles.description}>
              We deploy cutting-edge infrastructure solutions. Adapted to each type of network, 
              we blend engineering precision with revolutionary tech, ensuring seamless operations 
              for operators and local authorities.
            </motion.p>
            
            <div className={styles.statsContainer}>
              {[
                { value: "15+", label: "Years Experience" },
                { value: "03", label: "Core Expertise" }
              ].map((stat, i) => (
                <motion.div key={i} variants={text3DVariants} className={styles.statBox}>
                  <h4 className={styles.statValue}>{stat.value}</h4>
                  <p className={styles.statLabel}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ================= RIGHT: IMAGE GALLERY ================= */}
          <div className={styles.imageGallery}>
            {/* Tsawer mt3tlin bzzaf bach maybanoch 9bel KYNTUS ABOUT */}
            <motion.div 
              className={`${styles.imgWrapper} ${styles.img1}`} 
              variants={centerPopVariants}
              initial="hidden"
              animate={isTextFullyFormed ? "visible" : "hidden"}
              custom={0.8} 
            >
              <Royal3DCard imageSrc="/HomeImages/image1.jpeg" />
            </motion.div>
            
            <motion.div 
              className={`${styles.imgWrapper} ${styles.img2}`} 
              variants={centerPopVariants}
              initial="hidden"
              animate={isTextFullyFormed ? "visible" : "hidden"}
              custom={1.0}
            >
              <Royal3DCard imageSrc="/HomeImages/image3.jpeg" />
            </motion.div>
            
            <motion.div 
              className={`${styles.imgWrapper} ${styles.img3}`} 
              variants={centerPopVariants}
              initial="hidden"
              animate={isTextFullyFormed ? "visible" : "hidden"}
              custom={1.2}
            >
              <Royal3DCard imageSrc="/HomeImages/image10.jpeg" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}