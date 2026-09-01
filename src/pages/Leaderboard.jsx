import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNotification } from '../contexts/NotificationContext';
import fraudOpsApi from '../services/fraudOpsApi';

export default function Leaderboard() {
  const navigate = useNavigate();
  const { sessionState } = useGame();
  const { settings } = useSettings();
  const { addNotification } = useNotification();
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousRankRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const data = await fraudOpsApi.getLeaderboard();
        if (mounted && data) {
          setLeaderboardData(data);
          
          if (settings?.notifications?.leaderboardUpdates && sessionState?.playerName) {
            const currentRank = data.findIndex(p => p.player_name === sessionState.playerName) + 1;
            
            if (currentRank > 0) {
              if (previousRankRef.current && currentRank > previousRankRef.current) {
                // Rank dropped
                addNotification('leaderboard', 'LEADERBOARD SHIFT', `Alert: You have been displaced in the rankings. Current rank: ${currentRank}.`);
              }
              previousRankRef.current = currentRank;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [sessionState.playerName, settings?.notifications?.leaderboardUpdates, addNotification]);

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
              onClick={() => navigate('/network')}
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
                className="text-primary font-headline font-black italic tracking-tighter text-4xl cursor-pointer"
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
                {loading ? (
                  <div className="py-8 text-center text-on-surface-muted font-mono uppercase tracking-widest text-xs">
                    ACCESSING REGISTRY...
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center border border-dashed border-border/50 bg-surface-dim/30">
                    <span className="material-symbols-outlined text-4xl text-on-surface-muted mb-4">search_off</span>
                    <h3 className="text-white font-headline font-bold text-xl uppercase mb-2">NO RECORDS FOUND</h3>
                    <p className="text-on-surface-muted font-mono text-xs max-w-md text-center">
                      The leaderboard is currently empty. Play your first case to enter the leaderboard and establish your operative ranking.
                    </p>
                    <button 
                      onClick={() => navigate('/investigation')}
                      className="mt-6 px-6 py-2 bg-secondary text-white font-bold text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(161,0,255,0.3)] hover:bg-secondary/90"
                    >
                      BEGIN INVESTIGATION
                    </button>
                  </div>
                ) : (
                  leaderboardData.map((player, index) => {
                    const isActiveUser = sessionState?.playerName === player.player_name;
                    const rank = (index + 1).toString().padStart(2, '0');
                    const score = (player.score || 0).toLocaleString('en-US');
                    const acc = `${(player.accuracy || 100).toFixed(1)}%`;
                    const resp = `${((player.average_response_time_ms || 1200) / 1000).toFixed(1)}s`;
                    const prev = player.fraud_prevented 
                      ? `$${(player.fraud_prevented / 1000000).toFixed(1)}M`
                      : '$0.0M';

                    if (isActiveUser) {
                      return (
                        <Link to="/performance-report" key={player.player_name}>
                          <div className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-primary/5 border border-primary relative shadow-[0_0_20px_rgba(226,27,35,0.15)] group cursor-pointer hover:bg-primary/10 transition-colors my-2">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-[0_0_10px_#E21B23]"></div>
                            <div className="font-headline font-black italic text-3xl text-primary pl-2">{rank}</div>
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-primary border border-primary p-1.5">person</span>
                              <div>
                                <div className="text-white font-bold text-sm mb-0.5 group-hover:text-primary transition-colors">You ({player.player_name})</div>
                                <div className="font-mono text-[8px] tracking-widest uppercase text-white font-bold">ACTIVE SESSION</div>
                              </div>
                            </div>
                            <div className="text-right font-mono text-tertiary font-bold">{score}</div>
                            <div className="text-right font-mono text-white text-xs font-bold">{acc}</div>
                            <div className="text-right font-mono text-white text-xs font-bold">{resp}</div>
                            <div className="text-right font-mono text-white text-xs font-bold">{prev}</div>
                            
                            {/* Glowing crosshair line */}
                            <div className="absolute top-1/2 left-0 w-[150vw] h-[1px] bg-primary/30 pointer-events-none -translate-y-1/2 z-[-1] -translate-x-[20vw]"></div>
                          </div>
                        </Link>
                      );
                    }

                    return (
                      <div key={player.player_name} className="grid grid-cols-[100px_1fr_120px_120px_120px_150px] gap-4 px-6 py-5 items-center bg-surface-dim/50 border-b border-border/50 hover:bg-surface-dim transition-colors">
                        <div className="font-headline font-black italic text-3xl text-secondary">{rank}</div>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 border border-secondary/30">sports_esports</span>
                          <div>
                            <div className="text-white font-bold text-sm mb-0.5 flex items-center gap-2">{player.player_name}</div>
                            <div className="font-mono text-[8px] tracking-widest uppercase text-on-surface-muted">OPERATIVE</div>
                          </div>
                        </div>
                        <div className="text-right font-mono text-tertiary font-bold">{score}</div>
                        <div className="text-right font-mono text-white text-xs">{acc}</div>
                        <div className="text-right font-mono text-white text-xs">{resp}</div>
                        <div className="text-right font-mono text-white text-xs">{prev}</div>
                      </div>
                    );
                  })
                )}
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
