import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function Success() {
  const navigate = useNavigate();
  const { lastResult, sessionState, advanceToNextCase, isLoadingCase } = useGame();

  const points = lastResult?.points ?? 100;
  const streak = lastResult?.streak ?? sessionState.streak;
  const action = lastResult?.action ?? 'FREEZE';
  const responseTime = lastResult?.responseTime ?? 1.2;
  const outcome = lastResult?.outcome ?? 'Fraud Halted';
  const consequence = lastResult?.consequence ?? 'Immediate halt on account activity neutralized active threat.';

  const handleNextEvent = async () => {
    await advanceToNextCase();
    navigate('/investigation');
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex items-center justify-center relative overflow-hidden p-6">
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <div className="w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        
        {/* Header Text & Badge */}
        <div className="relative mb-10 text-center">
          <h1 className="font-headline font-black italic text-6xl md:text-8xl text-transparent leading-[0.9] text-center tracking-tighter uppercase"
              style={{
                WebkitTextStroke: "2px #E21B23",
                textShadow: "0 0 40px rgba(226,27,35,0.8), 0 0 10px rgba(226,27,35,0.5)"
              }}>
            <span className="block">CORRECT</span>
            <span className="block">DECISION</span>
          </h1>
          
          <div className="absolute -top-4 -right-6 md:-right-12 transform rotate-12 bg-primary text-white font-headline font-black italic text-2xl md:text-3xl px-4 py-1 shadow-[0_10px_20px_rgba(226,27,35,0.5)] border-2 border-white/20 z-20">
            +{points} POINTS
          </div>
        </div>

        {/* Streak Badge */}
        <div className="bg-surface-dim border-l-4 border-l-primary px-6 py-2 flex items-center gap-2 mb-8 shadow-[0_0_15px_rgba(226,27,35,0.2)]">
          <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
          <span className="font-headline font-black italic text-xl tracking-wider text-white">STREAK X{streak}</span>
        </div>

        {/* Consequence / Backend Result Note */}
        <div className="w-full bg-surface-dim border border-border p-4 mb-8 text-center font-mono text-xs text-white/90">
          <span className="text-tertiary font-bold mr-2">[BACKEND CONFIRMED]</span>
          {consequence}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-12 w-full">
          <div className="bg-surface border border-border p-4 md:p-6 flex flex-col items-center justify-center min-h-[110px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">DECISION</span>
            <span className="font-headline font-black text-xl md:text-2xl text-tertiary">{action}</span>
          </div>
          
          <div className="bg-surface border border-border p-4 md:p-6 flex flex-col items-center justify-center min-h-[110px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">RESPONSE TIME</span>
            <span className="font-headline font-black text-2xl md:text-3xl text-white">{responseTime}<span className="text-xl">s</span></span>
          </div>
          
          <div className="bg-surface border border-border p-4 md:p-6 flex flex-col items-center justify-center min-h-[110px]">
            <span className="font-mono text-[8px] text-on-surface-muted uppercase font-bold tracking-widest mb-2">OUTCOME</span>
            <span className="font-headline font-bold text-lg md:text-xl text-primary leading-tight text-center">{outcome}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNextEvent}
          disabled={isLoadingCase}
          className="bg-primary text-white font-headline font-bold text-xl md:text-2xl tracking-wider px-10 py-4 flex items-center gap-4 hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(226,27,35,0.4)] disabled:opacity-50"
        >
          [ NEXT EVENT ] <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
        
      </div>
    </div>
  );
}
