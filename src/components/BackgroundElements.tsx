import React from 'react';

interface BackgroundElementsProps {
  time: number;
  reducedMotion: boolean;
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({ time, reducedMotion }) => {
  // Flash effects at high impact moments (e.g. 3.0s, 7.5s, 16.0s)
  let flashOpacity = 0;
  let flashColor = '#ff2222';

  if (!reducedMotion) {
    if (time >= 3.0 && time < 3.2) {
      flashOpacity = (1 - (time - 3.0) / 0.2) * 0.15;
      flashColor = '#ff2222';
    } else if (time >= 7.5 && time < 7.7) {
      flashOpacity = (1 - (time - 7.5) / 0.2) * 0.25;
      flashColor = '#f5f5f3';
    } else if (time >= 15.0 && time < 15.2) {
      flashOpacity = (1 - (time - 15.0) / 0.2) * 0.2;
      flashColor = '#ff2222';
    } else if (time >= 17.4 && time < 17.6) {
      flashOpacity = (1 - (time - 17.4) / 0.2) * 0.3;
      flashColor = '#ff2222';
    }
  }

  // Subtle geometric line shift with kinetic tempo
  const lineShift = reducedMotion ? 0 : Math.sin(time * 1.5) * 4;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* High-impact flash layer */}
      <div
        className="absolute inset-0 transition-opacity duration-75"
        style={{
          backgroundColor: flashColor,
          opacity: flashOpacity,
        }}
      />

      {/* Screen-print fine grain noise filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="streetwear-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.07" />
          </feComponentTransfer>
        </filter>
      </svg>
      <div
        className="absolute inset-0 mix-blend-overlay opacity-60"
        style={{
          filter: 'url(#streetwear-grain)',
        }}
      />

      {/* Subtle graphic framing corners & crosshairs (streetwear print registration) */}
      <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none opacity-40">
        <div className="w-full h-[1.5px] bg-[#f5f5f3]" />
        <div className="w-[1.5px] h-full bg-[#f5f5f3]" />
        <div className="absolute top-0 left-0 text-[#ff2222] font-mono text-xs leading-none translate-x-1.5 translate-y-1.5">
          +
        </div>
      </div>

      <div className="absolute top-6 right-6 w-8 h-8 pointer-events-none opacity-40">
        <div className="w-full h-[1.5px] bg-[#f5f5f3]" />
        <div className="absolute right-0 top-0 w-[1.5px] h-full bg-[#f5f5f3]" />
        <div className="absolute top-0 right-0 text-[#ff2222] font-mono text-xs leading-none -translate-x-1.5 translate-y-1.5">
          +
        </div>
      </div>

      <div className="absolute bottom-6 left-6 w-8 h-8 pointer-events-none opacity-40">
        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#f5f5f3]" />
        <div className="w-[1.5px] h-full bg-[#f5f5f3]" />
        <div className="absolute bottom-0 left-0 text-[#ff2222] font-mono text-xs leading-none translate-x-1.5 -translate-y-1.5">
          +
        </div>
      </div>

      <div className="absolute bottom-6 right-6 w-8 h-8 pointer-events-none opacity-40">
        <div className="absolute bottom-0 right-0 w-full h-[1.5px] bg-[#f5f5f3]" />
        <div className="absolute right-0 bottom-0 w-[1.5px] h-full bg-[#f5f5f3]" />
        <div className="absolute bottom-0 right-0 text-[#ff2222] font-mono text-xs leading-none -translate-x-1.5 -translate-y-1.5">
          +
        </div>
      </div>

      {/* Center registration ticks */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-1 opacity-25">
        <div className="w-4 h-[1.5px] bg-[#ff2222]" />
        <div className="w-2 h-[1.5px] bg-[#f5f5f3]" />
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-1 opacity-25">
        <div className="w-2 h-[1.5px] bg-[#f5f5f3]" />
        <div className="w-4 h-[1.5px] bg-[#ff2222]" />
      </div>

      {/* Screen-print color calibration blocks (pure geometric squares) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
        <div className="w-2.5 h-2.5 bg-[#f5f5f3]" />
        <div className="w-2.5 h-2.5 bg-[#ff2222]" />
        <div className="w-2.5 h-2.5 bg-[#18181b] border border-[#f5f5f3]/40" />
      </div>

      {/* Subtle graphic hairlines framing the typography area */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-4/5 max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#f5f5f3]/15 to-transparent pointer-events-none"
        style={{
          top: '22%',
          transform: `translateX(-50%) translateY(${lineShift}px)`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-4/5 max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-[#ff2222]/20 to-transparent pointer-events-none"
        style={{
          bottom: '22%',
          transform: `translateX(-50%) translateY(${-lineShift}px)`,
        }}
      />
    </div>
  );
};
