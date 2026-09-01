import { Link } from 'react-router-dom';

export default function Investigation() {
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
            <div className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              Live Stream
            </div>
            <div className="bg-secondary text-white py-3 px-6 flex items-center gap-4 cursor-pointer font-bold shadow-[0_0_15px_rgba(161,0,255,0.3)]">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Analysis
            </div>
            <div className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Archive
            </div>
            <div className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Network
            </div>
          </nav>
          
          <div className="p-6">
            <button className="w-full bg-transparent border border-secondary text-secondary font-headline font-bold uppercase tracking-wider py-3 skew-container hover:bg-secondary/10 transition-colors">
              <span className="unskew-content block text-sm">DEPLOY COUNTERMEASURE</span>
            </button>
          </div>
        </aside>

        {/* Center Panes Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-8 bg-background relative z-10">
            <div className="text-primary font-headline font-bold italic tracking-widest text-sm text-glitch">FRAUDOPS</div>
            
            <div className="flex items-center gap-4 text-on-surface-muted">
              <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">show_chart</span>
              <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">diamond</span>
              <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">account_balance_wallet</span>
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface cursor-pointer hover:border-primary">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            </div>
          </header>

          {/* Investigation Header */}
          <div className="px-8 py-6 flex justify-between items-end border-b border-border bg-background relative z-10 wireframe-bg">
            <div>
              <h1 className="font-headline font-black italic text-3xl text-white uppercase tracking-tighter mb-2">INVESTIGATION WORKSPACE</h1>
              <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-muted">
                SESSION ID: <span className="text-tertiary">8x7F9A2B</span>
              </div>
            </div>
            <div className="border border-primary bg-primary/10 text-primary font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              CRITICAL THREAT LEVEL
            </div>
          </div>

          {/* Main Investigation Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 p-8 overflow-y-auto pb-32">
            
            {/* Transaction Evidence */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col">
              <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">receipt_long</span> TRANSACTION EVIDENCE
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="border-b border-border pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline font-bold text-white text-xl">$12,450.00</span>
                    <span className="text-primary font-mono text-[10px] font-bold uppercase">HIGH RISK</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-on-surface-muted">
                    <div>IP:<br/><span className="text-white">192.168.1.45</span></div>
                    <div>LOC:<br/><span className="text-white">RU-MSK</span></div>
                    <div className="col-span-2 mt-2">DEV:<br/><span className="text-white">iPhone14,3 (Spoofed)</span></div>
                  </div>
                </div>

                <div className="border-b border-border pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline font-bold text-white text-xl">$8,900.50</span>
                    <span className="text-primary font-mono text-[10px] font-bold uppercase">HIGH RISK</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-on-surface-muted">
                    <div>IP:<br/><span className="text-white">10.0.0.99</span></div>
                    <div>LOC:<br/><span className="text-white">CN-BJ</span></div>
                    <div className="col-span-2 mt-2">DEV:<br/><span className="text-white">Chrome/Win10</span></div>
                  </div>
                </div>

                <div className="opacity-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline font-bold text-white text-xl">$45.00</span>
                    <span className="text-tertiary font-mono text-[10px] font-bold uppercase">PROBE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-on-surface-muted">
                    <div>IP:<br/><span className="text-white">192.168.1.45</span></div>
                    <div>LOC:<br/><span className="text-white">RU-MSK</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Entity Graph */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col relative overflow-hidden h-[400px] lg:h-auto">
              <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold mb-6 flex items-center gap-2 relative z-10 bg-background/80 inline-block px-2 py-1 w-max">
                <span className="material-symbols-outlined text-sm">hub</span> ENTITY GRAPH
              </div>
              
              {/* Fake Graph */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 500 500" className="opacity-80">
                  {/* Lines */}
                  <line x1="250" y1="250" x2="350" y2="180" stroke="#E21B23" strokeWidth="2" />
                  <line x1="350" y1="180" x2="420" y2="280" stroke="#E21B23" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="250" y1="250" x2="180" y2="150" stroke="#A100FF" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="250" y1="250" x2="200" y2="350" stroke="#00F5FF" strokeWidth="2" />
                  
                  {/* Nodes */}
                  <circle cx="250" cy="250" r="16" fill="#131315" stroke="#A100FF" strokeWidth="3" filter="drop-shadow(0 0 8px rgba(161,0,255,0.8))" />
                  <text x="250" y="250" fill="white" fontSize="6" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">TARGET</text>
                  
                  <circle cx="350" cy="180" r="12" fill="#131315" stroke="#E21B23" strokeWidth="2" />
                  <text x="350" y="202" fill="#E21B23" fontSize="6" fontFamily="monospace" textAnchor="middle">ACT_012</text>

                  <circle cx="420" cy="280" r="10" fill="#131315" stroke="#E21B23" strokeWidth="2" />
                  <text x="420" y="300" fill="#E21B23" fontSize="6" fontFamily="monospace" textAnchor="middle">ACT_124</text>

                  <circle cx="180" cy="150" r="12" fill="#131315" stroke="#00F5FF" strokeWidth="2" />
                  <text x="180" y="172" fill="#00F5FF" fontSize="6" fontFamily="monospace" textAnchor="middle">DEVICE_A</text>

                  <circle cx="200" cy="350" r="10" fill="#131315" stroke="#00F5FF" strokeWidth="2" />
                  <text x="200" y="370" fill="#00F5FF" fontSize="6" fontFamily="monospace" textAnchor="middle">IP_823F</text>
                </svg>
              </div>
            </div>

            {/* Detection Signals */}
            <div className="bg-surface-dim border border-border p-6 flex flex-col">
              <div className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">warning</span> DETECTION SIGNALS
              </div>
              
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-bold">
                    <span className="text-white">Rule-Based Velocity</span>
                    <span className="text-primary">98%</span>
                  </div>
                  <div className="h-1 bg-surface mb-2">
                    <div className="h-full bg-primary shadow-[0_0_8px_rgba(226,27,35,0.8)]" style={{width: '98%'}}></div>
                  </div>
                  <p className="text-on-surface-muted text-[10px] leading-tight">High frequency xfers to new payees.</p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-bold">
                    <span className="text-white">Biometric Anomaly</span>
                    <span className="text-secondary">85%</span>
                  </div>
                  <div className="h-1 bg-surface mb-2">
                    <div className="h-full bg-secondary shadow-[0_0_8px_rgba(161,0,255,0.8)]" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-on-surface-muted text-[10px] leading-tight">Typing cadence mismatch detected.</p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2 font-mono text-[10px] font-bold">
                    <span className="text-white">Graph Distance</span>
                    <span className="text-tertiary">42%</span>
                  </div>
                  <div className="h-1 bg-surface mb-2">
                    <div className="h-full bg-tertiary shadow-[0_0_8px_rgba(0,245,255,0.8)]" style={{width: '42%'}}></div>
                  </div>
                  <p className="text-on-surface-muted text-[10px] leading-tight">2 hops from known bad actor.</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Bottom Action Bar (Fixed at bottom of main content) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-surface border border-border shadow-2xl p-4 z-30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-surface-dim hover:bg-white/5 border border-transparent transition-colors p-4 text-center">
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">CLEAR</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Mark as false positive. Release holds.</div>
              </button>
              
              <button className="bg-surface-dim border border-secondary hover:bg-secondary/10 transition-colors p-4 text-center">
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">STEP-UP AUTH</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Trigger SMS/Email verification loop.</div>
              </button>
              
              <Link to="/success" className="block">
                <button className="w-full h-full bg-primary hover:bg-primary/90 transition-colors p-4 text-center skew-container shadow-[0_0_20px_rgba(226,27,35,0.3)]">
                  <div className="unskew-content">
                    <div className="font-headline font-bold text-lg text-white mb-1 uppercase">FREEZE</div>
                    <div className="text-[9px] font-mono text-white/80">Immediate halt on all account activity.</div>
                  </div>
                </button>
              </Link>
              
              <button className="bg-primary/5 border border-primary/30 hover:bg-primary/10 transition-colors p-4 text-center">
                <div className="font-headline font-bold text-lg text-white mb-1 uppercase">ESCALATE</div>
                <div className="text-[9px] font-mono text-on-surface-muted">Route to L3 Manual Review Queue.</div>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="h-12 border-t border-border flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-widest text-on-surface-muted bg-background relative z-30">
        <div className="flex items-center gap-6">
          <span>FRAUDOPS SYSTEM V2.4.0</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">SESSION DATA</span>
          <span className="hover:text-white cursor-pointer transition-colors">NETWORK LATENCY</span>
          <span className="hover:text-white cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
        </div>
      </footer>
    </div>
  );
}
