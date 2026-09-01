import React, { useState, useEffect, useRef, useMemo } from 'react';
import { playProwlerFailureMusic } from '../utils/audio';
import { useTheme, THEME_STATES } from '../contexts/ThemeContext';
import spiderImage from '../assets/spider-hanging.png';

/**
 * SpiderSwarmFailureAnimation Component
 * 
 * Cinematic failure overlay triggered on incorrect operative decisions.
 * Features:
 * - Screen darkens with Prowler purple glitch aura
 * - Initial hanging spider drops from top center
 * - Rapid swarm of spiders crawls and scatters across the screen
 * - Swarm reaches peak, followed by INCORRECT DECISION & -150 POINTS
 * - Starts /public/audio/black_suit_theme.mp3 (continues playing after animation)
 * - Transitions to PROWLER_FAILURE theme state and cleans up seamlessly
 */
export default function SpiderSwarmFailureAnimation({
  isActive = false,
  onComplete = () => {},
  points = -150,
  title = "INCORRECT DECISION",
  duration = 3500
}) {
  const [stage, setStage] = useState('idle'); // 'idle' | 'spider-drop' | 'swarming' | 'peak' | 'exit'
  const isRunningRef = useRef(false);
  const { setAppState } = useTheme();

  // Pre-generate deterministic swarm spider configurations for high performance & visual balance
  const swarmSpiders = useMemo(() => {
    const list = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      // Deterministic spawn origins around viewport perimeter
      const side = i % 4; // 0: top, 1: right, 2: bottom, 3: left
      let startX = '0vw', startY = '0vh', endX = '0vw', endY = '0vh', rot = 0;

      const rnd1 = ((i * 37) % 80) + 10;
      const rnd2 = ((i * 53) % 70) + 15;

      if (side === 0) { // Top
        startX = `${rnd1}vw`;
        startY = '-20vh';
        endX = `${rnd1 + ((i % 2 === 0 ? 1 : -1) * 15)}vw`;
        endY = `${rnd2}vh`;
        rot = 180 + ((i % 5) - 2) * 20;
      } else if (side === 1) { // Right
        startX = '115vw';
        startY = `${rnd1}vh`;
        endX = `${rnd2}vw`;
        endY = `${rnd1 + ((i % 2 === 0 ? 1 : -1) * 15)}vh`;
        rot = -90 + ((i % 5) - 2) * 20;
      } else if (side === 2) { // Bottom
        startX = `${rnd1}vw`;
        startY = '115vh';
        endX = `${rnd1 + ((i % 2 === 0 ? 1 : -1) * 15)}vw`;
        endY = `${100 - rnd2}vh`;
        rot = 0 + ((i % 5) - 2) * 20;
      } else { // Left
        startX = '-20vw';
        startY = `${rnd1}vh`;
        endX = `${rnd2}vw`;
        endY = `${rnd1 + ((i % 2 === 0 ? 1 : -1) * 15)}vh`;
        rot = 90 + ((i % 5) - 2) * 20;
      }

      const size = 38 + ((i * 19) % 90); // 38px to 128px
      const delay = 0.25 + ((i * 41) % 95) / 100; // 0.25s to 1.2s
      const animDur = 0.7 + ((i * 29) % 60) / 100; // 0.7s to 1.3s

      list.push({
        id: i,
        startX,
        startY,
        endX,
        endY,
        rot,
        size,
        delay,
        animDur,
        hasWeb: side === 0 && i % 3 === 0
      });
    }
    return list;
  }, []);

  useEffect(() => {
    if (isActive && !isRunningRef.current) {
      isRunningRef.current = true;
      setStage('spider-drop');

      // 1. Play Prowler failure music (/public/audio/black_suit_theme.mp3)
      playProwlerFailureMusic();

      // 2. Swarm multiplies
      const swarmTimer = setTimeout(() => {
        setStage('swarming');
      }, 400);

      // 3. Swarm reaches peak -> Display INCORRECT DECISION & enter PROWLER_FAILURE
      const peakTimer = setTimeout(() => {
        setStage('peak');
        setAppState(THEME_STATES.PROWLER_FAILURE);
      }, 1250);

      // 4. Start exit / dispersal
      const exitTimer = setTimeout(() => {
        setStage('exit');
      }, duration - 550);

      // 5. Complete overlay (music continues playing until NEXT CASE)
      const completeTimer = setTimeout(() => {
        setStage('idle');
        isRunningRef.current = false;
        onComplete();
      }, duration);

      return () => {
        clearTimeout(swarmTimer);
        clearTimeout(peakTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, duration, setAppState, onComplete]);

  if (stage === 'idle') return null;

  const showMessage = stage === 'peak' || stage === 'exit';

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${
        stage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-live="assertive"
      role="alert"
    >
      {/* Darkening & Prowler Glitch Screen Overlay */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-[3px] transition-all duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(161, 0, 255, 0.25) 0%, rgba(10, 10, 12, 0.85) 100%)'
        }}
      />

      {/* Menacing Glitch Scanning Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(161,0,255,0.06)_1px,transparent_1px)] bg-[size:100%_4px] opacity-70 pointer-events-none" />

      {/* 1. Initial Primary Hanging Spider from Top Center */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center will-change-transform z-20 ${
          stage === 'spider-drop' ? 'spider-primary-drop' : 'spider-twitch'
        }`}
      >
        {/* Silk thread */}
        <div className="w-[1.5px] h-[180px] md:h-[230px] bg-gradient-to-b from-white/80 via-white/50 to-transparent shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        
        {/* Hanging spider image */}
        <div className="relative -mt-4">
          <div className="absolute inset-0 bg-secondary/30 blur-[20px] rounded-full scale-125 pointer-events-none" />
          <img 
            src={spiderImage} 
            alt="Prowler spider hanging" 
            className="w-24 md:w-32 lg:w-40 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* 2. Large Spider Swarm Spreading Across Screen */}
      {(stage === 'swarming' || stage === 'peak' || stage === 'exit') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
          {swarmSpiders.map((spider) => (
            <div
              key={spider.id}
              className="absolute spider-scurry-item flex flex-col items-center will-change-transform"
              style={{
                top: 0,
                left: 0,
                '--start-x': spider.startX,
                '--start-y': spider.startY,
                '--end-x': spider.endX,
                '--end-y': spider.endY,
                '--rot': `${spider.rot}deg`,
                '--scale': spider.size / 100,
                '--anim-dur': `${spider.animDur}s`,
                '--anim-delay': `${spider.delay}s`,
              }}
            >
              {/* Optional Web Strand for spiders coming from ceiling */}
              {spider.hasWeb && (
                <div 
                  className="w-[1px] bg-white/40 shadow-[0_0_4px_rgba(255,255,255,0.6)]"
                  style={{ height: `${spider.size * 1.5}px` }}
                />
              )}
              
              <img 
                src={spiderImage}
                alt="Swarm Spider"
                style={{ width: `${spider.size}px` }}
                className="object-contain drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. INCORRECT DECISION & Penalty Pop-up (Appears After Swarm Peak) */}
      {showMessage && (
        <div className="relative z-30 flex flex-col items-center max-w-xl mx-auto px-6 text-center animate-[scaleIn_0.35s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
          
          {/* Analysis Warning Tag */}
          <div className="border border-secondary bg-secondary/20 text-secondary px-4 py-1.5 flex items-center gap-2 mb-4 shadow-[0_0_20px_rgba(161,0,255,0.4)]">
            <span className="material-symbols-outlined text-base">warning</span>
            <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold">SYSTEM BREACH DETECTED</span>
          </div>

          {/* Glitching Title Header */}
          <h2 
            className="font-headline font-black italic text-5xl md:text-7xl text-secondary leading-[0.9] tracking-tighter uppercase mb-6 text-glitch"
            style={{
              textShadow: '0 0 30px rgba(161, 0, 255, 0.8), -3px 0 #E21B23, 3px 0 #00F5FF'
            }}
          >
            {title}
          </h2>

          {/* Points & Streak Reset Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-primary/25 border-2 border-primary text-primary font-headline font-black text-3xl italic px-8 py-3 shadow-[0_0_25px_rgba(226,27,35,0.5)] transform -rotate-2">
              {points} POINTS
            </div>
            
            <div className="bg-surface-dim border border-border px-6 py-3 font-mono text-xs tracking-widest uppercase font-bold text-on-surface-muted flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">restart_alt</span>
              STREAK RESET
            </div>
          </div>

          <div className="mt-4 font-mono text-[10px] text-on-surface-muted tracking-widest uppercase">
            CORRECTIVE ACTION REQUIRED // RE-CALIBRATING ICE PROTOCOLS
          </div>
        </div>
      )}

    </div>
  );
}
