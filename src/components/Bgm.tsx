import React from 'react';
import { clamp, easeOutBack, easeInOutCubic } from '../hooks/useKineticTimeline.ts';

interface BgmProps {
  time: number;
  reducedMotion: boolean;
}

const TEXT = 'BGM';
const CHARS = TEXT.split('');

export const Bgm: React.FC<BgmProps> = ({ time, reducedMotion }) => {
  if (reducedMotion) {
    return (
      <div className="w-full flex justify-center items-center py-2 sm:py-3">
        <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.25em] uppercase text-[#f5f5f3] select-none drop-shadow-[4px_4px_0px_#ff2222]">
          {TEXT}
        </h3>
      </div>
    );
  }

  // Tracking width variation across phases
  let trackingEm = 0.25;
  if (time >= 10.0 && time < 15.0) {
    const p = (time - 10.0) / 5.0;
    trackingEm = 0.2 + Math.sin(p * Math.PI * 2) * 0.15;
  }

  return (
    <div className="w-full flex justify-center items-center py-1 sm:py-2 select-none overflow-hidden relative">
      <div
        className="flex items-center justify-center font-black uppercase select-none text-[clamp(2.5rem,9.5vw,7.5rem)] leading-none"
        style={{
          fontFamily: "var(--font-streetwear, 'Anton', sans-serif)",
          letterSpacing: `${trackingEm}em`,
        }}
      >
        {CHARS.map((char, index) => {
          let opacity = 0;
          let translateY = 100; // in %
          let translateX = 0;
          let scale = 1.0;
          let rotate = 0;
          let color = '#f5f5f3';
          let stroke = 'none';

          let shadowX = 0;
          let shadowY = 0;
          let shadowColor = '#ff2222';
          let shadowOpacity = 0;

          // 1. OPENING (0s - 3s)
          if (time < 3.0) {
            opacity = 0;
            translateY = 120;
          }
          // 2. MAIN TYPOGRAPHY IMPACT (3s - 6s)
          // Heavy slam up starting at 3.3s
          else if (time >= 3.0 && time < 6.0) {
            const startReveal = 3.3 + index * 0.15;
            const revealDur = 0.5;

            if (time < startReveal) {
              opacity = 0;
              translateY = 120;
            } else if (time < startReveal + revealDur) {
              const p = (time - startReveal) / revealDur;
              const eased = easeOutBack(p, 2.0);
              opacity = clamp(p * 2, 0, 1);
              translateY = (1 - eased) * 120;
              scale = 1 + (1 - p) * 0.25;
              color = p < 0.5 ? '#ff2222' : '#f5f5f3';
              shadowOpacity = p * 0.9;
              shadowX = p * 5;
              shadowY = p * 5;
            } else {
              opacity = 1;
              translateY = 0;
              color = '#f5f5f3';
              shadowOpacity = 0.9;
              shadowX = 5;
              shadowY = 5;
            }
          }
          // 3. GRAPHIC MOTION (6s - 10s)
          else if (time >= 6.0 && time < 10.0) {
            opacity = 1;
            // Alternating step motion
            const stepShift = (index === 1 ? -1 : 1) * Math.sin((time - 6.0) * 2.5) * 15;
            translateY = stepShift;
            rotate = (index === 1 ? 2 : -2) * Math.sin((time - 6.0) * 2.5);

            // Inversion sync at 7.5s - 8.8s
            if (time >= 7.5 && time < 8.8) {
              if (index === 1) {
                // 'G' becomes bold red fill
                color = '#ff2222';
                shadowColor = '#f5f5f3';
                shadowX = 6;
                shadowY = 6;
                shadowOpacity = 1;
              } else {
                color = 'transparent';
                stroke = '2px #f5f5f3';
                shadowColor = '#ff2222';
                shadowX = 5;
                shadowY = 5;
                shadowOpacity = 0.8;
              }
            } else {
              color = '#f5f5f3';
              shadowX = 5;
              shadowY = 5;
              shadowOpacity = 0.9;
            }
          }
          // 4. KINETIC TYPOGRAPHY SEQUENCE (10s - 15s)
          else if (time >= 10.0 && time < 15.0) {
            opacity = 1;
            const wave = Math.sin((time - 10.0) * 3 + index * 1.2);
            translateY = wave * 8;
            scale = 1 + wave * 0.08;

            if (index === 1 && Math.sin(time * 3) > 0) {
              color = '#ff2222';
            } else {
              color = '#f5f5f3';
            }

            shadowX = 5 + wave * 2;
            shadowY = 5 + wave * 2;
            shadowOpacity = 0.9;
          }
          // 5. FINAL IMPACT (15s - 18s)
          else if (time >= 15.0 && time < 18.0) {
            opacity = 1;
            const snap = Math.floor((time - 15.0) * 6);
            const isSnap = (snap + index) % 2 === 0;

            if (isSnap) {
              color = '#ff2222';
              shadowColor = '#ffffff';
              scale = 1.1;
              translateY = -5;
              shadowX = 7;
              shadowY = 7;
              shadowOpacity = 1;
            } else {
              color = '#f5f5f3';
              shadowColor = '#ff2222';
              scale = 1.0;
              translateY = 0;
              shadowX = 5;
              shadowY = 5;
              shadowOpacity = 0.9;
            }
          }
          // 6. SEAMLESS LOOP TRANSITION (18s - 20s)
          else {
            if (time < 19.1) {
              opacity = 1;
              translateY = 0;
              scale = 1.0;
              rotate = 0;
              color = '#f5f5f3';
              shadowX = 5;
              shadowY = 5;
              shadowColor = '#ff2222';
              shadowOpacity = 0.9;
            } else {
              // Easing out continuously to match t=0.0s (opacity=0, translateY=120)
              const p = (time - 19.1) / 0.9;
              const eased = easeInOutCubic(p);
              opacity = 1 - eased;
              translateY = eased * 120;
              scale = 1 - eased * 0.1;
              color = '#f5f5f3';
              shadowOpacity = (1 - eased) * 0.9;
            }
          }

          return (
            <div
              key={`bgm-char-${index}`}
              className="relative inline-block overflow-visible will-change-transform"
            >
              {/* Offset Screen-Print Shadow Layer */}
              {shadowOpacity > 0.05 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none select-none"
                  style={{
                    opacity: shadowOpacity,
                    transform: `translate(${translateX + shadowX}px, calc(${translateY}% + ${shadowY}px)) scale(${scale}) rotate(${rotate}deg)`,
                    color: shadowColor,
                    zIndex: 0,
                  }}
                >
                  {char}
                </span>
              )}

              {/* Main Letter Body */}
              <span
                className="relative inline-block transition-transform duration-75 will-change-transform z-10"
                style={{
                  opacity,
                  transform: `translate(${translateX}px, ${translateY}%) scale(${scale}) rotate(${rotate}deg)`,
                  color,
                  WebkitTextStroke: stroke !== 'none' ? stroke : undefined,
                }}
              >
                {char}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
