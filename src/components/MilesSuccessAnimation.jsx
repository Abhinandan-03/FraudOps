import React, { useState, useEffect, useRef } from 'react';
import { playMilesSuccessMusic } from '../utils/audio';
import milesImage from '../assets/miles-hanging.png';

/**
 * MilesSuccessAnimation Component
 * 
 * An overlay animation triggered on correct operative decisions.
 * Features:
 * - Starts /public/audio/miles-success.mp3 (continues playing after animation)
 * - Upside-down hanging Miles Morales swinging into frame on a web line
 * - Cyber-Verse comic punch score badge (+100 POINTS, CORRECT DECISION)
 * - Smooth exit animation and clean unmount
 * - Concurrency guard & reduced motion support
 */
export default function MilesSuccessAnimation({
  isActive = false,
  onComplete = () => {},
  points = 100,
  title = "CORRECT DECISION",
  subtitle = "THREAT NEUTRALIZED",
  duration = 2200 // Total ms
}) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'enter' | 'swing' | 'exit'
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (isActive && !isRunningRef.current) {
      isRunningRef.current = true;
      setPhase('enter');

      // Play Miles theme (continues playing after animation finishes)
      playMilesSuccessMusic();

      // Transition from drop/swing to idle-bob
      const swingTimer = setTimeout(() => {
        setPhase('swing');
      }, 400);

      // Start exit zip-up
      const exitTimer = setTimeout(() => {
        setPhase('exit');
      }, duration - 500);

      // Complete and reset overlay (music continues playing)
      const completeTimer = setTimeout(() => {
        setPhase('idle');
        isRunningRef.current = false;
        onComplete();
      }, duration);

      return () => {
        clearTimeout(swingTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, duration, onComplete]);

  if (phase === 'idle') return null;

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-live="assertive"
      role="alert"
    >
      {/* Background Focus Dim */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 65% 50%, rgba(226, 27, 35, 0.15) 0%, rgba(10, 10, 12, 0.6) 100%)'
        }}
      />

      {/* Comic Action Speed Lines & Halftone Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(#E21B23_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl h-full flex items-center justify-between px-12 md:px-24">
        
        {/* Left/Center: Score Badge and Notification */}
        <div className={`flex flex-col items-start z-10 max-w-lg transition-all duration-500 transform ${
          phase === 'enter' 
            ? 'opacity-0 translate-x-[-40px] scale-90' 
            : phase === 'exit'
              ? 'opacity-0 translate-y-[-30px] scale-95'
              : 'opacity-100 translate-x-0 scale-100'
        }`}>
          {/* Streak / Points Banner */}
          <div className="relative mb-3">
            <div className="bg-primary text-white font-headline font-black italic text-4xl md:text-5xl px-6 py-2 shadow-[0_0_35px_rgba(226,27,35,0.8)] border-2 border-white/40 transform -rotate-3 skew-container flex items-center gap-3">
              <span className="unskew-content flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl font-bold animate-bounce">bolt</span>
                +{points} POINTS
              </span>
            </div>
            {/* Comic Glitch Shadow Box */}
            <div className="absolute -inset-1 bg-secondary/60 -z-10 transform rotate-2 blur-[2px]" />
          </div>

          {/* Title Header */}
          <div className="bg-surface/95 border-l-4 border-l-primary border border-border p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="font-mono text-[10px] text-tertiary tracking-[0.25em] uppercase font-bold mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
              {subtitle}
            </div>
            <h2 className="font-headline font-black italic text-3xl md:text-4xl text-white uppercase tracking-tighter text-glitch">
              {title}
            </h2>
            <div className="mt-3 flex items-center gap-4 text-xs font-mono text-on-surface-muted border-t border-border/60 pt-3">
              <span className="text-white font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified</span> STREAK ADVANCED
              </span>
              <span className="text-secondary font-bold">ICE PROTOCOL INTACT</span>
            </div>
          </div>
        </div>

        {/* Right Area: Upside-Down Hanging Miles Morales */}
        <div className="relative w-1/2 h-full flex justify-center items-start">
          <div 
            className={`absolute top-0 flex flex-col items-center will-change-transform ${
              phase === 'enter' 
                ? 'miles-hanging-enter' 
                : phase === 'exit' 
                  ? 'miles-hanging-exit' 
                  : 'miles-hanging-swing'
            }`}
            style={{
              transformOrigin: 'top center',
            }}
          >
            {/* Luminous Web Line from Screen Ceiling to Feet */}
            <div 
              className="w-[2px] bg-gradient-to-b from-white/90 via-red-200 to-white shadow-[0_0_8px_rgba(255,255,255,0.9),0_0_15px_rgba(226,27,35,0.6)]"
              style={{
                height: '140px',
              }}
            />

            {/* Miles Morales upside-down character image */}
            <div className="relative -mt-2">
              {/* Subtle Red/Teal dimensional aura behind Miles */}
              <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full scale-110 pointer-events-none" />
              <div className="absolute -inset-2 bg-secondary/15 blur-[25px] rounded-full scale-95 pointer-events-none" />

              <img 
                src={milesImage} 
                alt="Miles Morales hanging upside down" 
                className="w-64 md:w-80 lg:w-96 max-h-[60vh] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] select-none"
                draggable={false}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
