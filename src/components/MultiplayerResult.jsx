import { useEffect, useState } from 'react';
import MilesSuccessAnimation from './MilesSuccessAnimation';
import SpiderSwarmFailureAnimation from './SpiderSwarmFailureAnimation';
import { playMilesSuccessMusic, playProwlerFailureMusic } from '../utils/audio';
import { useSettings } from '../contexts/SettingsContext';

export default function MultiplayerResult({ mp, playerId }) {
  const { caseResult, nextCase, roomState } = mp;
  const isHost = roomState?.host_id === playerId;
  const me = caseResult?.players?.find(p => p.id === playerId);
  const isCorrect = me?.correct;
  
  const { settings } = useSettings();
  const allowAnimations = settings.animationsEnabled;
  const allowSound = settings.soundEnabled;

  useEffect(() => {
    if (allowSound) {
      if (isCorrect) {
        playMilesSuccessMusic();
      } else {
        playProwlerFailureMusic();
      }
    }
  }, [isCorrect, allowSound]);

  return (
    <div className="relative min-h-screen bg-background text-on-surface overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Animation based on local player's correctness */}
      {allowAnimations && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {isCorrect ? <MilesSuccessAnimation /> : <SpiderSwarmFailureAnimation />}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl p-6 flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest mb-4">
            {isCorrect ? (
              <span className="bg-primary/20 text-primary px-3 py-1 border border-primary/50">VALID DECISION</span>
            ) : (
              <span className="bg-secondary/20 text-secondary px-3 py-1 border border-secondary/50">CRITICAL ERROR</span>
            )}
          </div>
          <h1 className={`font-headline font-black italic text-5xl md:text-7xl uppercase tracking-tighter text-glitch ${
            isCorrect ? 'text-white drop-shadow-[0_0_20px_rgba(226,27,35,0.6)]' : 'text-white drop-shadow-[0_0_20px_rgba(161,0,255,0.6)]'
          }`}>
            CASE RESOLVED
          </h1>
          <div className="mt-4 font-mono uppercase tracking-widest text-sm text-on-surface-muted">
            TARGET ACTION: <span className="text-white font-bold">{caseResult?.ground_truth_action}</span>
          </div>
        </div>

        {/* Squad Results Grid */}
        <div className="bg-surface/80 backdrop-blur-md border border-border p-6 shadow-2xl mt-8">
          <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-6 border-b border-border pb-2">
            SQUAD PERFORMANCE LOG
          </div>
          
          <div className="flex flex-col gap-3">
            {caseResult?.players?.map(p => (
              <div key={p.id} className={`flex flex-col md:flex-row items-center justify-between p-4 border ${
                p.id === playerId ? 'bg-white/5 border-white/20' : 'bg-surface-dim border-border'
              }`}>
                <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
                  <div className={`w-3 h-3 rounded-sm ${p.correct ? 'bg-primary' : 'bg-secondary'}`}></div>
                  <span className="font-mono font-bold uppercase text-sm">{p.name} {p.id === playerId ? '(YOU)' : ''}</span>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end font-mono uppercase text-[10px]">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-on-surface-muted tracking-widest">ACTION</span>
                    <span className={p.correct ? 'text-primary font-bold' : 'text-secondary font-bold'}>
                      {p.action} {p.correct ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-on-surface-muted tracking-widest">TIME</span>
                    <span className="text-white">{(p.response_time || 0).toFixed(2)}s</span>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-on-surface-muted tracking-widest">SCORE</span>
                    <span className="text-white font-bold">{p.score} <span className={`text-[9px] ${p.points_earned > 0 ? 'text-primary' : 'text-secondary'}`}>
                      ({p.points_earned > 0 ? '+' : ''}{p.points_earned})
                    </span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center mt-8">
          {isHost ? (
            <button 
              onClick={nextCase}
              className="px-12 py-5 bg-primary text-white font-headline font-bold italic text-xl uppercase tracking-tighter skew-container hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(226,27,35,0.4)]"
            >
              <span className="unskew-content block">INITIATE NEXT CASE</span>
            </button>
          ) : (
            <div className="px-12 py-5 bg-surface-dim border border-border text-on-surface-muted font-headline font-bold italic text-xl uppercase tracking-tighter skew-container">
              <span className="unskew-content block animate-pulse">WAITING FOR HOST...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
