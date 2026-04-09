"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedStars() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005; // Kaydor bchwiya
      starsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <Stars 
      ref={starsRef}
      radius={50} 
      depth={50} 
      count={4000} 
      factor={4} 
      saturation={0} 
      fade 
      speed={1} 
    />
  );
}

export default function EnergyNetwork() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.6, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <AnimatedStars />
      </Canvas>
    </div>
  );
}