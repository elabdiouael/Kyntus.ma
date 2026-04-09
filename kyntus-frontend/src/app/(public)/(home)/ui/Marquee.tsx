"use client";

import { motion } from "framer-motion";
import styles from "./marquee.module.css";

export default function Marquee() {
  const words = [
    "TELECOMS", "ENERGY", "DATA CENTERS", "RADIO NETWORKS", 
    "TELECOMS", "ENERGY", "DATA CENTERS", "RADIO NETWORKS"
  ];

  return (
    <div className={styles.marqueeContainer}>
      <motion.div
        className={styles.marqueeTrack}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {words.map((word, i) => (
          <div key={i} className={styles.wordGroup}>
            <span className={styles.word}>{word}</span>
            <span className={styles.dot}>•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}