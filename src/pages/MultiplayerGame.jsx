import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { calculateNetworkScore } from '../utils/networkScoring';
import AbortModal from '../components/AbortModal';
import { logoutUser } from '../utils/auth';
import { useSettings } from '../contexts/SettingsContext';
import { playBackgroundMusic } from '../utils/audio';

export default function MultiplayerGame({ mp, playerId }) {
  const navigate = useNavigate();
  const { currentCase, submitDecision, roomState } = mp;
  const [selectedAction, setSelectedAction] = useState(null);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);

  const me = roomState?.players?.find(p => p.id === playerId);
  const isSubmitting = me?.action != null;
  const { settings } = useSettings();

  useEffect(() => {
    playBackgroundMusic();
  }, []);

  const handleDecision = (action) => {
    if (isSubmitting || !currentCase) return;

    if (action === 'FREEZE' && settings.confirmBeforeFreeze) {
      if (!window.confirm("Are you sure you want to freeze this transaction?")) {
        return;
      }
    }

    setSelectedAction(action);
    submitDecision(action);
  };

  const caseData = currentCase || {
    id: "CASE-8924A",
    sessionId: "8x7F9A2B",
    threatLevel: "CRITICAL THREAT LEVEL",
    riskScore: 94,
    transactionEvidence: [
      { id: "1", amount: 12450.00, risk: "HIGH RISK", riskColor: "primary", ip: "192.168.1.45", loc: "RU-MSK", dev: "iPhone14,3 (Spoofed)" },
      { id: "2", amount: 8900.50, risk: "HIGH RISK", riskColor: "primary", ip: "10.0.0.99", loc: "CN-BJ", dev: "Chrome/Win10" },
      { id: "3", amount: 45.00, risk: "PROBE", riskColor: "tertiary", ip: "192.168.1.45", loc: "RU-MSK", dev: "curl/7.68.0" }
    ],
    entityGraph: {
      nodes: [
        { id: "TARGET", label: "TARGET", color: "#A100FF", x: 250, y: 250, r: 16 },
        { id: "ACT_012", label: "ACT_012", color: "#E21B23", x: 350, y: 180, r: 12 },
        { id: "ACT_124", label: "ACT_124", color: "#E21B23", x: 420, y: 280, r: 10 },
        { id: "DEVICE_A", label: "DEVICE_A", color: "#00F5FF", x: 180, y: 150, r: 12 },
        { id: "IP_823F", label: "IP_823F", color: "#00F5FF", x: 200, y: 350, r: 10 }
      ],
      edges: [
        { from: [250, 250], to: [350, 180], color: "#E21B23", dashed: false },
        { from: [350, 180], to: [420, 280], color: "#E21B23", dashed: true },
        { from: [250, 250], to: [180, 150], color: "#A100FF", dashed: true },
        { from: [250, 250], to: [200, 350], color: "#00F5FF", dashed: false }
      ]
    },
    detectionSignals: [
      { id: "s1", name: "Rule-Based Velocity", percent: 98, color: "primary", description: "High frequency xfers to new payees." },
      { id: "s2", name: "Biometric Anomaly", percent: 85, color: "secondary", description: "Typing cadence mismatch detected." },
      { id: "s3", name: "Graph Distance", percent: 42, color: "tertiary", description: "2 hops from known bad actor." }
    ]
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col h-screen overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-surface-dim relative z-20">
          <div className="p-6">
            <h2 className="font-headline font-black text-2xl tracking-tight uppercase text-white mb-1">NODE_01</h2>
            <div className="font-mono text-[10px] text-secondary tracking-widest uppercase">OPERATIONAL</div>
          </div>
          
          <nav className="flex-1 flex flex-col mt-4">
            <div 
              onClick={() => setIsAbortModalOpen(true)}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              Live Stream
            </div>
            <div 
              onClick={() => setIsAbortModalOpen(true)}
              className="bg-secondary text-white py-3 px-6 flex items-center gap-4 cursor-pointer font-bold shadow-[0_0_15px_rgba(161,0,255,0.3)]"
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Analysis
            </div>
            <div 
              onClick={() => setIsAbortModalOpen(true)}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              Archive
            </div>
            <div 
              onClick={() => setIsAbortModalOpen(true)}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Network
            </div>
          </nav>
          
          <div className="p-6">
            <div className="bg-surface border border-border p-3 flex flex-col gap-1 mb-3">
              <div className="flex justify-between font-mono text-[9px] text-on-surface-muted">
                <span>OPERATIVE SCORE</span>
                <span className="text-white font-bold">{me?.score || 0}</span>
              </div>
              <div className="flex justify-between font-mono text-[9px] text-on-surface-muted">
                <span>STREAK</span>
                <span className="text-secondary font-bold">x{me?.streak || 0}</span>
              </div>
            </div>
            
            {/* Live Player Scoreboard */}
            <div className="mt-6 border-t border-border pt-4">
              <div className="font-mono text-[9px] text-on-surface-muted mb-3 uppercase tracking-widest">
                LIVE SQUAD STATUS
              </div>
              <div className="flex flex-col gap-2">
                {roomState?.players.map(p => (
                  <div key={p.id} className="flex items-center justify-between font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.action ? 'bg-primary animate-pulse shadow-[0_0_5px_#E21B23]' : 'bg-surface-dim border border-border'}`}></span>
                      <span className={`uppercase ${p.id === playerId ? 'text-secondary font-bold' : 'text-on-surface-muted'}`}>
                        {p.name.substring(0, 10)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white">{p.score}</span>
                      <span className="text-tertiary">🔥{p.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Panes Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-background relative z-10 border-b border-border">
            <div className="flex items-center gap-8">
              <div 
                onClick={() => setIsAbortModalOpen(true)}
                className="text-primary font-headline font-bold italic tracking-widest text-sm cursor-pointer"
              >
                FRAUDOPS
              </div>
              <div className="hidden md:flex items-center gap-4 font-mono text-[10px] text-on-surface-muted">
                <span>SCORE: <strong className="text-white">{me?.score || 0}</strong></span>
                <span className="text-border">|</span>
                <span>STREAK: <strong className="text-secondary">x{me?.streak || 0}</strong></span>
                <span className="text-border">|</span>
                <span className="text-primary animate-pulse uppercase">MULTIPLAYER UPLINK ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-muted">
              <span 
                onClick={() => navigate('/leaderboard')}
                title="Leaderboard" 
                className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]"
              >
                show_chart
              </span>
              <span 
                onClick={() => navigate('/performance-report')}
                title="Performance Report" 
                className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]"
              >
                diamond
              </span>
              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 border border-border px-3 py-1 bg-surface cursor-pointer hover:border-primary group"
                title="Operative Settings"
              >
                <span className="font-mono text-[10px] text-white uppercase group-hover:text-primary transition-colors">{me?.name || 'OPERATIVE'}</span>
                <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">settings</span>
              </div>
            </div>
          </header>

          {/* Investigation Header */}
          <div className="px-8 py-5 flex justify-between items-end border-b border-border bg-background relative z-10 wireframe-bg">
            <div>
              <h1 className="font-headline font-black italic text-3xl text-white uppercase tracking-tighter mb-1">INVESTIGATION WORKSPACE</h1>
              <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-muted flex items-center gap-3">
                <span>SESSION ID: <span className="text-tertiary">{caseData.sessionId}</span></span>
                <span>//</span>
                <span>CASE: <span className="text-white font-bold">{caseData.id}</span></span>
              </div>
            </div>
            <div className={`border font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest ${
              caseData.threatLevel === 'CRITICAL' || caseData.threatLevel === 'CRITICAL THREAT LEVEL'
                ? 'border-primary bg-primary/10 text-primary'
                : caseData.threatLevel === 'ELEVATED' || caseData.threatLevel === 'ANOMALOUS'
                  ? 'border-secondary bg-secondary/10 text-secondary'
                  : 'border-tertiary bg-tertiary/10 text-tertiary'
            }`}>
              {caseData.threatLevel}
            </div>
          </div>

          {/* Main Investigation Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 p-8 overflow-y-auto pb-40">
            
            {/* Transaction Evidence */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col">
              <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">receipt_long</span> TRANSACTION EVIDENCE
              </div>
              
              <div className="flex flex-col gap-6">
                {caseData.transactionEvidence.map((tx, idx) => (
                  <div key={tx.id || idx} className={`${idx < caseData.transactionEvidence.length - 1 ? 'border-b border-border pb-4' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-headline font-bold text-white text-xl">
                        ${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`font-mono text-[10px] font-bold uppercase ${
                        tx.riskColor === 'primary' || tx.risk === 'HIGH RISK' ? 'text-primary' :
                        tx.riskColor === 'secondary' ? 'text-secondary' : 'text-tertiary'
                      }`}>
                        {tx.risk}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-on-surface-muted">
                      <div>IP:<br/><span className="text-white">{tx.ip}</span></div>
                      <div>LOC:<br/><span className="text-white">{tx.loc}</span></div>
                      {tx.dev && <div className="col-span-2 mt-2">DEV:<br/><span className="text-white">{tx.dev}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entity Graph */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col relative overflow-hidden h-[400px] lg:h-auto">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold bg-background/80 inline-block px-2 py-1">
                  <span className="material-symbols-outlined text-sm align-middle mr-2">hub</span> ENTITY GRAPH
                </div>
                
                <div className="bg-background/90 border border-border px-3 py-2 flex flex-col items-end shadow-xl">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-on-surface-muted">Final Network Score</span>
                  <span className="font-headline font-bold text-2xl text-white">
                    {caseData.networkScore !== undefined ? caseData.networkScore : calculateNetworkScore(caseData.entityGraph)}
                  </span>
                </div>
              </div>
              
              {/* Dynamic Entity Graph */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 500 500" className="opacity-85">
                  {/* Edges */}
                  {caseData.entityGraph?.edges?.map((edge, i) => (
                    <line 
                      key={i} 
                      x1={edge.from[0]} 
                      y1={edge.from[1]} 
                      x2={edge.to[0]} 
                      y2={edge.to[1]} 
                      stroke={edge.color || '#E21B23'} 
                      strokeWidth="2" 
                      strokeDasharray={edge.dashed ? "4 4" : "none"} 
                    />
                  ))}
                  
                  {/* Nodes */}
                  {caseData.entityGraph?.nodes?.map((node, i) => (
                    <g key={node.id || i}>
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.r || 12} 
                        fill="#131315" 
                        stroke={node.color || '#A100FF'} 
                        strokeWidth="2.5" 
                        filter={node.id === 'TARGET' ? 'drop-shadow(0 0 8px rgba(161,0,255,0.8))' : 'none'}
                      />
                      <text 
                        x={node.x} 
                        y={node.r > 14 ? node.y : node.y + node.r + 12} 
                        fill={node.color || 'white'} 
                        fontSize="7" 
                        fontFamily="monospace" 
                        textAnchor="middle" 
                        dominantBaseline={node.r > 14 ? "middle" : "auto"}
                      >
                        {node.label || node.id}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Detection Signals */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col">
              <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">warning</span> DETECTION SIGNALS
              </div>
              
              <div className="flex flex-col gap-8">
                {caseData.detectionSignals?.map((sig, idx) => {
                  const colorClass = sig.color === 'primary' || sig.percent >= 90 ? 'text-primary bg-primary shadow-[0_0_8px_rgba(226,27,35,0.8)]' :
                    sig.color === 'secondary' || sig.percent >= 75 ? 'text-secondary bg-secondary shadow-[0_0_8px_rgba(161,0,255,0.8)]' :
                    'text-tertiary bg-tertiary shadow-[0_0_8px_rgba(0,245,255,0.8)]';

                  const textClass = sig.color === 'primary' || sig.percent >= 90 ? 'text-primary' :
                    sig.color === 'secondary' || sig.percent >= 75 ? 'text-secondary' : 'text-tertiary';

                  return (
                    <div key={sig.id || idx}>
                      <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-bold">
                        <span className="text-white">{sig.name}</span>
                        <span className={textClass}>{sig.percent}%</span>
                      </div>
                      <div className="h-1 bg-surface mb-2">
                        <div className={`h-full ${colorClass}`} style={{ width: `${sig.percent}%` }}></div>
                      </div>
                      <p className="text-on-surface-muted text-[10px] leading-tight">{sig.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>

          {/* Bottom Action Bar (Fixed at bottom of main content) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-surface/95 backdrop-blur-md border border-border shadow-2xl p-4 z-30">
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(226,27,35,0.2)]">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-2">sync</span>
                <h3 className="font-headline font-bold text-xl text-white uppercase italic tracking-tighter">WAITING FOR SQUAD</h3>
                <p className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest mt-1">
                  AWAITING DECISION SYNCHRONIZATION...
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* CLEAR Button */}
              <button 
                onClick={() => handleDecision('CLEAR')}
                disabled={isSubmitting}
                className={`bg-surface-dim hover:bg-white/5 border border-transparent transition-all p-4 text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAction === 'CLEAR' && isSubmitting ? 'ring-2 ring-tertiary animate-pulse' : ''
                }`}
              >
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">CLEAR</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Mark as false positive. Release holds.</div>
              </button>
              
              {/* STEP-UP AUTH Button */}
              <button 
                onClick={() => handleDecision('STEP-UP AUTH')}
                disabled={isSubmitting}
                className={`bg-surface-dim border border-secondary hover:bg-secondary/10 transition-all p-4 text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAction === 'STEP-UP AUTH' && isSubmitting ? 'ring-2 ring-secondary animate-pulse' : ''
                }`}
              >
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">STEP-UP AUTH</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Trigger SMS/Email verification loop.</div>
              </button>
              
              {/* FREEZE Button */}
              <button 
                onClick={() => handleDecision('FREEZE')}
                disabled={isSubmitting}
                className={`w-full h-full bg-primary hover:bg-primary/90 transition-all p-4 text-center skew-container shadow-[0_0_20px_rgba(226,27,35,0.3)] disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAction === 'FREEZE' && isSubmitting ? 'ring-2 ring-white animate-pulse' : ''
                }`}
              >
                <div className="unskew-content">
                  <div className="font-headline font-bold text-lg text-white mb-1 uppercase">FREEZE</div>
                  <div className="text-[9px] font-mono text-white/80">Immediate halt on all account activity.</div>
                </div>
              </button>
              
              {/* ESCALATE Button */}
              <button 
                onClick={() => handleDecision('ESCALATE')}
                disabled={isSubmitting}
                className={`bg-primary/5 border border-primary/30 hover:bg-primary/10 transition-all p-4 text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAction === 'ESCALATE' && isSubmitting ? 'ring-2 ring-primary animate-pulse' : ''
                }`}
              >
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">ESCALATE</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Route to L3 Manual Review Queue.</div>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
      
      <AbortModal 
        isOpen={isAbortModalOpen} 
        onCancel={() => setIsAbortModalOpen(false)} 
        onAbort={() => logoutUser(navigate, mp)} 
      />
    </div>
  );
}
