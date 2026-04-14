"use client";

// Zedt lik l'import dyal Variants
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function KyntusText({ text, className, delay = 0 }: Props) {
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  // T7addat b Variants hna
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onAnimationComplete={() => setIsDoneTyping(true)}
      style={{ display: "inline-block" }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        animate={isDoneTyping ? {
          y: [0, -5, 0], 
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 1.05,
          color: "#00ffa3", 
          textShadow: "0 0 15px rgba(0, 255, 163, 0.6)",
          transition: { duration: 0.2 }
        }}
      >
        {text.split("").map((char, index) => (
          <motion.span variants={child} key={index}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </motion.span>
  );
}