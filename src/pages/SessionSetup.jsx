import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useGame } from '../contexts/GameContext';

export default function SessionSetup() {
  const navigate = useNavigate();
  const { startNewSession } = useGame();
  const [difficulty, setDifficulty] = useState('ELITE');
  const [temporalWindow, setTemporalWindow] = useState(45);
  const [cryoTokens, setCryoTokens] = useState(3);
  const [escalation, setEscalation] = useState(100); // 100 for HIGH

  const handleStartOperation = async () => {
    await startNewSession({
      difficulty,
      temporalWindow: Number(temporalWindow),
      cryoTokens: Number(cryoTokens),
      escalation: Number(escalation)
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col p-6">
      {/* Top Nav */}
      <nav className="flex justify-between items-center mb-16 max-w-6xl mx-auto w-full">
        <div 
          onClick={() => navigate('/')} 
          className="text-primary font-headline font-bold italic tracking-tighter text-3xl cursor-pointer"
        >
          FRAUDOPS
        </div>
        <div className="flex items-center gap-6 text-on-surface-muted">
          <span onClick={() => navigate('/leaderboard')} className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">show_chart</span>
          <span onClick={() => navigate('/performance-report')} className="material-symbols-outlined hover:text-white cursor-pointer transition-colors">diamond</span>
          <div onClick={() => navigate('/dashboard')} className="w-8 h-8 bg-surface-dim border border-border flex items-center justify-center cursor-pointer hover:border-primary">
             <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="font-headline font-black italic text-4xl mb-4 uppercase tracking-tighter text-glitch">
            <span className="text-primary">WELCOME,</span> <span className="text-white">OPERATIVE</span>
          </h1>
          <p className="text-on-surface-muted font-mono text-[10px] uppercase tracking-widest leading-loose">
            Configure your intrusion vector. Higher difficulty yields exponentially greater reward at the risk of immediate system lockout.
          </p>
        </div>

        {/* Configuration Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          
          {/* Threat Level Protocol */}
          <div className="bg-surface p-8 border border-border shadow-2xl relative">
            <div className="flex items-center gap-2 mb-8 text-tertiary font-mono text-[10px] tracking-widest uppercase font-bold">
              <span className="material-symbols-outlined text-sm">public</span>
              THREAT LEVEL PROTOCOL
              <span className="ml-auto text-on-surface-muted">SYS.REQ.V2</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {['RECRUIT', 'ANALYST', 'ELITE'].map((level) => {
                const isActive = difficulty === level;
                return (
                  <div 
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-6 cursor-pointer border transition-colors flex flex-col relative h-[220px] ${
                      isActive 
                        ? 'border-primary shadow-[0_0_15px_rgba(226,27,35,0.2)] bg-primary/5' 
                        : 'border-border bg-surface-dim hover:border-on-surface-muted'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 border-[12px] border-t-primary border-r-primary border-b-transparent border-l-transparent"></div>
                    )}
                    <h3 className="font-headline font-bold text-lg mb-4">{level}</h3>
                    <p className="text-[10px] font-mono leading-relaxed text-on-surface-muted mt-auto">
                      {level === 'RECRUIT' && 'Standard ICE protocols. Recommended for calibration runs.'}
                      {level === 'ANALYST' && 'Adaptive countermeasures active. Requires precise timing.'}
                      {level === 'ELITE' && 'Lethal system response. Black ICE deployed. Proceed with extreme prejudice.'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Session Parameters */}
          <div className="bg-surface p-8 border border-border shadow-2xl relative">
            <div className="flex items-center gap-2 mb-12 text-on-surface font-mono text-[10px] tracking-widest uppercase font-bold">
              <span className="material-symbols-outlined text-sm">tune</span>
              SESSION PARAMETERS
            </div>

            <div className="flex flex-col gap-10">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-end mb-4 font-mono font-bold text-[10px] tracking-widest uppercase">
                  <span>TEMPORAL WINDOW</span>
                  <span className="text-tertiary">{temporalWindow} MIN</span>
                </div>
                <input 
                  type="range" 
                  min="15" max="120" 
                  value={temporalWindow} 
                  onChange={(e) => setTemporalWindow(e.target.value)}
                  className="tech-slider"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-end mb-4 font-mono font-bold text-[10px] tracking-widest uppercase">
                  <span>CRYO TOKENS (OVERRIDES)</span>
                  <span className="text-white">0{cryoTokens}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5" 
                  value={cryoTokens} 
                  onChange={(e) => setCryoTokens(e.target.value)}
                  className="tech-slider"
                />
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between items-end mb-4 font-mono font-bold text-[10px] tracking-widest uppercase">
                  <span>ESCALATION THRESHOLD</span>
                  <span className="text-white">HIGH</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={escalation} 
                  onChange={(e) => setEscalation(e.target.value)}
                  className="tech-slider"
                />
                <div className="flex justify-between mt-2 text-on-surface-muted text-[8px] font-mono tracking-widest uppercase">
                  <span>LOW</span>
                  <span>MED</span>
                  <span>MAX</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Start Button */}
        <div className="mb-12">
          <Button 
            onClick={handleStartOperation}
            variant="primary" 
            className="skew-container px-12 py-4 shadow-[0_0_20px_rgba(226,27,35,0.5)] cursor-pointer"
          >
            <span className="unskew-content flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">bolt</span>
              [ START OPERATION ]
            </span>
          </Button>
        </div>

      </main>
    </div>
  );
}
