"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function SharpParticleText() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();

  const [randomPositions, targetPositions, colors, particleTypes] = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2400; 
    canvas.height = 800;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    if (!ctx) return [new Float32Array(), new Float32Array(), new Float32Array(), new Float32Array()];

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 120px monospace"; 
    ctx.textAlign = "center";
    ctx.letterSpacing = "25px";
    ctx.fillText("JOIN US", canvas.width / 2, 250);

    ctx.font = "900 280px sans-serif"; 
    ctx.letterSpacing = "15px";
    ctx.fillText("KYNTUS", canvas.width / 2, 550);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    const randPos = [];
    const targPos = [];
    const col = [];
    const types = []; // 0 = Text Particle, 1 = Ambient Floating Particle

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const r = imgData[index];

        if (r > 160) {
          // L'blassa l-7a9i9iya dyal l'ktba (PERFECTLY FLAT FOR SHARPNESS)
          const tx = (x - canvas.width / 2) * 0.012; 
          const ty = -(y - canvas.height / 2) * 0.012;
          const tz = 0; // ZERO depth for crystal clear text

          // L'blassa l-mcheta (Random Initial)
          const rx = (Math.random() - 0.5) * viewport.width * 2;
          const ry = (Math.random() - 0.5) * viewport.height * 2;
          const rz = (Math.random() - 0.5) * 20;

          targPos.push(tx, ty, tz);
          randPos.push(rx, ry, rz);

          // 15% dyal n9itat ghadi yb9aw kay-tiro f'l'page (Ambient)
          if (Math.random() > 0.85) {
            types.push(1); // Ambient
            col.push(0, 1, 0.64); // #00ffa3
          } else {
            types.push(0); // Text
            // Alwan dyal ktba: Mix dyal White w chwia dyal Green
            if (Math.random() > 0.9) col.push(0, 1, 0.64); 
            else col.push(1, 1, 1);
          }
        }
      }
    }

    return [new Float32Array(randPos), new Float32Array(targPos), new Float32Array(col), new Float32Array(types)];
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    const repulsionRadius = 1.8; 
    
    for (let i = 0; i < targetPositions.length; i += 3) {
      const type = particleTypes[i / 3];
      const cx = positions[i];
      const cy = positions[i + 1];
      const cz = positions[i + 2];

      if (type === 0) {
        // ── TEXT PARTICLES (Assemble & Repel) ──
        const tx = targetPositions[i];
        const ty = targetPositions[i + 1];
        const tz = targetPositions[i + 2];

        // Smooth assembly
        const assembleSpeed = Math.min(0.04 + time * 0.02, 0.15); 
        let nx = cx + (tx - cx) * assembleSpeed;
        let ny = cy + (ty - cy) * assembleSpeed;
        let nz = cz + (tz - cz) * assembleSpeed;

        // Mouse Repulsion
        if (time > 1.0) {
          const dx = nx - targetX;
          const dy = ny - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            nx += (dx / dist) * force * 0.3;
            ny += (dy / dist) * force * 0.3;
            nz += force * 0.5;
          }
        }
        positions[i] = nx; positions[i + 1] = ny; positions[i + 2] = nz;

      } else {
        // ── AMBIENT PARTICLES (Floating everywhere) ──
        // Homa kay-t7erko b'sine waves b7al l'ghobra f'dow
        positions[i] = cx + Math.sin(time * 0.5 + cy) * 0.01;
        positions[i + 1] = cy + Math.cos(time * 0.4 + cx) * 0.01;
        positions[i + 2] = cz + Math.sin(time * 0.3) * 0.01;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={randomPositions.length / 3} array={randomPositions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      {/* Size sghir w opaque bach y-3ti 7edda (sharpness) */}
      <pointsMaterial size={0.018} vertexColors transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function KyntusJoinUs() {
  return (
    <div style={{ width: "100vw", height: "400px", position: "relative", zIndex: 20 }}>
      {/* dpr={[1, 2]} for Retina sharpness */}
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <SharpParticleText />
      </Canvas>
    </div>
  );
}