"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

export default function EntranceAnim({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      scale: 1,
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
    </motion.div>
  );
}