"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

function QuantumCore({ isHovered, mouseX, mouseY }: { isHovered: boolean; mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !wireRef.current) return;
    
    const speed = isHovered ? 4 : 0.5;
    meshRef.current.rotation.x += delta * 0.2 * speed;
    meshRef.current.rotation.y += delta * 0.3 * speed;
    wireRef.current.rotation.x -= delta * 0.1 * speed;
    wireRef.current.rotation.y -= delta * 0.2 * speed;

    const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
    const wireMaterial = wireRef.current.material as THREE.MeshBasicMaterial;

    if (isHovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      wireRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
      material.color.lerp(new THREE.Color("#0044ff"), 0.1); 
      material.metalness = THREE.MathUtils.lerp(material.metalness, 0.9, 0.1);
      material.transmission = THREE.MathUtils.lerp(material.transmission, 0.2, 0.1);
      wireMaterial.color.lerp(new THREE.Color("#ffffff"), 0.1); 
      wireMaterial.opacity = THREE.MathUtils.lerp(wireMaterial.opacity, 0.6, 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      wireRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      material.color.lerp(new THREE.Color("#ffffff"), 0.1); 
      material.metalness = THREE.MathUtils.lerp(material.metalness, 0.1, 0.1);
      material.transmission = THREE.MathUtils.lerp(material.transmission, 0.9, 0.1);
      wireMaterial.color.lerp(new THREE.Color("#2EED2E"), 0.1); 
      wireMaterial.opacity = THREE.MathUtils.lerp(wireMaterial.opacity, 0.2, 0.1);
    }

    if (lightRef.current) {
      const targetX = mouseX.get() * 10;
      const targetY = -mouseY.get() * 10;
      if (isHovered) {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 15, 0.1);
        lightRef.current.position.lerp(new THREE.Vector3(targetX, targetY, 2), 0.15);
      } else {
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.1);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <pointLight ref={lightRef} distance={10} decay={2} color="#2EED2E" />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} roughness={0.1} ior={1.5} thickness={0.5} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#2EED2E" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function ServiceCore3D({ isHovered, mouseX, mouseY }: { isHovered: boolean; mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.9 }}>
      {/* OPTIMIZATION: dpr w powerPreference */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ powerPreference: "high-performance", antialias: false }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <QuantumCore isHovered={isHovered} mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}