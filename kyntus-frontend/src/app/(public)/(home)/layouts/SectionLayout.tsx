"use client";

import { motion } from "framer-motion";

interface SectionLayoutProps {
  children: React.ReactNode;
  id?: string;
  bgDark?: boolean;
}

export default function SectionLayout({ children, id, bgDark = false }: SectionLayoutProps) {
  return (
    <section 
      id={id} 
      style={{
        padding: "8rem 0",
        backgroundColor: bgDark ? "#0b1a38" : "#ffffff",
        color: bgDark ? "#ffffff" : "#0b1a38",
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}
      >
        {children}
      </motion.div>
    </section>
  );
}