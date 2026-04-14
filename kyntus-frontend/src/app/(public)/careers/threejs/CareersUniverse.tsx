"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── THE INFINITE BLUEPRINT GRID ──
function MovingGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    
    // Smooth endless forward movement (kay-mchi l'gdam w kay-t3awd)
    // L'vitesse hiya 0.4. L'modulo % 1 kay-kheli l'grid dima m-connecter
    const speed = state.clock.elapsedTime * 0.4;
    gridRef.current.position.z = speed % 1; 
  });

  return (
    <group position={[0, -2, 0]}>
      {/* args: [Size, Divisions, CenterLineColor, GridColor]
        100 size / 100 divisions = 1 unit per square (Morb3at sghar b7al lkhyout)
      */}
      <gridHelper 
        ref={gridRef} 
        args={[150, 150, "#ffffff", "#ffffff"]} 
      />
      {/* Material Override bach l'khyout ybano crisp w transparent chwiya */}
      <meshBasicMaterial transparent opacity={0.15} />
    </group>
  );
}

export default function CareersUniverse() {
  return (
    // DEEP BLUE BACKGROUND: #01081f
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none", background: "#01081f" }}>
      <Canvas 
        camera={{ position: [0, 1.5, 12], fov: 60 }} 
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        {/* L'Fog (Dabab) darouri bach l'Grid tghber f l'lor b'tari9a n9iya m3a l'Deep Blue */}
        <fog attach="fog" args={["#01081f", 5, 40]} />
        
        <MovingGrid />
      </Canvas>
    </div>
  );
}