import React, { useEffect, useRef } from 'react';
import { StarfieldConfig } from '../types';

interface HeroStarfieldProps {
  config?: StarfieldConfig;
  mode?: 'starfield-a' | 'starfield-b';
}

interface Star {
  x: number;       // 3D coordinate X
  y: number;       // 3D coordinate Y
  z: number;       // 3D coordinate Z (depth, 0 to 1000)
  size: number;    // Base size multiplier
  speedZ: number;  // Velocity along Z-axis
  driftX: number;  // Subtle horizontal drift
  driftY: number;  // Subtle vertical drift
  phase: number;   // Sine phase for organic pulsing
  glowColor: string;
  dispX: number;   // Current cursor displacement X
  dispY: number;   // Current cursor displacement Y
}

interface CelestialBody {
  xPercent: number; // Position percentage
  yPercent: number; // Position percentage
  radius: number;
  type: 'crescent' | 'ringed' | 'misty';
  color: string;
  name: string;
}

export default function HeroStarfield({ config, mode = 'starfield-a' }: HeroStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const smoothedMouseRef = useRef({ x: -1000, y: -1000 });

  // Mode B enforces highly calm, premium, low-density aesthetics
  const isModeB = mode === 'starfield-b';

  // Extract / Calculate Starfield config based on mode
  const starCount = isModeB ? Math.min(config?.numStars ?? 45, 24) : (config?.numStars ?? 45);
  const speedScale = isModeB ? (config?.speed ?? 1.0) * 0.35 : (config?.speed ?? 1.0);
  const minSize = config?.minSize ?? 0.8;
  const maxSize = isModeB ? (config?.maxSize ?? 2.8) * 0.8 : (config?.maxSize ?? 2.8);
  const brightnessLevel = isModeB ? (config?.brightness ?? 0.9) * 0.55 : (config?.brightness ?? 0.9);
  const glowIntensity = isModeB ? 0 : (config?.glowIntensity ?? 8);
  const accentColor = config?.accentColor ?? '#f97316';
  const enableHover = config?.enableHover ?? true;

  // Tiny celestial objects that can be discovered on hover
  const celestialBodies: CelestialBody[] = [
    { xPercent: 0.28, yPercent: 0.35, radius: 10, type: 'ringed', color: 'rgba(249, 115, 22, 0.45)', name: 'Aurelia Prime' },
    { xPercent: 0.72, yPercent: 0.24, radius: 7, type: 'crescent', color: 'rgba(56, 189, 248, 0.4)', name: 'Elysium IV' },
    { xPercent: 0.55, yPercent: 0.76, radius: 14, type: 'misty', color: 'rgba(168, 85, 247, 0.35)', name: 'Nebula Veil' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const stars: Star[] = [];
    const maxDepth = 1000;

    // Helper to generate a single star
    const createStar = (zInitial?: number): Star => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      // Multiplied by speedScale for perfect interactive pacing
      const speedZ = direction * (1.0 + Math.random() * 1.5) * speedScale;

      return {
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: zInitial !== undefined ? zInitial : Math.random() * maxDepth,
        size: Math.random(),
        speedZ,
        driftX: (Math.random() - 0.5) * 0.1 * speedScale,
        driftY: (Math.random() - 0.5) * 0.1 * speedScale,
        phase: Math.random() * Math.PI * 2,
        glowColor: accentColor,
        dispX: 0,
        dispY: 0,
      };
    };

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push(createStar());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my, active: true };
      
      // Initialize smoothed position on first move
      if (smoothedMouseRef.current.x === -1000) {
        smoothedMouseRef.current = { x: mx, y: my };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = (time: number) => {
      // 1. Smooth mouse tracking with easing for premium feel
      if (mouseRef.current.active) {
        smoothedMouseRef.current.x += (mouseRef.current.x - smoothedMouseRef.current.x) * 0.08;
        smoothedMouseRef.current.y += (mouseRef.current.y - smoothedMouseRef.current.y) * 0.08;
      } else {
        // Drift smoothed mouse out slowly
        smoothedMouseRef.current.x += (-1000 - smoothedMouseRef.current.x) * 0.05;
        smoothedMouseRef.current.y += (-1000 - smoothedMouseRef.current.y) * 0.05;
      }

      // Backdrop base fill (deep, rich galactic blacks)
      ctx.fillStyle = isModeB ? '#030303' : '#050505';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric layer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.002)';
      for (let i = 0; i < (isModeB ? 2 : 4); i++) {
        ctx.fillRect(Math.random() * width, Math.random() * height, 1.2, 1.2);
      }

      const fov = 400;

      // 2. Render Discovery Celestial Bodies (Very subtle space exploration)
      celestialBodies.forEach(body => {
        const bx = body.xPercent * width;
        const by = body.yPercent * height;

        // Calculate proximity to cursor
        let opacity = 0.015; // Almost invisible normally
        if (mouseRef.current.active) {
          const dx = bx - smoothedMouseRef.current.x;
          const dy = by - smoothedMouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const activeRadius = 140;

          if (dist < activeRadius) {
            // Smoothly reveal planet (max 0.22 opacity in B, 0.35 in A)
            const factor = 1 - dist / activeRadius;
            opacity += factor * (isModeB ? 0.22 : 0.35);
          }
        }

        if (opacity > 0.01) {
          ctx.save();
          ctx.shadowBlur = isModeB ? 0 : 6;
          ctx.shadowColor = body.color;

          if (body.type === 'crescent') {
            // Draw a tiny elegant crescent sphere
            ctx.beginPath();
            ctx.arc(bx, by, body.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
            ctx.fill();

            // Crescent shadow overlay
            const grad = ctx.createRadialGradient(bx - body.radius * 0.3, by - body.radius * 0.3, body.radius * 0.1, bx, by, body.radius);
            grad.addColorStop(0, body.color.replace('0.4', String(opacity)));
            grad.addColorStop(0.7, 'rgba(0,0,0,0.85)');
            grad.addColorStop(1, 'rgba(0,0,0,0.95)');
            ctx.fillStyle = grad;
            ctx.fill();
          } else if (body.type === 'ringed') {
            // Draw a tiny planet sphere
            ctx.beginPath();
            ctx.arc(bx, by, body.radius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.fill();

            // Draw planetary rings
            ctx.beginPath();
            ctx.ellipse(bx, by, body.radius * 1.5, body.radius * 0.3, -Math.PI / 8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            // Misty gas dust cloud
            const grad = ctx.createRadialGradient(bx, by, 1, bx, by, body.radius * 2);
            grad.addColorStop(0, body.color.replace('0.35', String(opacity * 0.8)));
            grad.addColorStop(0.5, body.color.replace('0.35', String(opacity * 0.25)));
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(bx, by, body.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          // Very faint label if fully revealed
          if (opacity > 0.15) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(opacity - 0.15) * 0.4})`;
            ctx.font = '7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(body.name, bx, by + body.radius + 12);
          }
          ctx.restore();
        }
      });

      // 3. Update and render stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Move star on depth Z axis
        s.z += s.speedZ;

        // Apply background drift
        s.x += s.driftX + Math.sin(time * 0.0008 + s.phase) * 0.05;
        s.y += s.driftY + Math.cos(time * 0.001 + s.phase) * 0.05;

        // Depth bounds reset
        if (s.z <= 0) {
          stars[i] = createStar(maxDepth);
          continue;
        } else if (s.z >= maxDepth) {
          stars[i] = createStar(40);
          continue;
        }

        // Project to 2D screen space
        let px = (s.x / s.z) * fov + width / 2;
        let py = (s.y / s.z) * fov + height / 2;

        // Outer bounds checking
        const pad = 120;
        if (px < -pad || px > width + pad || py < -pad || py > height + pad) {
          stars[i] = createStar();
          continue;
        }

        // Compute base depth multiplier
        const t = 1 - s.z / maxDepth; // 0 (far) to 1 (near)

        // Calculate size & brightness based on depth
        const baseSize = minSize + s.size * (maxSize - minSize);
        let starSize = baseSize * (0.35 + t * 1.65);
        let brightness = brightnessLevel * (0.25 + t * 0.75);

        // Organic stellar pulsing (slightly softer in Mode B)
        const pulseFreq = isModeB ? 0.0015 : 0.003;
        const pulse = 0.88 + Math.sin(time * pulseFreq + s.phase) * 0.12;
        brightness *= pulse;

        // 4. Subtle Cursor Proximity Star Displacement
        let hoverFactor = 0;
        let targetDispX = 0;
        let targetDispY = 0;

        if (enableHover && mouseRef.current.active) {
          const dx = px - smoothedMouseRef.current.x;
          const dy = py - smoothedMouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxInfluenceDist = 120;

          if (dist < maxInfluenceDist) {
            // Factor decays beautifully with distance
            hoverFactor = 1 - dist / maxInfluenceDist;
            
            // Subtly push the star away from the cursor (displacement)
            // Limit to max 12 pixels displacement to preserve pristine elegance
            const angle = Math.atan2(dy, dx);
            const dispMagnitude = hoverFactor * (isModeB ? 6 : 12);
            targetDispX = Math.cos(angle) * dispMagnitude;
            targetDispY = Math.sin(angle) * dispMagnitude;
          }
        }

        // Smoothly interpolate current displacement to target displacement
        s.dispX += (targetDispX - s.dispX) * 0.06;
        s.dispY += (targetDispY - s.dispY) * 0.06;

        // Apply displacement to drawing coordinates
        px += s.dispX;
        py += s.dispY;

        // Enhance interactive feedback slightly in Mode A
        if (!isModeB) {
          starSize *= (1 + hoverFactor * 0.35);
          brightness *= (1 + hoverFactor * 0.5);
        } else {
          // Mode B has extremely subtle cursor interaction (no scaling, soft brightness change)
          brightness *= (1 + hoverFactor * 0.2);
        }

        const finalOpacity = Math.max(0.04, Math.min(1.0, brightness));

        // 5. Draw Star Halo (Mode A only)
        if (!isModeB && glowIntensity > 0 && (hoverFactor > 0.05 || t > 0.45)) {
          const glowRadius = starSize * (glowIntensity * 1.2 + hoverFactor * 8);
          const grad = ctx.createRadialGradient(px, py, starSize * 0.1, px, py, glowRadius);

          if (hoverFactor > 0) {
            grad.addColorStop(0, `${s.glowColor}${Math.floor(finalOpacity * 240).toString(16).padStart(2, '0')}`);
            grad.addColorStop(0.3, `${s.glowColor}${Math.floor(finalOpacity * 80).toString(16).padStart(2, '0')}`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity * 0.35})`);
            grad.addColorStop(0.5, `rgba(255, 255, 255, ${finalOpacity * 0.08})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          ctx.beginPath();
          ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // 6. Draw Star Solid Core
        ctx.beginPath();
        ctx.arc(px, py, starSize, 0, Math.PI * 2);

        if (!isModeB && hoverFactor > 0.15) {
          ctx.fillStyle = s.glowColor;
        } else {
          // Pristine warm-white color with alpha opacity matching depth and pulsing
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        }
        ctx.fill();
      }

      // 7. Draw the Minimalist eased dot cursor (Only when hovering the canvas)
      if (mouseRef.current.active && smoothedMouseRef.current.x > 0) {
        ctx.beginPath();
        ctx.arc(smoothedMouseRef.current.x, smoothedMouseRef.current.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();

        // Elegant outer subtle border
        ctx.beginPath();
        ctx.arc(smoothedMouseRef.current.x, smoothedMouseRef.current.y, 7.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [starCount, speedScale, minSize, maxSize, brightnessLevel, glowIntensity, accentColor, enableHover, isModeB]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Black ambient backgrounds */}
      <div className={`absolute inset-0 z-0 transition-colors duration-1000 ${isModeB ? 'bg-[#020202]' : 'bg-[#040404]'}`} />
      
      {/* Secondary depth fog with interactive properties */}
      <div className="absolute inset-0 bg-radial-gradient from-neutral-900/10 via-neutral-950/70 to-[#020202] z-0" />
      
      {/* Interactive canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-10 block cursor-none"
        style={{ contentVisibility: 'auto' }}
      />

      {/* Atmospheric fog overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/30 pointer-events-none z-20" />
    </div>
  );
}
