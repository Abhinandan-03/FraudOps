import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Success() {
  const { handleNextCase } = useTheme();

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <div className="w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Header Text & Badge */}
        <div className="relative mb-12">
          <h1 className="font-headline font-black italic text-6xl md:text-8xl text-transparent leading-[0.9] text-center tracking-tighter uppercase"
              style={{
                WebkitTextStroke: "2px #E21B23",
                textShadow: "0 0 40px rgba(226,27,35,0.8), 0 0 10px rgba(226,27,35,0.5)"
              }}>
            <span className="block">CORRECT</span>
            <span className="block">DECISION</span>
          </h1>
          
          <div className="absolute -top-4 -right-12 transform rotate-12 bg-primary text-white font-headline font-black italic text-3xl px-4 py-1 shadow-[0_10px_20px_rgba(226,27,35,0.5)] border-2 border-white/20 z-20">
            +100 POINTS
          </div>
        </div>

        {/* Streak Badge */}
        <div className="bg-surface-dim border-l-4 border-l-primary px-6 py-2 flex items-center gap-2 mb-12 shadow-[0_0_15px_rgba(226,27,35,0.2)]">
          <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
          <span className="font-headline font-black italic text-xl tracking-wider text-white">STREAK X4</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-surface border border-border p-6 flex flex-col items-center justify-center w-[160px] h-[120px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">DECISION</span>
            <span className="font-headline font-black text-2xl text-tertiary">FREEZE</span>
          </div>
          
          <div className="bg-surface border border-border p-6 flex flex-col items-center justify-center w-[160px] h-[120px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">RESPONSE TIME</span>
            <span className="font-headline font-black text-3xl text-white">1.2<span className="text-xl">s</span></span>
          </div>
          
          <div className="bg-surface border border-border p-6 flex flex-col items-center justify-center w-[160px] h-[120px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">OUTCOME</span>
            <span className="font-headline font-bold text-xl text-primary leading-tight text-center">Fraud<br/>Halted</span>
          </div>
        </div>

        {/* Action Button */}
        <Link to="/leaderboard" onClick={handleNextCase}>
          <button className="bg-primary text-white font-headline font-bold text-2xl tracking-wider px-12 py-4 flex items-center gap-4 hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(226,27,35,0.4)]">
            [ NEXT EVENT ] <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </Link>
        
      </div>
    </div>
  );
}
