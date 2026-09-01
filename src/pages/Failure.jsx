import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Failure() {
  const { handleNextCase } = useTheme();

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center relative overflow-hidden p-6">
      
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      
      <div className="bg-surface-dim border border-secondary shadow-[0_0_50px_rgba(161,0,255,0.15)] max-w-2xl w-full p-12 flex flex-col items-center relative z-10">
        
        {/* Top Badge */}
        <div className="border border-secondary px-4 py-1 flex items-center gap-2 mb-10 text-secondary">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">ANALYSIS COMPLETE</span>
        </div>

        {/* Header Text */}
        <h1 className="font-headline font-black italic text-6xl md:text-7xl text-secondary leading-[0.9] text-center tracking-tighter uppercase mb-8 text-glitch"
            style={{textShadow: "0 0 20px rgba(161,0,255,0.6)"}}>
          <span className="block">INCORRECT</span>
          <span className="block">DECISION</span>
        </h1>

        {/* Penalty Badges */}
        <div className="flex gap-4 mb-12">
          <div className="bg-primary/20 border border-primary text-primary font-headline font-black text-2xl italic px-6 py-2">
            -150 POINTS
          </div>
          <div className="border border-border bg-surface px-6 py-2 font-mono text-[10px] tracking-widest uppercase font-bold text-on-surface-muted flex items-center">
            STREAK RESET
          </div>
        </div>

        {/* Consequence Block */}
        <div className="w-full border-l-2 border-primary/50 bg-background/50 p-6 mb-8 relative">
          <span className="material-symbols-outlined absolute top-6 right-6 text-border text-4xl">policy</span>
          
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase font-bold text-primary/80 mb-2">
            <span className="material-symbols-outlined text-[14px]">error</span> CONSEQUENCE
          </div>
          <p className="text-white text-sm font-medium">Legitimate customer blocked unnecessarily.</p>
        </div>

        {/* Debrief Block */}
        <div className="w-full border-l-2 border-secondary/50 bg-background/50 p-6 mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-secondary/80 mb-6">
            POST-ACTION DEBRIEF
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">check_circle</span>
              <p className="text-sm text-on-surface-muted leading-relaxed">Device velocity was high, but mapped to a known corporate VPN node (IP: 192.168.*.*).</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">check_circle</span>
              <p className="text-sm text-on-surface-muted leading-relaxed">Behavioral biometrics indicated standard user hesitation, not automated scripting.</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">check_circle</span>
              <p className="text-sm text-on-surface-muted leading-relaxed">Historical transaction baseline aligns with this anomaly pattern during Q3 closing periods.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link to="/leaderboard" onClick={handleNextCase}>
          <button className="border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors font-mono font-bold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-4">
            [ NEXT EVENT ] <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </Link>

      </div>
    </div>
  );
}
