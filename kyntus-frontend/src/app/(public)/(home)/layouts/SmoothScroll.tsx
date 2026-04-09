"use client";

import { ReactNode } from "react";
import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const LenisComponent = ReactLenis as any;

  return (
    <LenisComponent root options={{ 
      lerp: 0.15, // 0.15 kat3ti scroll smooth bzaf w f nefs lwe9t responsive (machi t9il)
      smoothWheel: true,
      wheelMultiplier: 1, // Hada li kaykheli l'scroll ykoun 3adi (machi katscroli chwia w yzla9 bzaf)
    }}>
      {children}
    </LenisComponent>
  );
}