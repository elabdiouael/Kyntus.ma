"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

function ParticleMorph({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const maxProgressRef = useRef(0);
  
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); 
    gradient.addColorStop(0.2, "rgba(46, 237, 46, 1)"); 
    gradient.addColorStop(1, "rgba(46, 237, 46, 0)"); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [particleData, setParticleData] = useState<{
    targets: Float32Array;
    randoms: Float32Array;
  } | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2400; 
    canvas.height = 1200;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.font = "900 350px 'Inter', sans-serif";
    ctx.fillText("KYNTUS", 1200, 450);

    ctx.font = "800 180px 'Inter', sans-serif";
    ctx.letterSpacing = "20px";
    ctx.fillText("ABOUT", 1200, 800);

    const imgData = ctx.getImageData(0, 0, 2400, 1200).data;
    const targets = [];
    const randoms = [];

    for (let y = 0; y < 1200; y += 2) {
      for (let x = 0; x < 2400; x += 2) {
        const index = (y * 2400 + x) * 4;
        if (imgData[index + 3] > 128) {
          const pX = (x - 1200) / 60; 
          const pY = -(y - 600) / 60;
          targets.push(pX, pY, 0);

          const rX = (Math.random() - 0.5) * 200; 
          const rY = (Math.random() - 0.5) * 200;
          const rZ = (Math.random() - 0.5) * 80 + 20; 
          
          randoms.push(rX, rY, rZ);
        }
      }
    }

    setParticleData({
      targets: new Float32Array(targets),
      randoms: new Float32Array(randoms)
    });
  }, [viewport]);

  useFrame((state) => {
    if (!pointsRef.current || !particleData || !scrollProgress) return; 
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    let rawProgress = 0;
    if (typeof scrollProgress.get === 'function') {
        rawProgress = (scrollProgress.get() - 0.01) / 0.44;
    }
    
    rawProgress = THREE.MathUtils.clamp(rawProgress, 0, 1);
    
    if (rawProgress > maxProgressRef.current) {
      maxProgressRef.current = rawProgress;
    }
    
    const p = maxProgressRef.current; 
    const easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    // OPTIMIZATION: 7sebna l'wa9t 3la berra dyal l'boucle bach l'CPU maytfrge3ch
    const timeHalf = state.clock.elapsedTime * 0.5;
    const noiseMultiplier = 3 * (1 - easeP);

    for (let i = 0; i < positions.length; i += 3) {
      // OPTIMIZATION: Math.sin w Math.cos db mkhfin
      const noiseX = Math.sin(timeHalf + i) * noiseMultiplier;
      const noiseY = Math.cos(timeHalf + i) * noiseMultiplier;

      const startX = particleData.randoms[i] + noiseX;
      const startY = particleData.randoms[i + 1] + noiseY;
      const startZ = particleData.randoms[i + 2];

      const targetX = particleData.targets[i];
      const targetY = particleData.targets[i + 1];
      const targetZ = particleData.targets[i + 2];

      positions[i] = startX + (targetX - startX) * easeP; // OPTIMIZATION: lerp manuel sra3 mn THREE.MathUtils.lerp
      positions[i + 1] = startY + (targetY - startY) * easeP;
      positions[i + 2] = startZ + (targetZ - startZ) * easeP;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(state.clock.elapsedTime * 0.1, Math.sin(state.clock.elapsedTime * 0.4) * 0.05, easeP);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(state.clock.elapsedTime * 0.05, Math.sin(state.clock.elapsedTime * 0.2) * 0.02, easeP);
  });

  if (!particleData) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(particleData.randoms), 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.2} map={particleTexture} transparent depthWrite={false} opacity={0.4} />
    </points>
  );
}

export default function KyntusParticles({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {/* OPTIMIZATION: dpr w powerPreference */}
      <Canvas camera={{ position: [0, 0, 30], fov: 45 }} dpr={[1, 1.5]} gl={{ powerPreference: "high-performance", antialias: false }}>
        <ParticleMorph scrollProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}