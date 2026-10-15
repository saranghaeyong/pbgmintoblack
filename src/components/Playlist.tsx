import React from 'react';
import { clamp, easeOutBack, easeInOutCubic } from '../hooks/useKineticTimeline.ts';

interface PlaylistProps {
  time: number;
  reducedMotion: boolean;
}

const TEXT = 'PLAYLIST';
const CHARS = TEXT.split('');

export const Playlist: React.FC<PlaylistProps> = ({ time, reducedMotion }) => {
  if (reducedMotion) {
    return (
      <div className="w-full flex justify-center items-center py-2 sm:py-4">
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[14rem] font-black tracking-tighter uppercase text-[#f5f5f3] leading-none select-none drop-shadow-[6px_6px_0px_#ff2222]">
          {TEXT}
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-1 sm:py-2 select-none overflow-hidden relative">
      <div
        className="flex items-center justify-center font-black tracking-[-0.03em] uppercase leading-none select-none text-[clamp(4.2rem,17vw,14.5rem)]"
        style={{
          fontFamily: "var(--font-streetwear, 'Anton', sans-serif)",
        }}
      >
        {CHARS.map((char, index) => {
          // Defaults
          let opacity = 0;
          let translateY = 100; // in %
          let translateX = 0; // in px
          let scaleX = 1.0;
          let scaleY = 1.0;
          let rotate = 0;
          let color = '#f5f5f3';
          let stroke = 'none';
          let clipPath = 'inset(0% 0% 0% 0%)';

          // Offset shadow layer properties
          let shadowX = 0;
          let shadowY = 0;
          let shadowColor = '#ff2222';
          let shadowOpacity = 0;

          // Motion echo trail properties
          let echoOpacity = 0;
          let echoX = 0;
          let echoY = 0;

          // 1. OPENING REVEAL (0s - 3s)
          // Begins at 1.2s to 3.0s
          if (time < 3.0) {
            const startReveal = 1.2 + index * 0.16;
            const revealDur = 0.55;

            if (time < startReveal) {
              opacity = 0;
              translateY = 120;
              clipPath = 'inset(100% 0% 0% 0%)';
            } else if (time < startReveal + revealDur) {
              const p = (time - startReveal) / revealDur;
              const eased = easeOutBack(p, 1.9);
              opacity = clamp(p * 2.5, 0, 1);
              translateY = (1 - eased) * 120;
              clipPath = `inset(${Math.max(0, (1 - p) * 100)}% 0% 0% 0%)`;

              // Red flash during overshoot
              color = p < 0.5 ? '#ff2222' : '#f5f5f3';
              shadowOpacity = p * 0.9;
              shadowX = p * 6;
              shadowY = p * 6;
              shadowColor = '#ff2222';
            } else {
              opacity = 1;
              translateY = 0;
              color = '#f5f5f3';
              shadowOpacity = 0.9;
              shadowX = 6;
              shadowY = 6;
              shadowColor = '#ff2222';
            }
          }
          // 2. MAIN TYPOGRAPHY IMPACT (3s - 6s)
          else if (time >= 3.0 && time < 6.0) {
            opacity = 1;
            // Slam down at 3.0s with staggered letter bounce
            const slamTime = 3.0 + index * 0.07;
            if (time >= slamTime && time < slamTime + 0.6) {
              const p = (time - slamTime) / 0.6;
              const bounce = Math.sin(p * Math.PI * 2) * Math.exp(-p * 4);
              translateY = -bounce * 30;
              scaleX = 1 + bounce * 0.2;
              scaleY = 1 - bounce * 0.15;
              rotate = (index % 2 === 0 ? 1 : -1) * bounce * 4;

              // Echo trail during slam
              echoOpacity = (1 - p) * 0.7;
              echoX = (index % 2 === 0 ? -1 : 1) * (1 - p) * 16;
              echoY = (1 - p) * 12;

              // Hot red graphic burst
              color = p < 0.3 ? '#ff2222' : '#f5f5f3';
              shadowOpacity = 1;
              shadowX = 8 + (1 - p) * 8;
              shadowY = 8 + (1 - p) * 8;
            } else {
              translateY = 0;
              color = '#f5f5f3';
              shadowOpacity = 0.95;
              shadowX = 7;
              shadowY = 7;
            }

            // Staggered step movement at 4.6s - 5.5s
            if (time >= 4.6 && time < 5.5) {
              const shift = Math.sin((time - 4.6) * Math.PI) * (index % 2 === 0 ? -8 : 8);
              translateY += shift;
            }
          }
          // 3. GRAPHIC MOTION (6s - 10s)
          else if (time >= 6.0 && time < 10.0) {
            opacity = 1;
            // Graphic alternating slides: even letters slide down, odd slide up
            if (time < 7.5) {
              const p = (time - 6.0) / 1.5;
              const slideAmp = Math.sin(p * Math.PI) * 28;
              translateY = (index % 2 === 0 ? 1 : -1) * slideAmp;
              rotate = (index % 2 === 0 ? 1 : -1) * (slideAmp / 28) * 3;
              shadowX = 6 + (index % 2 === 0 ? 4 : -2);
              shadowY = 6;
              shadowOpacity = 0.9;
            }
            // Screen-print color-blocking & graphic outline inversion (7.5s - 8.8s)
            else if (time >= 7.5 && time < 8.8) {
              const isRedLetter = index === 0 || index === 3 || index === 7; // P, Y, T
              if (isRedLetter) {
                color = '#ff2222';
                stroke = '2px #f5f5f3';
                shadowColor = '#08080a';
                shadowX = -6;
                shadowY = 6;
                shadowOpacity = 1;
                scaleX = 1.08;
                scaleY = 1.08;
              } else {
                color = 'transparent';
                stroke = '2.5px #f5f5f3';
                shadowColor = '#ff2222';
                shadowX = 6;
                shadowY = 6;
                shadowOpacity = 0.8;
              }
            }
            // Graphic horizontal wipe slice (8.8s - 10.0s)
            else {
              const p = (time - 8.8) / 1.2;
              const slice = Math.sin(p * Math.PI) * 14;
              translateX = (index % 2 === 0 ? 1 : -1) * slice;
              color = '#f5f5f3';
              shadowX = 6;
              shadowY = 6;
              shadowOpacity = 0.9;
            }
          }
          // 4. KINETIC TYPOGRAPHY SEQUENCE (10s - 15s)
          else if (time >= 10.0 && time < 15.0) {
            opacity = 1;
            // Typographic wave equalizer (10s - 12.8s)
            if (time < 12.8) {
              const wavePhase = (time - 10.0) * 4.5 - index * 0.7;
              const wave = Math.sin(wavePhase);
              scaleY = 1 + wave * 0.26;
              translateY = -wave * 12;

              // Color sweep across the wave crest
              if (wave > 0.65) {
                color = '#ff2222';
                shadowColor = '#f5f5f3';
                shadowX = 8;
                shadowY = 8;
                shadowOpacity = 1;
              } else {
                color = '#f5f5f3';
                shadowColor = '#ff2222';
                shadowX = 6;
                shadowY = 6;
                shadowOpacity = 0.85;
              }
            }
            // Lateral compression & brutalist expansion (12.8s - 15.0s)
            else {
              const p = (time - 12.8) / 2.2;
              const spread = Math.sin(p * Math.PI) * 18;
              // Spread outward from center
              const centerDist = index - 3.5;
              translateX = centerDist * spread * 0.45;
              color = '#f5f5f3';
              shadowX = 7;
              shadowY = 7;
              shadowOpacity = 0.9;

              // Echo trail on fast expansion
              if (p > 0.3 && p < 0.7) {
                echoOpacity = 0.5;
                echoX = centerDist * -4;
                echoY = 4;
              }
            }
          }
          // 5. FINAL IMPACT (15s - 18s)
          else if (time >= 15.0 && time < 18.0) {
            opacity = 1;
            // High-frequency kinetic stutter & stroboscopic flashes
            const beat = (time - 15.0) * 7.5;
            const step = Math.floor(beat);
            const activeLetter = step % 8;

            if (activeLetter === index) {
              color = '#ff2222';
              scaleX = 1.14;
              scaleY = 1.14;
              translateY = -8;
              shadowX = 10;
              shadowY = 10;
              shadowColor = '#f5f5f3';
              shadowOpacity = 1;
              echoOpacity = 0.8;
              echoX = -6;
              echoY = -6;
            } else if ((activeLetter + 4) % 8 === index) {
              color = 'transparent';
              stroke = '3px #ff2222';
              shadowX = 6;
              shadowY = 6;
              shadowColor = '#08080a';
              shadowOpacity = 1;
            } else {
              color = '#f5f5f3';
              shadowX = 6;
              shadowY = 6;
              shadowColor = '#ff2222';
              shadowOpacity = 0.9;
            }

            // Composition-wide snap contraction at 17.5s - 18.0s
            if (time >= 17.5) {
              const p = (time - 17.5) / 0.5;
              const recoil = Math.sin(p * Math.PI) * -12;
              translateY += recoil;
              scaleY = 1 + Math.sin(p * Math.PI) * 0.15;
            }
          }
          // 6. SEAMLESS LOOP TRANSITION (18s - 20s)
          else {
            if (time < 19.1) {
              // Perfect majestic lockup
              opacity = 1;
              translateY = 0;
              translateX = 0;
              scaleX = 1.0;
              scaleY = 1.0;
              rotate = 0;
              color = '#f5f5f3';
              shadowX = 6;
              shadowY = 6;
              shadowColor = '#ff2222';
              shadowOpacity = 0.9;
              clipPath = 'inset(0% 0% 0% 0%)';
            } else {
              // Easing out continuously to match t=0.0s (opacity=0, translateY=120)
              const p = (time - 19.1) / 0.9;
              const eased = easeInOutCubic(p);
              opacity = 1 - eased;
              translateY = eased * 120;
              clipPath = `inset(${eased * 100}% 0% 0% 0%)`;
              shadowOpacity = (1 - eased) * 0.9;
              color = '#f5f5f3';
            }
          }

          return (
            <div
              key={`playlist-char-${index}`}
              className="relative inline-block overflow-visible will-change-transform"
              style={{
                clipPath,
              }}
            >
              {/* Motion Echo Trail Layer */}
              {echoOpacity > 0.05 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none select-none"
                  style={{
                    opacity: echoOpacity,
                    transform: `translate(${translateX + echoX}px, ${translateY + echoY}%) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
                    color: 'transparent',
                    WebkitTextStroke: '2px #ff2222',
                  }}
                >
                  {char}
                </span>
              )}

              {/* Offset Screen-Print Shadow Layer */}
              {shadowOpacity > 0.05 && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none select-none"
                  style={{
                    opacity: shadowOpacity,
                    transform: `translate(${translateX + shadowX}px, calc(${translateY}% + ${shadowY}px)) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
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
                  transform: `translate(${translateX}px, ${translateY}%) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
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
