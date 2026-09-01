import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { sessionState } = useGame();

  const userScore = (84000 + (sessionState.score || 1240)).toLocaleString('en-US');
  const userAcc = `${sessionState.detectionAccuracy || 93.8}%`;
  const userResp = `${sessionState.avgResponseTime || 1.1}s`;
  const userPrevented = sessionState.fraudPrevented 
    ? `$${(sessionState.fraudPrevented / 1000000).toFixed(1)}M`
    : '$5.1M';

  return (
    <div className="min-h-screen bg-background font-body text-on-surface flex flex-col h-screen overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-surface-dim relative z-20">
          <div className="p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/10 border border-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-xl">share</span>
            </div>
            <div>
              <h2 className="font-headline font-black text-xl tracking-tight uppercase text-white mb-0">NODE_01</h2>
              <div className="font-mono text-[8px] text-tertiary tracking-widest uppercase">OPERATIONAL</div>
            </div>
          </div>
          
          <nav className="flex-1 flex flex-col mt-4">
            <div 
              onClick={() => navigate('/dashboard')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">radio_button_checked</span>
              Live Stream
            </div>
            <div 
              onClick={() => navigate('/investigation')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              Analysis
            </div>
            <div className="bg-secondary text-white py-3 px-6 flex items-center gap-4 cursor-pointer font-bold shadow-[0_0_15px_rgba(161,0,255,0.3)]">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Archive
            </div>
            <div 
              onClick={() => navigate('/performance-report')}
              className="text-on-surface-muted py-4 px-6 flex items-center gap-4 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Network
            </div>
          </nav>
          
          <div className="p-6">
            <Link to="/investigation">
              <button className="w-full bg-primary text-white font-headline font-bold uppercase tracking-wider py-3 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(226,27,35,0.4)] border border-primary text-sm">
                DEPLOY COUNTERMEASURE
              </button>
            </Link>
          </div>
        </aside>

        {/* Center Panes Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative wireframe-bg">
          
          {/* Top Header */}
          <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background relative z-10">
            <div className="flex items-center gap-12">
              <div 
                onClick={() => navigate('/dashboard')}
                className="text-primary font-headline font-black italic tracking-tighter text-4xl text-glitch cursor-pointer"
              >
                FRAUDOPS
              </div>
              
              <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] tracking-widest uppercase font-bold text-on-surface-muted">
                <span onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer transition-colors">DASHBOARD</span>
                <span className="text-white border-b-2 border-primary pb-1 pt-1">LEADERBOARD</span>
                <span onClick={() => navigate('/investigation')} className="hover:text-white cursor-pointer transition-colors">OPERATIONS</span>
              </nav>
            </div>
            
            <div className="flex items-center gap-4 text-on-surface-muted">
              <span onClick={() => navigate('/leaderboard')} className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">show_chart</span>
              <span onClick={() => navigate('/performance-report')} className="material-symbols-outlined hover:text-white cursor-pointer text-[18px]">diamond</span>
              <div onClick={() => navigate('/dashboard')} className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-surface-dim cursor-pointer hover:border-primary">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
            </div>
          </header>

          {/* Leaderboard Content */}
          <div className="flex-1 overflow-y-auto p-12">
            
            <div className="max-w-5xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="font-headline font-black italic text-4xl text-white uppercase tracking-tighter">GLOBAL RANKING</h1>
                  <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
                </div>
                <p className="text-primary font-mono text-xs">Elite operative performance metrics. Top agents secure priority network access.</p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-4 mb-4 font-mono text-[10px] font-bold tracking-widest uppercase text-tertiary border-b border-border">
                <div>RANK</div>
                <div>OPERATIVE NAME</div>
                <div className="text-right">SCORE</div>
                <div className="text-right">ACCURACY</div>
                <div className="text-right">AVG RESP</div>
                <div className="text-right">FRAUD PREVENTED</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col gap-2">
                
                {/* Row 1 */}
                <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-surface-dim/50 border-b border-border/50 hover:bg-surface-dim transition-colors">
                  <div className="font-headline font-black italic text-3xl text-secondary">01</div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 border border-secondary/30">sports_esports</span>
                    <div>
                      <div className="text-white font-bold text-sm mb-0.5 flex items-center gap-2">Ghost_Protocol <span className="material-symbols-outlined text-[14px] text-secondary">verified</span></div>
                      <div className="font-mono text-[8px] tracking-widest uppercase text-on-surface-muted">ELITE TIER</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-tertiary font-bold">99,842</div>
                  <div className="text-right font-mono text-white text-xs">98.4%</div>
                  <div className="text-right font-mono text-white text-xs">0.4s</div>
                  <div className="text-right font-mono text-white text-xs">$12.4M</div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-surface-dim/50 border-b border-border/50 hover:bg-surface-dim transition-colors">
                  <div className="font-headline font-black italic text-3xl text-secondary">02</div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 border border-secondary/30">security</span>
                    <div>
                      <div className="text-white font-bold text-sm mb-0.5 flex items-center gap-2">Cipher_Strike <span className="material-symbols-outlined text-[14px] text-secondary">verified</span></div>
                      <div className="font-mono text-[8px] tracking-widest uppercase text-on-surface-muted">ELITE TIER</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-tertiary font-bold">95,128</div>
                  <div className="text-right font-mono text-white text-xs">97.1%</div>
                  <div className="text-right font-mono text-white text-xs">0.6s</div>
                  <div className="text-right font-mono text-white text-xs">$10.1M</div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-surface-dim/50 border-b border-border/50 hover:bg-surface-dim transition-colors">
                  <div className="font-headline font-black italic text-3xl text-secondary">03</div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 border border-secondary/30">memory</span>
                    <div>
                      <div className="text-white font-bold text-sm mb-0.5 flex items-center gap-2">Null_Pointer <span className="material-symbols-outlined text-[14px] text-secondary">verified</span></div>
                      <div className="font-mono text-[8px] tracking-widest uppercase text-on-surface-muted">ELITE TIER</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-tertiary font-bold">92,488</div>
                  <div className="text-right font-mono text-white text-xs">96.5%</div>
                  <div className="text-right font-mono text-white text-xs">0.7s</div>
                  <div className="text-right font-mono text-white text-xs">$8.9M</div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center border-b border-border/50 hover:bg-surface-dim transition-colors">
                  <div className="font-mono font-bold text-sm text-on-surface-muted pl-1">04</div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-muted bg-surface-dim p-1.5 border border-border">code</span>
                    <div className="text-white font-bold text-sm">Byte_Me</div>
                  </div>
                  <div className="text-right font-mono text-on-surface-muted font-bold">88,105</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">94.2%</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">0.9s</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">$6.2M</div>
                </div>

                {/* Row 5 - Active User */}
                <Link to="/performance-report">
                  <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-primary/5 border border-primary relative shadow-[0_0_20px_rgba(226,27,35,0.15)] group cursor-pointer hover:bg-primary/10 transition-colors my-2">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_10px_#E21B23]"></div>
                    <div className="font-headline font-black italic text-3xl text-primary pl-2">05</div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary border border-primary p-1.5">person</span>
                      <div>
                        <div className="text-white font-bold text-sm mb-0.5 group-hover:text-primary transition-colors">You (Operative_X)</div>
                        <div className="font-mono text-[8px] tracking-widest uppercase text-white font-bold">ACTIVE SESSION</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-tertiary font-bold">{userScore}</div>
                    <div className="text-right font-mono text-white text-xs font-bold">{userAcc}</div>
                    <div className="text-right font-mono text-white text-xs font-bold">{userResp}</div>
                    <div className="text-right font-mono text-white text-xs font-bold">{userPrevented}</div>
                    
                    {/* Glowing crosshair line */}
                    <div className="absolute top-1/2 left-0 w-[150vw] h-[1px] bg-primary/30 pointer-events-none -translate-y-1/2 z-[-1] -translate-x-[20vw]"></div>
                  </div>
                </Link>

                {/* Row 6 */}
                <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center hover:bg-surface-dim transition-colors">
                  <div className="font-mono font-bold text-sm text-on-surface-muted pl-1">06</div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-muted bg-surface-dim p-1.5 border border-border">dns</span>
                    <div className="text-white font-bold text-sm">Data_Scrap</div>
                  </div>
                  <div className="text-right font-mono text-on-surface-muted font-bold">79,900</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">91.0%</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">1.4s</div>
                  <div className="text-right font-mono text-on-surface-muted text-xs">$3.8M</div>
                </div>

              </div>

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
          <span onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer transition-colors">SESSION DATA</span>
          <span className="hover:text-white cursor-pointer transition-colors">NETWORK LATENCY</span>
          <span className="hover:text-white cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
        </div>
      </footer>
    </div>
  );
}
