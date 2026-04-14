"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ========================================================
// 1. THE FOUNDATION GRID (Deep Blue - Infrastructure)
// ========================================================
function RigidGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  // L'3bar dyal l'Grid w l'morba3at
  const gridSize = 120;
  const divisions = 60;
  const step = gridSize / divisions;

  useFrame((state) => {
    if (gridRef.current) {
      // Animation mjnouna: l'Grid kymchi l'9ddam w kiy-t3awed (Infinite Loop)
      const time = state.clock.elapsedTime;
      gridRef.current.position.z = (time * 4) % step;
    }
  });

  return (
    // L'alwan: Deep Blue w Dark Blue
    <gridHelper 
      ref={gridRef} 
      args={[gridSize, divisions, "#0044ff", "#001a4d"]} 
      position={[0, -4, 0]} 
    />
  );
}

// ========================================================
// 2. THE DATA TERRAIN (Flash Green - Telecom Waves)
// ========================================================
function EnergyTerrain() {
  const planeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!planeRef.current) return;
    const time = state.clock.elapsedTime * 0.8;
    const positions = planeRef.current.geometry.attributes.position.array as Float32Array;
    
    // Kan7erko r-ryous dyal l'Grid bach y3tiw Amwaj (Waves)
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]; // Local X
      const y = positions[i + 1]; // Local Y (li hiya Z 7it mylnaha)
      
      // L'Math dyal l'Amwaj (Sine & Cosine)
      positions[i + 2] = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 1.5;
    }
    planeRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    // Naymin l'Plane 3la l'2ard (rotation X = -90 degrees)
    <mesh ref={planeRef} position={[0, -2.5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 60, 50, 30]} />
      <meshBasicMaterial 
        color="#2EED2E" 
        wireframe 
        transparent 
        opacity={0.15} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ========================================================
// 3. THE FIBER OPTICS BEAMS (White - Transmission)
// ========================================================
function SignalBeams() {
  // Kan-génériw 20 signal 3chwa2iyin f l'misa7a
  const beams = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      x: (Math.random() - 0.5) * 80,
      z: (Math.random() - 0.5) * 80 - 20,
      height: Math.random() * 6 + 2,
      speed: Math.random() * 8 + 4,
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((beam, i) => {
      const data = beams[i];
      // Kayjriw l'9ddam
      beam.position.z = data.z + (time * data.speed) % 80;
      
      // Ila wsslo l'Camera, kayrj3o l'Lorr
      if (beam.position.z > 10) {
        beam.position.z -= 80;
        beam.position.x = (Math.random() - 0.5) * 80;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {beams.map((data, i) => (
        <mesh key={i} position={[data.x, -4 + data.height / 2, data.z]}>
          <cylinderGeometry args={[0.03, 0.03, data.height, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.6} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
}

// ========================================================
// MAIN EXPORT
// ========================================================
export default function JobBackground3D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas 
        camera={{ position: [0, 1.5, 12], fov: 50 }} // Hbetna l'Camera bach tchouf f l'Grid nishan
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      >
        {/* D-dbaba l'K7la (Fog) hiya li kat3ti l'Luxe w kat-ghetto l-lorr dyal l'Grid */}
        <fog attach="fog" args={["#010308", 5, 40]} />
        
        <group rotation={[-0.05, 0, 0]}>
          <RigidGrid />
          <EnergyTerrain />
          <SignalBeams />
        </group>
      </Canvas>
    </div>
  );
}