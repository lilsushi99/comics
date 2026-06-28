import React, { useState, useEffect, useRef } from 'react';

interface CountUpMetricProps {
  key?: string;
  value: number;
  label: string;
  suffix: string;
}

export default function CountUpMetric({ value, label, suffix }: CountUpMetricProps) {
  const [currentVal, setCurrentVal] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const isHoverAnimating = useRef(false);

  const animateRange = (from: number, to: number, duration: number, onComplete?: () => void) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Premium easeOutExpo curve for elegant cinematic pacing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextValue = from + (to - from) * easeProgress;
      
      if (to % 1 === 0) {
        setCurrentVal(Math.floor(nextValue));
      } else {
        setCurrentVal(parseFloat(nextValue.toFixed(1)));
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCount);
      } else {
        setCurrentVal(to);
        if (onComplete) {
          onComplete();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCount);
  };

  const startInitialAnimation = () => {
    // Slower, more premium 2.4s initial duration
    animateRange(0, value, 2400);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startInitialAnimation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  const handleMouseEnter = () => {
    if (isHoverAnimating.current) return;
    isHoverAnimating.current = true;

    // Phase 1: Gracefully count down to 0 (500ms)
    animateRange(currentVal, 0, 500, () => {
      // Phase 2: Beautifully rebuild up to the target value (2000ms)
      animateRange(0, value, 2000, () => {
        isHoverAnimating.current = false;
      });
    });
  };

  return (
    <div
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      className="p-6 md:p-8 bg-[#0a0a0a] border border-neutral-900 rounded-none flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-orange-500/30 cursor-pointer group"
    >
      <span className="font-sans text-4xl md:text-5xl font-black text-white leading-none tracking-tight flex items-center mb-2 group-hover:text-orange-400 transition-colors duration-300">
        {currentVal % 1 === 0 ? currentVal.toLocaleString() : currentVal.toFixed(1)}
        <span className="text-neutral-500 ml-1 font-mono text-xl group-hover:text-orange-500/50 transition-colors duration-300">{suffix}</span>
      </span>
      <span className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase group-hover:text-white transition-colors duration-300">
        {label}
      </span>
    </div>
  );
}
export type { CountUpMetricProps };
