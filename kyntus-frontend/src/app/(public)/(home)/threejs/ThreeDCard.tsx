"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Scene({ url }: { url: string }) {
  const imageRef = useRef<THREE.Mesh>(null);
  const [hovered, hover] = useState(false);
  
  // Hadi hya sser! Kanjbdou l'3bar dyal l'cadre HTML nishan
  const { viewport } = useThree();

  useFrame((state) => {
    if (imageRef.current) {
      // Smooth tracking ll souris
      const targetX = (state.mouse.x * Math.PI) / 10;
      const targetY = (state.mouse.y * Math.PI) / 10;
      
      imageRef.current.rotation.y = THREE.MathUtils.lerp(imageRef.current.rotation.y, targetX, 0.08);
      imageRef.current.rotation.x = THREE.MathUtils.lerp(imageRef.current.rotation.x, -targetY, 0.08);
      
      // Mli kat-hoveri, tswira katzid l9ddam (Pop Out)
      imageRef.current.position.z = THREE.MathUtils.lerp(imageRef.current.position.z, hovered ? 1.2 : 0, 0.1);
    }
  });

  return (
    // Float speed khfftha chwia bach tb9a class w b39elha
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      <DreiImage
        ref={imageRef}
        url={url}
        transparent
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        // Scale ki-rempli l'cadre 100% nishan!
        scale={[viewport.width, viewport.height]} 
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
    </Float>
  );
}

export default function ThreeDCard({ imageSrc }: { imageSrc: string }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 10 }}>
      {/* fov 40 bach tswira tban m9adda w ma-m3ewjach bzaf */}
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <Suspense fallback={null}>
          <Scene url={imageSrc} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}