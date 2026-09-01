import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useGame } from '../contexts/GameContext';

export default function PerformanceReport() {
  const navigate = useNavigate();
  const { sessionState, startNewSession, completeSession } = useGame();
  
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      completeSession();
    }
  }, [completeSession]);

  const finalScore = Number(sessionState.score || 8420).toLocaleString('en-US');
  const detectionAcc = sessionState.detectionAccuracy || 92;
  const fpRate = sessionState.falsePositiveRate || 4;
  const avgResponse = sessionState.avgResponseTime || 1.4;
  const fraudPreventedK = sessionState.fraudPrevented 
    ? (sessionState.fraudPrevented / 1000).toFixed(1)
    : '12.4';

  const handlePlayAgain = async () => {
    await startNewSession({ difficulty: 'ELITE' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center relative overflow-hidden p-6">
      
      {/* Outer Border Glow */}
      <div className="absolute inset-4 border-2 border-secondary/50 rounded-sm pointer-events-none z-20 shadow-[0_0_50px_rgba(161,0,255,0.2)_inset,0_0_50px_rgba(161,0,255,0.2)] mix-blend-screen"></div>

      {/* Main Card */}
      <div className="bg-surface-dim max-w-4xl w-full p-8 md:p-12 relative z-10 border border-border/50 shadow-2xl flex flex-col">
        
        {/* Top Terminal Badge */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3 text-tertiary font-mono text-[10px] tracking-[0.2em] uppercase font-bold bg-tertiary/10 px-4 py-2 border-l-2 border-tertiary">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            SESSION TERMINATED // INTEL COMPILED
          </div>
          {/* Cyber bars decoration */}
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-tertiary"></div>
            <div className="w-1.5 h-4 bg-tertiary/70"></div>
            <div className="w-1.5 h-4 bg-tertiary/30"></div>
          </div>
        </div>

        {/* Score Header */}
        <div className="mb-12 relative">
          <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-2 font-bold">GLOBAL RANK ASSESSMENT</div>
          <h1 className="font-headline font-black italic text-6xl text-white uppercase tracking-tighter mb-0" 
              style={{textShadow: "-3px 0 #00F5FF, 3px 0 #E21B23"}}>
            FINAL SCORE
          </h1>
          <div className="flex items-end gap-6">
            <span className="font-headline font-black text-7xl md:text-8xl text-white leading-none tracking-tighter" style={{textShadow: "0 10px 30px rgba(0,0,0,0.5)"}}>
              {finalScore}
            </span>
            <span className="bg-[#008055] text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-2 border border-[#00B075]">
              TOP 2%
            </span>
          </div>
        </div>

        {/* 4 Stats Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface border border-border p-6 flex flex-col items-start hover:border-tertiary transition-colors">
            <span className="material-symbols-outlined text-tertiary text-lg mb-4">track_changes</span>
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-1">DETECTION ACC</span>
            <div className="font-headline font-black text-3xl md:text-4xl text-white">{detectionAcc}<span className="text-tertiary text-2xl">%</span></div>
          </div>
          
          <div className="bg-surface border border-border p-6 flex flex-col items-start hover:border-secondary transition-colors">
            <span className="material-symbols-outlined text-secondary text-lg mb-4">filter_alt</span>
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-1">FP RATE</span>
            <div className="font-headline font-black text-3xl md:text-4xl text-white">{fpRate}<span className="text-secondary text-2xl">%</span></div>
          </div>

          <div className="bg-surface border border-border p-6 flex flex-col items-start hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-primary text-lg mb-4">timer</span>
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-1">AVG RESPONSE</span>
            <div className="font-headline font-black text-3xl md:text-4xl text-white">{avgResponse}<span className="text-on-surface-muted text-2xl">s</span></div>
          </div>

          <div className="bg-surface border border-border p-6 flex flex-col items-start hover:border-[#00F5FF] transition-colors">
            <span className="material-symbols-outlined text-[#00F5FF] text-lg mb-4">account_balance_wallet</span>
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-1">FRAUD PREVENTED</span>
            <div className="font-headline font-black text-3xl md:text-4xl text-white"><span className="text-[#00F5FF] text-2xl">$</span>{fraudPreventedK}<span className="text-[#00F5FF] text-2xl">k</span></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Radar Chart Placeholder */}
          <div className="bg-surface border border-border flex items-center justify-center p-8 min-h-[300px] relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Grid Hexagons */}
              <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#27272A" strokeWidth="1"/>
              <polygon points="100,40 152,70 152,130 100,160 48,130 48,70" fill="none" stroke="#27272A" strokeWidth="1"/>
              <polygon points="100,60 135,80 135,120 100,140 65,120 65,80" fill="none" stroke="#27272A" strokeWidth="1"/>
              {/* Axes */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="#27272A" strokeWidth="1"/>
              <line x1="30" y1="60" x2="170" y2="140" stroke="#27272A" strokeWidth="1"/>
              <line x1="30" y1="140" x2="170" y2="60" stroke="#27272A" strokeWidth="1"/>
              {/* Data Polygon */}
              <polygon points="100,40 160,80 140,150 100,140 60,130 50,70" fill="rgba(0,245,255,0.15)" stroke="#00F5FF" strokeWidth="2"/>
              {/* Data Points */}
              <circle cx="100" cy="40" r="4" fill="#00F5FF"/>
              <circle cx="160" cy="80" r="4" fill="#00F5FF"/>
              <circle cx="140" cy="150" r="4" fill="#00F5FF"/>
              <circle cx="100" cy="140" r="4" fill="#00F5FF"/>
              <circle cx="60" cy="130" r="4" fill="#00F5FF"/>
              <circle cx="50" cy="70" r="4" fill="#00F5FF"/>
            </svg>
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-on-surface-muted">SPEED</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-on-surface-muted">FREEZE</div>
            <div className="absolute top-1/4 right-4 text-[8px] font-mono text-on-surface-muted">ACC</div>
            <div className="absolute bottom-1/4 right-4 text-[8px] font-mono text-on-surface-muted">VO</div>
            <div className="absolute bottom-1/4 left-4 text-[8px] font-mono text-on-surface-muted">TN</div>
            <div className="absolute top-1/4 left-4 text-[8px] font-mono text-on-surface-muted">CV</div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="flex flex-col gap-4">
            
            <div className="flex-1 bg-surface border border-border border-l-4 border-l-tertiary p-6">
              <div className="flex items-center gap-2 text-tertiary font-mono text-[10px] tracking-widest uppercase font-bold mb-6">
                <span className="material-symbols-outlined text-sm">thumb_up</span> TACTICAL STRENGTHS
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">check_circle</span>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">Graph Analysis</div>
                    <div className="text-on-surface-muted text-[10px] font-mono">Exceptional pattern recognition in multi-node transactions.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">check_circle</span>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">Rapid Triage</div>
                    <div className="text-on-surface-muted text-[10px] font-mono">Decision latency is 40% below global operator average.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-surface border border-border border-l-4 border-l-primary p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRTIxQjIzIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_left,black,transparent)] pointer-events-none"></div>
              
              <div className="flex items-center gap-2 text-primary font-mono text-[10px] tracking-widest uppercase font-bold mb-6 relative z-10">
                <span className="material-symbols-outlined text-sm">warning</span> AREAS TO IMPROVE
              </div>
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">radio_button_unchecked</span>
                  <div>
                    <div className="text-white font-bold text-sm mb-1">Overuse of Freeze</div>
                    <div className="text-on-surface-muted text-[10px] font-mono">High reliance on total account lock. Consider soft-flags for minor anomalies.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-6">
          <Link to="/leaderboard">
            <button className="border border-secondary text-secondary hover:bg-secondary/10 transition-colors font-mono font-bold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">leaderboard</span>
              VIEW LEADERBOARD
            </button>
          </Link>
          
          <button 
            onClick={handlePlayAgain}
            className="bg-primary text-white hover:bg-primary/90 transition-colors font-headline font-bold text-lg uppercase tracking-wider px-10 py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(226,27,35,0.4)] cursor-pointer"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            PLAY AGAIN
          </button>
        </div>

      </div>
    </div>
  );
}
