import React from 'react';
import { clamp, easeOutBack, easeInOutCubic } from '../hooks/useKineticTimeline.ts';

interface SarangRnProps {
  time: number;
  reducedMotion: boolean;
}

const TEXT = 'SARANG RN';
const CHARS = TEXT.split('');

export const SarangRn: React.FC<SarangRnProps> = ({ time, reducedMotion }) => {
  if (reducedMotion) {
    return (
      <div className="w-full flex justify-center items-center py-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.3em] uppercase text-[#f5f5f3] select-none">
          {TEXT}
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-1 sm:py-2 overflow-hidden">
      <div
        className="flex items-center justify-center tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] uppercase font-bold text-lg sm:text-2xl md:text-3xl lg:text-4xl select-none"
        style={{
          fontFamily: "var(--font-streetwear, 'Anton', sans-serif)",
        }}
      >
        {CHARS.map((char, index) => {
          if (char === ' ') {
            return (
              <span key={`space-${index}`} className="w-3 sm:w-5 md:w-6 inline-block">
                &nbsp;
              </span>
            );
          }

          // Compute individual character animation properties
          let opacity = 0;
          let translateY = 100; // in %
          let scale = 1.0;
          let rotate = 0;
          let color = '#f5f5f3';
          let textShadow = 'none';

          // 1. REVEAL (0s - 3s)
          if (time < 3.0) {
            const startReveal = 0.15 + index * 0.12;
            const revealDur = 0.45;
            if (time < startReveal) {
              opacity = 0;
              translateY = 120;
            } else if (time < startReveal + revealDur) {
              const p = (time - startReveal) / revealDur;
              const eased = easeOutBack(p, 1.8);
              opacity = clamp(p * 2, 0, 1);
              translateY = (1 - eased) * 120;
              // Flash red as it snaps in
              color = p < 0.6 ? '#ff2222' : '#f5f5f3';
              if (p < 0.6) {
                textShadow = '2px 2px 0px #ffffff';
              }
            } else {
              opacity = 1;
              translateY = 0;
              color = '#f5f5f3';
            }
          }
          // 2. MAIN IMPACT (3s - 6s)
          else if (time >= 3.0 && time < 6.0) {
            opacity = 1;
            // Shockwave recoil at 3.0s
            if (time < 3.4) {
              const p = (time - 3.0) / 0.4;
              const recoil = Math.sin(p * Math.PI) * -8;
              translateY = recoil;
              scale = 1 + Math.sin(p * Math.PI) * 0.1;
              textShadow = '3px 3px 0px #ff2222';
            } else {
              translateY = 0;
              textShadow = '2px 2px 0px rgba(255, 34, 34, 0.4)';
            }
          }
          // 3. GRAPHIC MOTION (6s - 10s)
          else if (time >= 6.0 && time < 10.0) {
            opacity = 1;
            // Graphic alternating tilt
            const tiltDir = index % 2 === 0 ? 1 : -1;
            const tiltPhase = Math.sin((time - 6.0) * 3);
            rotate = tiltDir * tiltPhase * 3.5;

            // Inversion burst at 7.5s - 8.3s
            if (time >= 7.5 && time < 8.3) {
              color = index % 2 === 0 ? '#ff2222' : '#f5f5f3';
              textShadow = index % 2 === 0 ? '3px 3px 0px #f5f5f3' : '3px 3px 0px #ff2222';
              scale = 1.08;
            } else {
              color = '#f5f5f3';
              textShadow = '2px 2px 0px #ff2222';
            }
          }
          // 4. KINETIC TYPOGRAPHY SEQUENCE (10s - 15s)
          else if (time >= 10.0 && time < 15.0) {
            opacity = 1;
            // Traveling wave through the letters
            const wave = Math.sin((time - 10.0) * 4 - index * 0.6);
            translateY = wave * 6;
            scale = 1 + wave * 0.08;
            if (wave > 0.6) {
              color = '#ff2222';
              textShadow = '2px 2px 0px #f5f5f3';
            } else {
              color = '#f5f5f3';
              textShadow = '2px 2px 0px rgba(255, 34, 34, 0.3)';
            }
          }
          // 5. FINAL IMPACT (15s - 18s)
          else if (time >= 15.0 && time < 18.0) {
            opacity = 1;
            // Stroboscopic snaps
            const snapIndex = Math.floor((time - 15.0) * 8);
            const isHighlighted = (snapIndex + index) % 3 === 0;

            if (isHighlighted) {
              color = '#ff2222';
              textShadow = '4px 4px 0px #08080a, -2px -2px 0px #ffffff';
              scale = 1.12;
              translateY = -4;
            } else {
              color = '#f5f5f3';
              textShadow = '2px 2px 0px #ff2222';
              scale = 1.0;
              translateY = 0;
            }
          }
          // 6. SEAMLESS LOOP TRANSITION (18s - 20s)
          else {
            if (time < 19.2) {
              // Settled in pristine lockup
              opacity = 1;
              translateY = 0;
              color = '#f5f5f3';
              textShadow = '2px 2px 0px rgba(255, 34, 34, 0.4)';
              scale = 1.0;
            } else {
              // Smooth continuous ease to match t=0.0s (where opacity=0, translateY=120)
              const p = (time - 19.2) / 0.8;
              const eased = easeInOutCubic(p);
              opacity = 1 - eased;
              translateY = eased * 120;
              scale = 1 - eased * 0.1;
              color = '#f5f5f3';
            }
          }

          return (
            <span
              key={`char-${index}`}
              className="inline-block transition-transform duration-75 will-change-transform"
              style={{
                opacity,
                transform: `translateY(${translateY}%) scale(${scale}) rotate(${rotate}deg)`,
                color,
                textShadow,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};
