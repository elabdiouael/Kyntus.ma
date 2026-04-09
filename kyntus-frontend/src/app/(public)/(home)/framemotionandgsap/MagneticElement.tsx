"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticElement({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const boundingRect = ref.current?.getBoundingClientRect();
    if (boundingRect) {
      const x = clientX - (boundingRect.left + boundingRect.width / 2);
      const y = clientY - (boundingRect.top + boundingRect.height / 2);
      setPosition({ x: x * 0.2, y: y * 0.2 }); // Strength of magnetism
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}