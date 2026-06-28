import React, { useState } from 'react';

interface ComicConveyorProps {
  media: { id: string; url: string; type: 'image' | 'video' }[];
  speed: number; // base speed scale in seconds
  direction: 'horizontal' | 'vertical';
  reverse?: boolean;
  enabled: boolean;
  className?: string;
}

export default function ComicConveyor({
  media,
  speed = 3,
  direction,
  reverse = false,
  enabled,
  className = '',
}: ComicConveyorProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback in case there are no items or not enabled
  if (!media || media.length === 0) return null;

  // We multiply or repeat the array to ensure the track has ample length to scroll infinitely
  const repeatCount = media.length < 5 ? 6 : 4;
  const trackMedia: { id: string; url: string; type: 'image' | 'video' }[] = [];
  for (let r = 0; r < repeatCount; r++) {
    trackMedia.push(...media);
  }

  // Translate CMS speed value to a comfortable duration (Higher speed = faster = lower duration)
  const baseDuration = 90 / (speed || 3);
  const duration = isHovered ? baseDuration * 2.2 : baseDuration;

  // Generate a clean, unique animation name to avoid collision and force immediate browser recalculation
  const animationId = React.useId().replace(/:/g, '');
  const animationName = `conveyor-animation-${direction}-${animationId}-${Math.round(baseDuration)}-${isHovered ? 'hover' : 'normal'}`;

  const translateAmount = 100 / repeatCount;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden cursor-pointer group rounded-none border border-white/10 bg-[#0d0d0d] flex select-none shadow-2xl transition-all duration-500 hover:scale-[1.025] hover:border-orange-500/40 hover:shadow-[0_0_35px_rgba(249,115,22,0.15)] ${className}`}
    >
      <style>{`
        @keyframes ${animationName} {
          0% {
            transform: ${
              direction === 'vertical'
                ? `translateY(${reverse ? `-${translateAmount}%` : '0%'})`
                : `translateX(${reverse ? `-${translateAmount}%` : '0%'})`
            };
          }
          100% {
            transform: ${
              direction === 'vertical'
                ? `translateY(${reverse ? '0%' : `-${translateAmount}%`})`
                : `translateX(${reverse ? '0%' : `-${translateAmount}%`})`
            };
          }
        }
      `}</style>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] z-10" />
      
      {/* Vignette & soft lighting overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40 z-10 transition-opacity duration-500 group-hover:opacity-30" />

      {/* Comic action lines overlay visible on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_90%),_repeating-radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0,_rgba(255,255,255,0.15)_1px,_transparent_1px,_transparent_10px)] z-10" />

      {/* Conveyor label banner */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 px-2.5 py-1 border border-white/5 rounded-none text-[8px] font-mono tracking-widest uppercase text-orange-400 font-bold shadow-lg transition-all duration-500 group-hover:bg-orange-500 group-hover:text-white">
        {direction === 'vertical' ? 'PRINTING REEL' : 'STRIP SEQUENCE'}
      </div>

      <div
        className="flex"
        style={{
          width: direction === 'horizontal' ? 'max-content' : '100%',
          height: direction === 'vertical' ? 'max-content' : '100%',
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          animationName: enabled ? animationName : 'none',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          transition: 'animation-duration 0.8s ease-out',
        }}
      >
        {trackMedia.map((item, i) => (
          <div
            key={i}
            className={`shrink-0 overflow-hidden relative border-neutral-900 ${
              direction === 'vertical'
                ? 'w-full h-[240px] border-b-2'
                : 'w-[180px] md:w-[220px] h-full border-r-2'
            }`}
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                muted
                loop
                autoPlay
                playsInline
                className={`w-full h-full object-cover transition-all duration-700 select-none ${
                  isHovered
                    ? 'scale-[1.04] grayscale-0 filter brightness-105'
                    : 'scale-100 grayscale filter brightness-90'
                }`}
              />
            ) : (
              <img
                src={item.url}
                alt={`Continuous frame ${i}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-700 select-none ${
                  isHovered
                    ? 'scale-[1.04] grayscale-0 contrast-100 filter brightness-105 saturate-110'
                    : 'scale-100 grayscale contrast-125 filter brightness-90'
                }`}
              />
            )}
            {/* Subtle highlight ring */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
