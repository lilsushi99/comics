import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const currentPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Easing loop for an ultra smooth, lag-free cursor trailing effect
    let animFrameId: number;
    const updateCursor = () => {
      const dx = cursorRef.current.x - currentPos.current.x;
      const dy = cursorRef.current.y - currentPos.current.y;
      
      currentPos.current.x += dx * 0.15;
      currentPos.current.y += dy * 0.15;
      
      setPosition({ x: currentPos.current.x, y: currentPos.current.y });
      animFrameId = requestAnimationFrame(updateCursor);
    };

    animFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Star glowing core */}
      <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
      {/* Ambient solar corona glow */}
      <div className="absolute -inset-2 bg-orange-500/30 rounded-full blur-[2px] animate-pulse" />
    </div>
  );
}
