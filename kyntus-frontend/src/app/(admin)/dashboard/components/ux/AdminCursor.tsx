'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('tr'); // 7ta s-stoura dyal l'jadawil

      setIsHovering(!!isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* ── CORE DOT (Neon Cyan Glow) ── */}
      <motion.div
        animate={{ 
          x: mousePosition.x - 4, 
          y: mousePosition.y - 4, 
          scale: isClicking ? 0.5 : (isHovering ? 0 : 1) 
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: 8, height: 8,
          backgroundColor: '#00e5ff', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 999999, // Z-index d l'moulouk
          boxShadow: '0 0 10px #00e5ff, 0 0 20px #00e5ff' // Glow s7i7
        }}
      />
      
      {/* ── OUTER RING (Cyan Snap) ── */}
      <motion.div
        animate={{ 
          x: mousePosition.x - (isHovering ? 25 : 20), 
          y: mousePosition.y - (isHovering ? 25 : 20), 
          scale: isClicking ? 0.8 : 1,
          width: isHovering ? 50 : 40,
          height: isHovering ? 50 : 40,
          backgroundColor: isHovering ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 229, 255, 0.4)'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0,
          border: '1.5px solid', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 999998,
          boxShadow: isHovering ? '0 0 20px rgba(0, 229, 255, 0.4)' : 'none',
          backdropFilter: isHovering ? 'blur(2px)' : 'none'
        }}
      />
    </>
  );
}