"use client";

import { ReactNode } from "react";
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // L'9aleb hna: Kanrodouha 'any' bach TypeScript maybkich 3la l'children
  const LenisComponent = ReactLenis as any;

  return (
    <LenisComponent root options={{ 
      lerp: 0.05, // Ch7al t9il/khfif l'scroll (0.05 hia l'hbaal)
      duration: 1.5,
      smoothWheel: true,
    }}>
      {children}
    </LenisComponent>
  );
}