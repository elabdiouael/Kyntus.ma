"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./cursor.module.css";

// ==========================================
// COMPOSANT 3D (Sci-Fi Diamond + Rings)
// ==========================================
function Cursor3DLuxe({ color, isHovering }: { color: string; isHovering: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && ring1Ref.current && ring2Ref.current) {
      coreRef.current.rotation.y += isHovering ? 0.05 : 0.02;
      coreRef.current.rotation.x += isHovering ? 0.05 : 0.02;
      
      const coreScale = isHovering ? 0.6 : 1;
      coreRef.current.scale.lerp(new THREE.Vector3(coreScale, coreScale, coreScale), 0.1);

      ring1Ref.current.rotation.x -= isHovering ? 0.08 : 0.03;
      ring1Ref.current.rotation.y -= isHovering ? 0.04 : 0.01;
      
      ring2Ref.current.rotation.x += isHovering ? 0.06 : 0.02;
      ring2Ref.current.rotation.z += isHovering ? 0.06 : 0.02;

      const ringScale = isHovering ? 1.3 : 1;
      ring1Ref.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
      ring2Ref.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1}
          emissive={color}
          emissiveIntensity={isHovering ? 1.5 : 0.4} 
        />
      </mesh>

      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.3, 0.008, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isHovering ? 0.9 : 0.3} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.45, 0.005, 16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isHovering ? 0.5 : 0.15} />
      </mesh>
    </group>
  );
}

// ==========================================
// MAIN CURSOR COMPONENT
// ==========================================
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [bgContext, setBgContext] = useState<"darkBlue" | "white" | "green">("darkBlue");

  // 1. FAST MOUSE (Instantané)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. TRAILING AURA (Snappy w khfifa)
  const auraMouseX = useMotionValue(-100);
  const auraMouseY = useMotionValue(-100);
  const auraX = useSpring(auraMouseX, { stiffness: 300, damping: 25, mass: 0.2 });
  const auraY = useSpring(auraMouseY, { stiffness: 300, damping: 25, mass: 0.2 });

  useEffect(() => {
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    cursorX.set(startX - 50);
    cursorY.set(startY - 50);
    auraMouseX.set(startX - 125); 
    auraMouseY.set(startY - 125);

    document.body.style.cursor = 'none';

    // HADI KATKHEDEM GHIR L'7ARAKA (0 Latency)
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX - 50); 
      cursorY.set(e.clientY - 50);
      auraMouseX.set(e.clientX - 125);
      auraMouseY.set(e.clientY - 125);
    };

    // HADI KATKHEDEM GHIR MLI KATDKHEL L'CHI ELEMENT (Performance x100)
    const handleMouseOver = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement;
        if (!target) return;

        const isClickable = 
          target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') !== null || 
          target.closest('button') !== null || 
          window.getComputedStyle(target).cursor === 'pointer';
          
        setIsHovering(isClickable);

        // DETECT BACKGROUND CONTEXT
        if (target.closest('.bg-green') || target.closest('[class*="btnHoverBg"]')) {
          setBgContext("green");
        } else if (
            target.closest('#about') || 
            target.closest('#services') || 
            target.closest('section[class*="services"]') || 
            target.closest('.bg-white')
        ) {
          setBgContext("white");
        } else {
          setBgContext("darkBlue");
        }
      } catch (err) {}
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY, auraMouseX, auraMouseY]);

  // ================= COLOR LOGIC =================
  let auraColor = "#ffffff";
  let cursorColor = "#2EED2E";
  let auraOpacity = 0.15; 

  if (bgContext === "darkBlue") {
    auraColor = "#ffffff"; 
    cursorColor = "#2EED2E"; 
    auraOpacity = 0.1; 
  } else if (bgContext === "white") {
    auraColor = "#0044ff"; 
    cursorColor = "#020612"; 
    auraOpacity = 0.15; 
  } else if (bgContext === "green") {
    auraColor = "#040c1e"; 
    cursorColor = "#ffffff"; 
    auraOpacity = 0.25; 
  }

  return (
    <div className={styles.cursorContainer} style={{ pointerEvents: "none" }}>
      
      <motion.div
        className={styles.cursorAura}
        style={{ x: auraX, y: auraY, pointerEvents: "none" }}
        animate={{
          backgroundColor: auraColor,
          opacity: isHovering ? auraOpacity * 1.5 : auraOpacity,
          scale: isHovering ? 1.4 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      <motion.div
        className={styles.cursor3DWrapper}
        style={{ x: cursorX, y: cursorY, pointerEvents: "none" }}
      >
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 40 }} 
          gl={{ alpha: true, powerPreference: "high-performance", antialias: false }} 
          dpr={[1, 1.5]}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[1, 1, 1]} intensity={3} color="#ffffff" />
          <directionalLight position={[-2, -2, -2]} intensity={2} color={auraColor} />
          <Cursor3DLuxe color={cursorColor} isHovering={isHovering} />
        </Canvas>
      </motion.div>
    </div>
  );
}