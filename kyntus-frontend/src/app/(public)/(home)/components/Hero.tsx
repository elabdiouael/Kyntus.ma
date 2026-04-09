"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import HeroButton from "../typesofbutton/HeroButton";
import styles from "./hero.module.css";

// ========================================================
// THE x10000 ENGINE: GREEN TO DARK BLUE INTERACTIVE WATER TYPEWRITER 
// ========================================================
const HeroTitle = () => {
  const [isTypingDone, setIsTypingDone] = useState(false);
  const text1 = "ENGINEERING";
  const text2 = "THE FUTURE";
  const speed = 0.12; 

  const totalChars = text1.length + text2.length;
  const typingDuration = totalChars * speed;

  // Colour Constants for Green (Default)
  const greenColor = "#2EED2E";
  const greenGlowColor = "rgba(46, 237, 46, 0.8)";
  const greenGradientStopColor = "#1ab51a";
  const greenStrokeColor = "rgba(255, 255, 255, 0.4)";
  const greenShadowColor = "rgba(46, 237, 46, 0.6)";

  // Colour Constants for Blue (Hover)
  const blueColor = "#1E3A8A"; // Blue-900 rich deep blue
  const blueGlowColor = "rgba(30, 58, 138, 0.8)"; // Blue-900 glow
  const blueGradientStopColor = "#1d4ed8"; // Blue-700
  const blueStrokeColor = "rgba(255, 255, 255, 0.2)"; // less opacity on dark blue text
  const blueShadowColor = "rgba(30, 58, 138, 0.8)"; // blue shadow

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingDone(true);
    }, (typingDuration + 0.3) * 1000);
    return () => clearTimeout(timer);
  }, [typingDuration]);

  return (
    <motion.h1 
      className={styles.megaTitle}
      // L'HBAAL: INTERACTIVE GREEN TO DARK BLUE ANIMATION Smooth
      variants={{
        green: {
          "--text-fill-color": greenColor,
          "--text-glow-color": greenGlowColor,
          "--text-gradient-stop-color": greenGradientStopColor,
          "--text-stroke-color": greenStrokeColor,
          filter: `drop-shadow(0px 15px 30px ${greenShadowColor})`,
          scale: 1, 
          x: 0,
          y: 0
        },
        blue: {
          "--text-fill-color": blueColor,
          "--text-glow-color": blueGlowColor,
          "--text-gradient-stop-color": blueGradientStopColor,
          "--text-stroke-color": blueStrokeColor,
          filter: `drop-shadow(0px 15px 30px ${blueShadowColor})`,
          scale: 1.04, 
          x: 10,
          y: -5
        }
      }}
      initial="green"
      whileHover="blue" // Switch smoothly on hover
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* L'HBAAL: Engineering is nowrap! display: inline-block */}
      <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
        {text1.split("").map((char, i) => (
          <motion.span
            key={`t1-${i}`}
            className={`${styles.waterLetter} ${isTypingDone ? styles.fillAnimation : ""}`}
            style={{ animationDelay: `${i * 0.05}s` }}
            initial={{ display: "none", opacity: 0 }}
            animate={{ display: "inline-block", opacity: 1 }}
            transition={{ duration: 0.01, delay: i * speed }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>

      {/* L'Retour a la ligne WA9FA blster exact! display: block */}
      <motion.span
        initial={{ display: "none" }}
        animate={{ display: "block" }} 
        transition={{ delay: text1.length * speed }}
      />

      {/* L'HBAAL: The Future is Nowrap! display: inline-block */}
      <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
        {text2.split("").map((char, i) => (
          <motion.span
            key={`t2-${i}`}
            className={`${styles.waterLetter} ${isTypingDone ? styles.fillAnimation : ""}`}
            style={{ animationDelay: `${(text1.length + i) * 0.05}s` }} 
            initial={{ display: "none", opacity: 0 }}
            animate={{ display: "inline-block", opacity: 1 }}
            transition={{ duration: 0.01, delay: (text1.length + i) * speed }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        
        {/* L'CURSOR L'MZWE9 (Khedr f tl3a, w ki tbe3hom 7rf b 7rf!) */}
        <motion.span 
          className={styles.cursor}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        >
          |
        </motion.span>
      </span>
    </motion.h1>
  );
};

// ========================================================
// MAIN COMPONENT
// ========================================================
export default function Hero() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 800], [1, 0.85]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const filter = useTransform(scrollY, [0, 800], ["blur(0px)", "blur(20px)"]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });
  const xOffset = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const yOffset = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Entrance d'l'Moulouk (T9ila w mweeeezna)
  const entranceVariants = {
    hidden: { opacity: 0, x: -30, filter: "blur(15px)" },
    visible: (customDelay: number) => ({
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 1.8, delay: customDelay, ease: [0.25, 1, 0.5, 1] }
    })
  };

  return (
    <section className={styles.hero}>
      <motion.div style={{ scale, opacity, filter }} className={styles.videoWrapper}>
        <video autoPlay loop muted playsInline className={styles.video}>
          {/* ========================================================= */}
          {/* L'LIEN JDID DYAL CLOUDINARY 🔥 */}
          {/* ========================================================= */}
          <source src="https://res.cloudinary.com/delnacacc/video/upload/q_auto/f_auto/v1775730938/video_kyntus_morocco_1_sxb00r.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay}></div>
      </motion.div>

      <motion.div style={{ x: xOffset, y: yOffset }} className={styles.container}>
        <div className={styles.content}>
          
          <motion.div animate={{ y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}>
            <HeroTitle />
          </motion.div>
          
          {/* L'Description T9ila katsnna (delay 3s) */}
          <motion.div custom={3.0} variants={entranceVariants} initial="hidden" animate="visible">
            <motion.div animate={{ y: [0, -6, 0], transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}>
              <motion.p className={styles.description} whileHover={{ x: 10, color: "#ffffff", transition: { duration: 0.4 } }}>
                Kyntus leads the digital and physical infrastructure revolution. 
                We build, modernize, and maintain the telecommunications and 
                energy networks of tomorrow.
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.div custom={3.5} variants={entranceVariants} initial="hidden" animate="visible">
            <motion.div animate={{ y: [0, -5, 0], transition: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 } }}>
              <motion.div whileHover={{ scale: 1.05, x: 10, transition: { type: "spring", stiffness: 400 } }}>
                <HeroButton href="/services" text="Explore Expertise" />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </motion.div>

      {/* SCROLL INDICATOR (MOUSE F LWEST LTA7T) */}
      <motion.div 
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 1.5 }}
      >
        <div className={styles.mouseShape}>
          <motion.div 
            className={styles.mouseWheel}
            animate={{ y: [0, 15, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className={styles.scrollText}>Scroll Down</span>
      </motion.div>

    </section>
  );
}