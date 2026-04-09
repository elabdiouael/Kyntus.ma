"use client";

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.05, // Ch7al t9il/khfif l'scroll (0.05 hia l'hbaal)
      duration: 1.5,
      smoothWheel: true,
    }}>
      {children}
    </ReactLenis>
  );
}