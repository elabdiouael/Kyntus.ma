"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LuxeElementProps {
  children: ReactNode;
  delay?: number;
  idleType?: "float" | "pulse" | "breathe" | "none";
  hoverType?: "glow" | "scale" | "lift" | "none";
  className?: string;
}

export default function LuxeElement({ 
  children, 
  delay = 0, 
  idleType = "float", 
  hoverType = "glow",
  className = "" 
}: LuxeElementProps) {
  
  // 1. Animation li kayban beha (Entrance)
  const entranceVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  // 2. Animation li katb9a 7akmato (Idle/Continuous)
  const idleVariants = {
    float: { y: [0, -8, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    pulse: { opacity: [1, 0.6, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
    breathe: { scale: [1, 1.02, 1], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    none: {}
  };

  // 3. Animation fach kat-hoveri 3lih (Hover)
  const hoverVariants = {
    glow: { scale: 1.05, textShadow: "0px 0px 15px rgba(46, 237, 46, 0.6)", transition: { duration: 0.3 } },
    scale: { scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 15 } },
    lift: { y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.3)", transition: { duration: 0.3 } },
    none: {}
  };

  return (
    // Couche 1: Kayban
    <motion.div 
      variants={entranceVariants} 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {/* Couche 2: Kayb9a yt7erek */}
      <motion.div animate={idleVariants[idleType]}>
        {/* Couche 3: Hover */}
        <motion.div whileHover={hoverVariants[hoverType]}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}