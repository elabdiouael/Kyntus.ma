"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./footer.module.css";
import Link from "next/link";

// ========================================================
// THE ENGINE: 3D PARTICLE TEXT (Interactive)
// ========================================================
function ParticleText() {
  const pointsRef = useRef<THREE.Points>(null);
  const [geometryData, setGeometryData] = useState<{ positions: Float32Array; origPositions: Float32Array; colors: Float32Array } | null>(null);

  const { pointer, viewport } = useThree();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    if (!ctx) return;
    
    ctx.font = "900 180px 'Inter', sans-serif"; // Seghernaha chwya
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("KYNTUS", width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    const positions = [];
    const colors = [];
    
    const color1 = new THREE.Color("#2EED2E"); 
    const color2 = new THREE.Color("#0044ff"); 

    for (let y = 0; y < height; y += 4) {
      for (let x = 0; x < width; x += 4) {
        const alpha = imageData[(y * width + x) * 4 + 3];
        if (alpha > 128) {
          const pX = (x - width / 2) * 0.05; 
          const pY = -(y - height / 2) * 0.05;
          const pZ = 0;
          
          positions.push(pX, pY, pZ);

          const c = Math.random() > 0.5 ? color1 : color2;
          colors.push(c.r, c.g, c.b);
        }
      }
    }

    const posArray = new Float32Array(positions);
    setGeometryData({
      positions: posArray,
      origPositions: posArray.slice(),
      colors: new Float32Array(colors)
    });
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !geometryData) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const origPositions = geometryData.origPositions;

    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    for (let i = 0; i < positions.length; i += 3) {
      const pX = positions[i];
      const pY = positions[i + 1];
      const oX = origPositions[i];
      const oY = origPositions[i + 1];

      const dx = pX - mouseX;
      const dy = pY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxDist = 3; 

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        positions[i] += (dx / dist) * force * 0.8; 
        positions[i + 1] += (dy / dist) * force * 0.8;
      }

      positions[i] += (oX - positions[i]) * 0.1;
      positions[i + 1] += (oY - positions[i + 1]) * 0.1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!geometryData) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={geometryData.positions.length / 3} args={[geometryData.positions, 3]} />
        <bufferAttribute attach="attributes-color" count={geometryData.colors.length / 3} args={[geometryData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors={true} transparent opacity={0.9} sizeAttenuation={true} />
    </points>
  );
}

// ========================================================
// MAIN COMPONENT: FOOTER
// ========================================================
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sloganWords = "Architecting the Infrastructure of Tomorrow.".split(" ");

  return (
    <footer className={styles.footerSection}>
      <div className={styles.topDivider}></div>
      <div className={styles.glowLine}></div>

      {/* ========================================================= */}
      {/* L'HBAAL: LUXURY BREATHING BACKGROUND (Auras) */}
      {/* ========================================================= */}
      <div className={styles.luxuryBackground}>
        <div className={styles.luxuryAura1}></div>
        <div className={styles.luxuryAura2}></div>
      </div>

      <div className={styles.container}>
        
        {/* ========================================================= */}
        {/* MACRO LOGO 3D */}
        {/* ========================================================= */}
        <div className={styles.macroLogoContainer}>
          <div className={styles.canvasWrapper}>
            <Canvas camera={{ position: [0, 0, 18], fov: 40 }}>
              <ParticleText />
            </Canvas>
          </div>
          
          {/* ========================================================= */}
          {/* CINEMATIC TEXT ANIMATION (Blur-to-Focus Reveal) */}
          {/* ========================================================= */}
          <motion.div 
            className={styles.sloganContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            {sloganWords.map((word, i) => (
              <motion.span
                key={i}
                className={styles.sloganWord}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)", 
                    transition: { delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM BAR: MINIMAL */}
        {/* ========================================================= */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Kyntus Group. All rights reserved.
          </div>

          <div className={styles.socials}>
            <Link href="#" className={styles.socialBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </Link>
            <Link href="#" className={styles.socialBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </Link>
          </div>

          <button onClick={scrollToTop} className={styles.backToTopBtn}>
            <span className={styles.bttText}>Back to Top</span>
            <div className={styles.bttIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </div>
          </button>

        </div>
      </div>
    </footer>
  );
}