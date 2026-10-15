/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useKineticTimeline } from './hooks/useKineticTimeline.ts';
import { BackgroundElements } from './components/BackgroundElements.tsx';
import { SarangRn } from './components/SarangRn.tsx';
import { Playlist } from './components/Playlist.tsx';
import { Bgm } from './components/Bgm.tsx';

export default function App() {
  const { time, reducedMotion } = useKineticTimeline();

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-[#070709] flex flex-col items-center justify-center select-none"
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      {/* Streetwear graphic texture and screen-print registration elements */}
      <BackgroundElements time={time} reducedMotion={reducedMotion} />

      {/* Central Kinetic Typography Poster Composition */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center">
        {/* Top: Identity Line */}
        <SarangRn time={time} reducedMotion={reducedMotion} />

        {/* Center: Dominating Word */}
        <Playlist time={time} reducedMotion={reducedMotion} />

        {/* Bottom: Anchor Word */}
        <Bgm time={time} reducedMotion={reducedMotion} />
      </div>
    </main>
  );
}
