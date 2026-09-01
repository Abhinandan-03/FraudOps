import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function Alerts() {
  const { currentCase } = useGame();

  const riskScore = currentCase?.riskScore ?? 87;
  const signals = currentCase?.detectionSignals || [
    { name: "Unusual Amount", description: "+4,500% above user baseline", icon: "payments", color: "primary" },
    { name: "New Device Detected", description: "Unrecognized terminal ID: 0x9F42A", icon: "devices", color: "secondary" },
    { name: "High Velocity", description: "12 transactions within 45 seconds", icon: "speed", color: "tertiary" }
  ];

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col items-center justify-center relative p-6 force-prowler-theme">
      
      {/* Background Dim */}
      <div className="absolute inset-0 bg-background/80 pointer-events-none z-0"></div>

      {/* Main Alert Card */}
      <div className="bg-surface-dim border-t-4 border-t-primary w-full max-w-4xl p-10 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/10 blur-[100px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-primary text-4xl mt-2">warning</span>
            <h1 className="font-headline font-black italic text-5xl md:text-6xl text-primary leading-[0.9] tracking-tighter uppercase text-glitch skew-container">
              <span className="block">SUSPICIOUS</span>
              <span className="block">ACTIVITY</span>
            </h1>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-mono text-[8px] text-on-surface-muted tracking-widest uppercase mb-1">SYSTEM STATE</span>
            <div className="bg-secondary/20 border border-secondary p-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[14px]">lock</span>
              <span className="font-mono text-[10px] text-secondary tracking-widest uppercase font-bold leading-tight text-right">PROWLER<br/>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mb-12 relative z-10">
          
          {/* Risk Score Panel */}
          <div className="bg-background border border-border p-8 flex flex-col items-center justify-center">
            <span className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-6 font-bold">RISK SCORE</span>
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative shadow-[0_0_30px_rgba(226,27,35,0.2)]">
               <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent transform rotate-12"></div>
               <span className="font-headline font-black text-4xl text-primary">{riskScore}<span className="text-2xl">%</span></span>
            </div>
          </div>

          {/* Trigger Signals Panel */}
          <div className="bg-background border border-border p-8">
            <h3 className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-6 font-bold">TRIGGER SIGNALS</h3>
            
            <div className="flex flex-col gap-6">
              {signals.map((sig, idx) => {
                const color = sig.color === 'primary' || (sig.percent && sig.percent >= 90) ? 'primary' :
                  sig.color === 'secondary' || (sig.percent && sig.percent >= 70) ? 'secondary' : 'tertiary';

                const icon = sig.icon || (color === 'primary' ? 'payments' : color === 'secondary' ? 'devices' : 'speed');

                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`mt-1 w-1 h-10 rounded-full hidden md:block ${
                      color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-tertiary'
                    }`}></div>
                    <span className={`material-symbols-outlined ${
                      color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-tertiary'
                    }`}>
                      {icon}
                    </span>
                    <div>
                      <div className="text-white font-bold text-sm mb-1">{sig.name}</div>
                      <div className="text-on-surface-muted text-xs font-mono">{sig.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end relative z-10">
          <Link to="/investigation">
            <button className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all font-headline font-bold text-lg uppercase tracking-wider px-8 py-3 flex items-center gap-3 shadow-[0_0_20px_rgba(161,0,255,0.2)]">
              <span className="material-symbols-outlined text-xl">search</span>
              INVESTIGATE
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
