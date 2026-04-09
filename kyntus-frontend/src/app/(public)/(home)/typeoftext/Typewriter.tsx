"use client";

import { motion, Variants } from "framer-motion";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  speed?: number;
}

export default function Typewriter({ text, delay = 0, className = "", speed = 0.03 }: TypewriterProps) {
  // Kan9essmo l'ktaba l 7orouf
  const letters = Array.from(text);

  // 1. Typing the container variants
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: delay },
    },
  };

  // 2. Typing the child variants
  const child: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  return (
    <motion.span
      className={className}
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}