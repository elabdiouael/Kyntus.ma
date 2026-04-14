"use client";

import { motion } from "framer-motion";
import styles from "../careers.module.css";

export default function CareersBackground2D({ onComplete }: { onComplete: () => void }) {
  return (
    <div className={styles.bgContainer2D}>
      {/* ── 1. DEEP BLUE EDGES (L'kholfya l'asliya) ── */}
      <div className={styles.deepBlueBase} />

      {/* ── 2. THE REVEALED WHITE NOTEBOOK (Kat-t7el b'Clip-Path) ── */}
      <motion.div
        className={styles.whiteNotebookArea}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(150% at 50% 50%)" }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
        onAnimationComplete={onComplete} // Mli tsali y-bano les cards
      >
        <div className={styles.notebookGrid} />
      </motion.div>

      {/* ── 3. THE BURNING FIRE RING (Nar li kat-7re9 w kat-tfa) ── */}
      <motion.div
        className={styles.fireRing}
        initial={{ width: "0vmax", height: "0vmax", opacity: 1, borderWidth: "10px" }}
        animate={{ width: "150vmax", height: "150vmax", opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
    </div>
  );
}