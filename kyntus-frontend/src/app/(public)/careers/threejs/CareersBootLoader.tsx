"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MegaCore3D() {
  const logoRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Load User's Logo
  const logoTexture = useMemo(() => new THREE.TextureLoader().load('/HomeImages/kyntuslogo.png'), []);

  useFrame((state) => {
    if (!logoRef.current || !ring1Ref.current || !ring2Ref.current || !ring3Ref.current || !glowRef.current) return;
    const time = state.clock.elapsedTime;
    
    // 1. Logo Core Animation (Floating & Spinning)
    logoRef.current.rotation.y = time * 0.8;
    logoRef.current.position.y = Math.sin(time * 2) * 0.3;
    
    glowRef.current.rotation.y = time * 0.8;
    glowRef.current.position.y = Math.sin(time * 2) * 0.3;
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(time * 6) * 0.3;

    // 2. Crazy Data Rings Animation (Orbiting on different axes)
    ring1Ref.current.rotation.x = time * 1.2;
    ring1Ref.current.rotation.y = time * 0.5;

    ring2Ref.current.rotation.y = time * -1.5;
    ring2Ref.current.rotation.z = time * 0.8;

    ring3Ref.current.rotation.x = time * -0.5;
    ring3Ref.current.rotation.z = time * -1.2;
  });

  return (
    <group>
      {/* ── THE GIANT LOGO ── */}
      <mesh ref={glowRef} scale={[3.5, 3.5, 3.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={logoTexture} transparent color="#00ffa3" blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh ref={logoRef} scale={[3.2, 3.2, 3.2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={logoTexture} transparent alphaTest={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* ── THE ORBITING DATA RINGS ── */}
      <mesh ref={ring1Ref}>
        {/* Torus = Ring shape f' 3D */}
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ffa3" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[5.5, 0.03, 16, 100]} />
        {/* Dashed ring effect using wireframe */}
        <meshBasicMaterial color="#00ffa3" wireframe transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function CareersBootLoader() {
  return (
    // Canvas chad l'espace kamel bach l'engine yban 3imla9
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
        <MegaCore3D />
      </Canvas>
    </div>
  );
}