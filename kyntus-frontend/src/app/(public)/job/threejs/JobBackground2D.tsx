"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "../job.module.css";

const _pointer = new THREE.Vector2(9999, 9999);
// 🚨 HADA HOWA L'ROYAL BLUE L'GHAME9 LI BGHITI 🚨
const _colorTop = new THREE.Color("#001540");    
const _colorCenter = new THREE.Color("#ffffff"); 
const _colorBottom = new THREE.Color("#001540"); 

const _gridColorEdge = new THREE.Color("#ffffff");
const _gridColorCenter = new THREE.Color("#2EED2E");

// ============================================================
// 1. GRADIENT BACKGROUND (10% Solid Top/Bottom Logic)
// ============================================================
function GradientBackground() {
  const { viewport } = useThree();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColorTop: { value: _colorTop },
          uColorCenter: { value: _colorCenter },
          uColorBottom: { value: _colorBottom },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColorTop;
          uniform vec3 uColorCenter;
          uniform vec3 uColorBottom;
          varying vec2 vUv;
          void main() {
            vec3 color;
            // 🚨 L'MATH DYAL 10% SOLID LFO9 W LTA7T 🚨
            if (vUv.y <= 0.10) {
              color = uColorBottom; // 10% lta7t blocké
            } else if (vUv.y >= 0.90) {
              color = uColorTop;    // 10% lfo9 blocké
            } else if (vUv.y < 0.5) {
              // D-dégradé kay-bda mn 0.10 w kaysali f 0.5 (l'west)
              float t = smoothstep(0.10, 0.50, vUv.y);
              color = mix(uColorBottom, uColorCenter, t);
            } else {
              // D-dégradé kay-bda mn 0.5 (l'west) w kaysali f 0.90
              float t = smoothstep(0.50, 0.90, vUv.y);
              color = mix(uColorCenter, uColorTop, t);
            }
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    []
  );

  return (
    <mesh material={shaderMaterial} position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
    </mesh>
  );
}

// ============================================================
// 2. GRID BUILDER
// ============================================================
function buildSegmentedGridGeometry(cellSize: number, halfW: number, halfH: number): [THREE.BufferGeometry, Float32Array] {
  const pts: number[] = [];
  const extentW = halfW + cellSize * 4;
  const extentH = halfH + cellSize * 4;

  for (let x = -extentW; x <= extentW; x += cellSize) {
    for (let y = -extentH; y < extentH; y += cellSize) {
      pts.push(x, y, 0, x, y + cellSize, 0);
    }
  }
  for (let y = -extentH; y <= extentH; y += cellSize) {
    for (let x = -extentW; x < extentW; x += cellSize) {
      pts.push(x, y, 0, x + cellSize, y, 0);
    }
  }

  const geo = new THREE.BufferGeometry();
  const posArray = new Float32Array(pts);
  geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
  return [geo, new Float32Array(posArray)];
}

// ============================================================
// 3. INTERACTIVE SHADER GRID
// ============================================================
function InteractiveDynamicGrid() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();
  const CELL_SIZE = 1.5; 

  const [gridGeo, originalPositions] = useMemo(() => {
    return buildSegmentedGridGeometry(CELL_SIZE, viewport.width / 2, viewport.height / 2);
  }, [viewport.width, viewport.height]);

  const gridShaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColorEdge: { value: _gridColorEdge }, 
          uColorCenter: { value: _gridColorCenter }, 
        },
        vertexShader: `
          varying float vY;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            vY = (gl_Position.y / gl_Position.w + 1.0) / 2.0; 
          }
        `,
        fragmentShader: `
          uniform vec3 uColorEdge;
          uniform vec3 uColorCenter;
          varying float vY;
          void main() {
            vec3 color;
            if (vY < 0.5) {
              float t = smoothstep(0.0, 0.5, vY);
              color = mix(uColorEdge, uColorCenter, t);
            } else {
              float t = smoothstep(0.5, 1.0, vY);
              color = mix(uColorCenter, uColorEdge, t);
            }
            gl_FragColor = vec4(color, 0.35); 
          }
        `,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      _pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      _pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
    const mouseX = (_pointer.x * viewport.width) / 2;
    const mouseY = (_pointer.y * viewport.height) / 2;
    const RADIUS = CELL_SIZE * 3.5;
    const FORCE = CELL_SIZE * 0.8;
    const SPRING = 0.15;

    for (let i = 0, len = positions.length; i < len; i += 3) {
      const ox = originalPositions[i];
      const oy = originalPositions[i + 1];
      const dx = ox - mouseX;
      const dy = oy - mouseY;
      const distSq = dx * dx + dy * dy;
      const radiusSq = RADIUS * RADIUS;
      let tx = ox, ty = oy;
      
      if (distSq < radiusSq) {
        const dist = Math.sqrt(distSq) || 0.0001;
        const force = ((RADIUS - dist) / RADIUS) * ((RADIUS - dist) / RADIUS);
        tx += (dx / dist) * force * FORCE;
        ty += (dy / dist) * force * FORCE;
      }
      positions[i] += (tx - positions[i]) * SPRING;
      positions[i + 1] += (ty - positions[i + 1]) * SPRING;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <lineSegments ref={linesRef} geometry={gridGeo} material={gridShaderMaterial} />;
}

export default function JobBackground2D() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      <Canvas orthographic camera={{ zoom: 20, position: [0, 0, 10] }} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
        <GradientBackground />
        <InteractiveDynamicGrid />
      </Canvas>
    </div>
  );
}