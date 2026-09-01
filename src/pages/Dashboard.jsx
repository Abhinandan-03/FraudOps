import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col h-screen overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-surface-dim">
          <div className="p-6">
            <h2 className="font-headline font-black text-2xl tracking-tight uppercase text-white mb-1">NODE_01</h2>
            <div className="font-mono text-[10px] text-secondary tracking-widest uppercase">OPERATIONAL</div>
          </div>
          
          <nav className="flex-1 flex flex-col mt-4">
            <div className="bg-secondary text-white py-3 px-6 flex items-center gap-4 cursor-pointer font-bold shadow-[0_0_15px_rgba(161,0,255,0.3)]">
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              Live Stream
            </div>
            <div className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors">
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
            <Link to="/investigation">
              <button className="w-full bg-primary text-white font-headline font-bold uppercase tracking-wider py-3 skew-container hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(226,27,35,0.4)]">
                <span className="unskew-content block text-sm">DEPLOY COUNTERMEASURE</span>
              </button>
            </Link>
          </div>
        </aside>

        {/* Center & Right Panes Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Header */}
          <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background">
            <div className="text-primary font-headline font-black italic tracking-tighter text-4xl text-glitch">FRAUDOPS</div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="font-mono text-[8px] text-on-surface-muted tracking-widest uppercase">SCORE</span>
                <span className="font-headline font-bold text-xl text-white">1,240</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-[8px] text-on-surface-muted tracking-widest uppercase">STREAK</span>
                <span className="font-headline font-bold text-xl text-secondary">x3</span>
              </div>
              
              <div className="h-8 w-px bg-border mx-2"></div>
              
              <div className="flex items-center gap-2">
                <div className="bg-tertiary/10 border border-tertiary/30 px-2 py-1 flex items-center gap-1 text-tertiary font-mono text-[10px]">
                  <span className="material-symbols-outlined text-[12px]">ac_unit</span> 02
                </div>
                <div className="bg-primary/10 border border-primary/30 px-2 py-1 flex items-center gap-1 text-primary font-mono text-[10px]">
                  <span className="material-symbols-outlined text-[12px]">warning</span> 05
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-on-surface-muted ml-4">
                <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">show_chart</span>
                <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">diamond</span>
                <span className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">account_balance_wallet</span>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface cursor-pointer hover:border-primary">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Grid */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Live Stream Column */}
            <div className="w-[300px] border-r border-border p-6 overflow-y-auto wireframe-bg">
              <div className="font-headline font-bold text-xs uppercase tracking-widest text-white mb-6 border-b border-border pb-2 flex justify-between items-center">
                <span style={{WebkitTextStroke: "1px #A100FF", color: "transparent"}}>LIVE STREAM</span>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Transaction Card - Critical */}
                <div className="bg-surface p-4 border border-border border-l-4 border-l-primary hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-on-surface-muted">
                    <span>TX-8924A</span>
                    <span className="text-primary font-bold">94% RISK</span>
                  </div>
                  <div className="font-headline font-bold text-2xl text-white mb-2">$12,450.00</div>
                  <div className="flex items-center gap-1 text-on-surface-muted text-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Kyiv, UA
                  </div>
                </div>

                {/* Transaction Card - Medium */}
                <div className="bg-surface p-4 border border-border hover:border-tertiary transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-on-surface-muted">
                    <span>TX-8924B</span>
                    <span className="text-tertiary font-bold">42% RISK</span>
                  </div>
                  <div className="font-headline font-bold text-2xl text-white mb-2">$340.50</div>
                  <div className="flex items-center gap-1 text-on-surface-muted text-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> London, UK
                  </div>
                </div>

                {/* Transaction Card - Low */}
                <div className="bg-surface p-4 border border-border opacity-60">
                  <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-on-surface-muted">
                    <span>TX-8924C</span>
                    <span>12% RISK</span>
                  </div>
                  <div className="font-headline font-bold text-2xl text-white mb-2">$45.00</div>
                  <div className="flex items-center gap-1 text-on-surface-muted text-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> New York, US
                  </div>
                </div>
                
                {/* Inactive cards */}
                <div className="font-mono text-[10px] text-on-surface-muted/30 pt-4">TX-8923</div>
                <div className="font-mono text-[10px] text-on-surface-muted/30">TX-8922</div>
              </div>
            </div>

            {/* Operational Feed Column */}
            <div className="flex-1 border-r border-border p-6 overflow-y-auto wireframe-bg relative">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-2">
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-white">OPERATIONAL FEED</span>
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 uppercase">LIVE</span>
              </div>
              
              <div className="flex flex-col gap-6">
                {/* Major Alert */}
                <Link to="/alerts">
                  <div className="border border-secondary bg-secondary/5 p-6 shadow-[0_0_20px_rgba(161,0,255,0.1)] relative overflow-hidden group cursor-pointer hover:bg-secondary/10 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                    <div className="flex gap-4">
                      <span className="material-symbols-outlined text-secondary text-3xl">warning</span>
                      <div>
                        <h3 className="font-headline font-bold text-xl text-white mb-2">Coordinated Attack Detected</h3>
                        <p className="text-on-surface-muted text-sm mb-4">Velocity spike identified from subnet block 192.168.x.x originating in Eastern Europe. Automated mitigation protocols engaged.</p>
                        <div className="flex gap-2">
                          <span className="bg-surface border border-border px-2 py-1 font-mono text-[10px] text-on-surface-muted uppercase">VELOCITY_SPIKE</span>
                          <span className="bg-surface border border-border px-2 py-1 font-mono text-[10px] text-on-surface-muted uppercase">GEO_ANOMALY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Log Entry 1 */}
                <div className="flex gap-4 items-start pl-4">
                  <div className="font-mono text-[10px] text-on-surface-muted w-16 pt-1">10:42:01</div>
                  <div className="flex-1">
                    <div className="text-tertiary font-bold text-sm mb-1">Entity Freeze Authorized</div>
                    <div className="text-on-surface-muted text-sm">Account ID #4492-X locked pending manual review. Score threshold exceeded.</div>
                  </div>
                </div>

                {/* Log Entry 2 */}
                <div className="flex gap-4 items-start pl-4">
                  <div className="font-mono text-[10px] text-on-surface-muted w-16 pt-1">10:39:15</div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm mb-1">Rule Update Deployed</div>
                    <div className="text-on-surface-muted text-sm">Model v2.4 adjusted for aggressive BIN attacks.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Risk Right Pane */}
            <div className="w-[320px] p-6 overflow-y-auto bg-background">
              
              {/* Risk Level */}
              <div className="mb-10 text-center flex flex-col items-center">
                <div className="font-headline font-bold text-xs uppercase tracking-widest text-white mb-6">GLOBAL RISK LEVEL</div>
                
                <div className="w-40 h-40 rounded-full border-4 border-primary/20 flex items-center justify-center relative mb-6">
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent border-l-transparent transform rotate-45"></div>
                  <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(226,27,35,0.3)]"></div>
                  <span className="font-headline font-black text-6xl text-white">8.4</span>
                </div>
                
                <div className="flex gap-4 font-mono text-[10px] tracking-widest text-on-surface-muted font-bold">
                  <span>ELEVATED</span>
                  <span>DEFCON 3</span>
                </div>
              </div>

              {/* Escalations */}
              <div>
                <div className="font-headline font-bold text-xs uppercase tracking-widest text-white mb-4 border-b border-border pb-2">ESCALATIONS</div>
                
                <div className="flex flex-col gap-3">
                  <div className="p-4 border border-secondary bg-surface-dim hover:bg-surface transition-colors cursor-pointer shadow-[0_0_10px_rgba(161,0,255,0.1)]">
                    <div className="text-secondary font-bold text-sm mb-1">Whale Review: VIP-992</div>
                    <div className="text-on-surface-muted text-sm">$1.2M transfer pending.</div>
                  </div>
                  
                  <div className="p-4 border border-border bg-surface-dim hover:bg-surface transition-colors cursor-pointer">
                    <div className="text-white font-bold text-sm mb-1">KYC Mismatch</div>
                    <div className="text-on-surface-muted text-sm">Doc scan failed for Acc...</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="h-12 border-t border-border flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-widest text-on-surface-muted bg-background">
        <div className="flex items-center gap-6">
          <span>FRAUDOPS SYSTEM V2.4.0</span>
          <span className="text-tertiary border-b border-tertiary pb-[1px] cursor-pointer">SESSION DATA</span>
          <span className="hover:text-white cursor-pointer transition-colors">NETWORK LATENCY</span>
          <span className="hover:text-white cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
        </div>
        <div className="flex gap-6">
          <span className="text-on-surface-muted">PREVENTED: <span className="text-tertiary">$4.2M</span></span>
          <span>FP RATE: <span className="text-white">1.2%</span></span>
        </div>
      </footer>
    </div>
  );
}
