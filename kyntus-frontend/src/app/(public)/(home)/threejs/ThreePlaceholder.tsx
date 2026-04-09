"use client";

// Note: To use real 3D here, you need to run: npm install three @react-three/fiber
// This is a pure CSS 3D fallback that gives a premium Three.js vibe without the heavy load.

import { motion, useMotionValue, useTransform } from "framer-motion";
import { MouseEvent } from "react";

export default function ThreePlaceholder({ imageSrc }: { imageSrc: string }) {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{
        width: "100%",
        height: "400px",
        perspective: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(200);
        y.set(200);
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          rotateX,
          rotateY,
          boxShadow: "0 25px 50px -12px rgba(11, 26, 56, 0.4)",
        }}
      />
    </motion.div>
  );
}