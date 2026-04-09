"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import styles from "./commitments.module.css";

const commitmentsData = [
  { id: "01", title: "Safety First", desc: "Rigorous standards protecting our teams and networks daily. Safety is not an option, it's our core foundation.", img: "/HomeImages/image7.jpeg", color: "#0b1a38" },
  { id: "02", title: "Innovation", desc: "Deploying next-gen tech for European infrastructures. We constantly push the boundaries of what's possible.", img: "/HomeImages/image8.jpeg", color: "#08142b" },
  { id: "03", title: "Sustainability", desc: "Eco-friendly energy solutions driving a greener future. Minimizing our carbon footprint at every step.", img: "/HomeImages/image9.jpeg", color: "#060f22" },
  { id: "04", title: "Excellence", desc: "Precision and reliability from blueprint to maintenance. We deliver nothing short of perfection.", img: "/HomeImages/image10.jpeg", color: "#040a17" },
];

// Component lkol carte bach n7esbou l'animation dyalha bo7dha
const Card = ({ 
  i, title, desc, img, color, id, progress, range, targetScale 
}: { 
  i: number, title: string, desc: string, img: string, color: string, id: string, progress: MotionValue<number>, range: number[], targetScale: number 
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  // L'carte katweli sghira chwia mli katji l'carte li moraha fo9ha
  const scale = useTransform(progress, range, [1, targetScale]);
  // L'carte katk7al mli katghbba
  const opacity = useTransform(progress, range, [1, 0.4]);

  return (
    <div ref={containerRef} className={styles.cardContainer}>
      <motion.div 
        style={{ backgroundColor: color, scale, top: `calc(-5vh + ${i * 25}px)` }} 
        className={styles.card}
      >
        <div className={styles.cardLayout}>
          <div className={styles.textContent}>
            <div className={styles.indexBox}>
              <span className={styles.indexNum}>{id}</span>
              <div className={styles.indexLine}></div>
            </div>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardDesc}>{desc}</p>
          </div>
          
          <div className={styles.imageWrap}>
            <motion.div style={{ scale: imageScale }} className={styles.imageInner}>
              <img src={img} alt={title} className={styles.image} />
            </motion.div>
          </div>
        </div>
        {/* Overlay bach tkhla9 depth effect */}
        <motion.div style={{ opacity: useTransform(progress, range, [0, 0.6]) }} className={styles.darkOverlay}></motion.div>
      </motion.div>
    </div>
  );
};

export default function Commitments() {
  const containerRef = useRef(null);
  
  // Kanchdou l'scroll d l'container kaml
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="commitments" className={styles.sectionMain}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>
          Our Core <span className={styles.highlight}>Commitments</span>
        </h2>
        <p className={styles.mainSubtitle}>Built on trust, driven by excellence.</p>
      </div>

      <div ref={containerRef} className={styles.cardsWrapper}>
        {commitmentsData.map((project, i) => {
          const targetScale = 1 - ( (commitmentsData.length - i) * 0.05);
          return (
            <Card 
              key={i} 
              i={i} 
              {...project} 
              progress={scrollYProgress} 
              range={[i * 0.25, 1]} 
              targetScale={targetScale} 
            />
          );
        })}
      </div>
    </section>
  );
}