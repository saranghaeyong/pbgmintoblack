import { useState, useEffect, useRef } from 'react';

export interface TimelineState {
  time: number; // 0.00 to 20.00 seconds
  progress: number; // 0.00 to 1.00
  reducedMotion: boolean;
}

export const CYCLE_DURATION = 20.0; // 20.0 seconds loop

// Easing utilities
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - clamp(x, 0, 1), 3);
}

export function easeInOutCubic(x: number): number {
  const t = clamp(x, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(x: number, c1 = 1.70158): number {
  const t = clamp(x, 0, 1);
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function easeOutElastic(x: number): number {
  const t = clamp(x, 0, 1);
  if (t === 0) return 0;
  if (t === 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function useKineticTimeline(): TimelineState {
  const [state, setState] = useState<TimelineState>(() => ({
    time: 0,
    progress: 0,
    reducedMotion: false,
  }));

  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState((prev) => ({ ...prev, reducedMotion: e.matches }));
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    const isReduced = mediaQuery.matches;

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsed = (now - startTimeRef.current) / 1000;
      const timeInCycle = elapsed % CYCLE_DURATION;
      const progressInCycle = timeInCycle / CYCLE_DURATION;

      setState({
        time: timeInCycle,
        progress: progressInCycle,
        reducedMotion: isReduced,
      });

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return state;
}
