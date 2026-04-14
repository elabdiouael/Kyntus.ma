"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function InteractiveGrid() {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  
  // L'3bar dyal l'Grid (Ch7al mn n9ta)
  const gridX = 25;
  const gridY = 20;
  const count = gridX * gridY;

  // L'Mesh w l'Matrix bach t-render 500 n9ta f d9a w7da bla ma t-t9el l'PC
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const [colorArray, basePositions] = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const positions = [];
    const baseColor = new THREE.Color("#002288"); // Zre9 mghlo9 (Idle)

    let i = 0;
    for (let x = 0; x < gridX; x++) {
      for (let y = 0; y < gridY; y++) {
        // N-ssentriw l'Grid
        const posX = (x - gridX / 2) * 1.5;
        const posY = (y - gridY / 2) * 1.5;
        positions.push(new THREE.Vector3(posX, posY, 0));
        
        baseColor.toArray(colors, i * 3);
        i++;
      }
    }
    return [colors, positions];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // L'Mouse position m-mappya l'3bar dyal l'Viewport
    const mouseX = (state.mouse.x * state.viewport.width) / 2;
    const mouseY = (state.mouse.y * state.viewport.height) / 2;

    const highlightColor = new THREE.Color("#2EED2E"); // Flash Green (Active)
    const baseColor = new THREE.Color("#001a4d"); // Deep Blue (Idle)

    for (let i = 0; i < count; i++) {
      const pos = basePositions[i];
      const distance = Math.sqrt(Math.pow(pos.x - mouseX, 2) + Math.pow(pos.y - mouseY, 2));
      
      // L'Hbaal: Ila l'mouse 9riba l'n9ta, kat-kber w katwli Khedra
      const maxDist = 5;
      let scale = 0.15;
      let targetColor = baseColor;

      if (distance < maxDist) {
        // Effet d'attraction w dow
        const intensity = 1 - (distance / maxDist);
        scale = 0.15 + (intensity * 0.4); 
        targetColor = baseColor.clone().lerp(highlightColor, intensity);
      } else {
        // Blinking khfif f blast'ha
        scale = 0.15 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      }

      dummy.position.copy(pos);
      dummy.scale.set(scale, scale, 1);
      dummy.updateMatrix();
      
      pointsRef.current.setMatrixAt(i, dummy.matrix);
      pointsRef.current.setColorAt(i, targetColor);
    }
    
    pointsRef.current.instanceMatrix.needsUpdate = true;
    if (pointsRef.current.instanceColor) pointsRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={pointsRef} args={[undefined, undefined, count]}>
      {/* Circle bach yjiy dakchi n9i b7al LEDs */}
      <circleGeometry args={[1, 16]} />
      <meshBasicMaterial transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

export default function FormNetwork2D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5, borderRadius: "24px", overflow: "hidden" }}>
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }} gl={{ antialias: true, alpha: true }}>
        <InteractiveGrid />
      </Canvas>
    </div>
  );
}