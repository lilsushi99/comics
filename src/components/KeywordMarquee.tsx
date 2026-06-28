import React from 'react';

interface KeywordMarqueeProps {
  keywords: string[];
  speed?: number;
}

export default function KeywordMarquee({ keywords, speed = 2.5 }: KeywordMarqueeProps) {
  // Triple the list to ensure the scrolling is completely seamless and covers wide viewports
  const repeatedKeywords = [...keywords, ...keywords, ...keywords, ...keywords];

  const colors = [
    'hover:text-amber-400 hover:shadow-[0_0_10px_rgba(251,191,36,0.3)]',
    'hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]',
    'hover:text-rose-500 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    'hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(52,211,153,0.3)]',
    'hover:text-purple-400 hover:shadow-[0_0_10px_rgba(192,132,252,0.3)]',
  ];

  // Convert speed value (e.g. 1 to 10) to actual duration in seconds
  // Higher speed value = faster = shorter animation duration.
  // We've adjusted the default speed scale to be slower and highly readable (180 base instead of 80)
  const calculatedDuration = `${Math.max(4, 180 / (speed || 2.5))}s`;

  return (
    <div
      id="keyword-marquee-section"
      className="relative py-12 bg-black border-y border-neutral-900 overflow-hidden select-none flex flex-col gap-6"
    >
      {/* Banner 1: Left-scrolling, full opacity */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div 
          className="animate-marquee-left flex whitespace-nowrap gap-16 items-center"
          style={{ animationDuration: calculatedDuration }}
        >
          {repeatedKeywords.map((word, index) => {
            const hoverColor = colors[index % colors.length];
            return (
              <span
                key={`banner1-${index}`}
                className={`font-mono text-3xl md:text-5xl font-black tracking-tighter uppercase transition-all duration-300 cursor-default text-neutral-100 px-4 py-2 ${hoverColor}`}
              >
                {word}
                <span className="ml-16 text-neutral-700">/</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Banner 2: Right-scrolling, reduced opacity */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div 
          className="animate-marquee-right flex whitespace-nowrap gap-16 items-center"
          style={{ animationDuration: calculatedDuration }}
        >
          {repeatedKeywords.map((word, index) => {
            return (
              <span
                key={`banner2-${index}`}
                className="font-mono text-3xl md:text-5xl font-extrabold tracking-tighter uppercase cursor-default text-neutral-600 px-4 py-2 opacity-40 select-none"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
              >
                {word}
                <span className="ml-16 text-neutral-800">/</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Side Vignettes for cinematic fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
