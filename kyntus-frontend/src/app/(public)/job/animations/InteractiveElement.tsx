"use client";

// 🚨 Zedt TargetAndTransition hna f l'import
import { motion, Variants, TargetAndTransition } from "framer-motion";
import { ReactNode } from "react";

export default function InteractiveElement({ children, type = "float" }: { children: ReactNode, type?: "float" | "pulse" }) {
  // L'Animation mli mat9issh (Idle)
  const idleVariants: Variants = {
    float: { y: [0, -5, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    pulse: { scale: [1, 1.02, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
  };

  // 🚨 Typeyit had l'objet b TargetAndTransition
  const hoverVariants: TargetAndTransition = {
    scale: 1.02,
    y: -5,
    filter: "brightness(1.1) drop-shadow(0 10px 20px rgba(46, 237, 46, 0.2))",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  };

  return (
    <motion.div 
      animate={type} 
      variants={idleVariants}
      whileHover={hoverVariants}
      style={{ display: "inline-block", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}