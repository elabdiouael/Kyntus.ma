"use client";

import { motion } from "framer-motion";

interface RevealTextProps {
  text: string;
}

export default function RevealText({ text }: RevealTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 40 },
  };

  return (
    <motion.span
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25rem" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}