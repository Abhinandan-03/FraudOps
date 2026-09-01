import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AbortModal from '../components/AbortModal';
import { logoutUser } from '../utils/auth';

export default function MultiplayerLobby({ mp, roomCode, playerId }) {
  const navigate = useNavigate();
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const { roomState, setReady, startGame } = mp;
  const isHost = roomState?.host_id === playerId;
  const me = roomState?.players.find(p => p.id === playerId);
  const allReady = roomState?.players.every(p => p.ready || p.id === roomState.host_id); // Host doesn't need to be "ready" technically, or everyone does

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden text-white font-mono">
      <div className="absolute inset-0 opacity-10 pointer-events-none wireframe-bg"></div>
      
      <div className="w-full max-w-2xl bg-surface-dim border border-border p-8 relative z-10 shadow-2xl flex flex-col gap-6">
        
        <div className="text-center mb-4">
          <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-2 text-glitch">
            FRAUDOPS MULTIPLAYER
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="text-on-surface-muted uppercase text-xs">ROOM CODE:</span>
            <span className="bg-surface border border-primary text-primary px-4 py-1 text-xl font-bold tracking-[0.2em] shadow-[0_0_10px_rgba(226,27,35,0.2)]">
              {roomCode}
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border p-4">
          <div className="text-[10px] text-on-surface-muted uppercase mb-4 tracking-widest border-b border-border pb-2">
            OPERATIVES IN SESSION ({roomState?.players.length}/4)
          </div>
          
          <div className="flex flex-col gap-2">
            {roomState?.players.map((p) => (
              <div key={p.id} className={`flex justify-between items-center p-3 border ${p.id === playerId ? 'border-secondary bg-secondary/10' : 'border-border bg-background'}`}>
                <div className="flex items-center gap-3">
                  {p.id === roomState.host_id && <span className="material-symbols-outlined text-tertiary text-sm" title="Host">star</span>}
                  {!p.connected && <span className="material-symbols-outlined text-primary text-sm" title="Disconnected">wifi_off</span>}
                  <span className="font-bold uppercase text-sm">{p.name} {p.id === playerId ? '(YOU)' : ''}</span>
                </div>
                <div>
                  {p.id === roomState.host_id ? (
                    <span className="text-[10px] text-tertiary font-bold tracking-widest">HOST</span>
                  ) : p.ready ? (
                    <span className="text-[10px] text-secondary font-bold tracking-widest">READY</span>
                  ) : (
                    <span className="text-[10px] text-on-surface-muted font-bold tracking-widest">WAITING</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          {!isHost && (
            <button
              onClick={() => setReady(!me?.ready)}
              className={`flex-1 py-4 font-headline font-bold italic text-lg transition-all uppercase tracking-tight skew-container relative ${
                me?.ready 
                  ? 'bg-transparent border border-border text-on-surface-muted hover:border-secondary hover:text-white'
                  : 'bg-secondary hover:bg-white text-white hover:text-black shadow-[0_0_15px_rgba(161,0,255,0.4)]'
              }`}
            >
              <span className="unskew-content block">
                {me?.ready ? 'CANCEL READY' : 'MARK AS READY'}
              </span>
            </button>
          )}

          {isHost && (
            <button
              onClick={startGame}
              disabled={!allReady}
              className={`flex-1 py-4 font-headline font-bold italic text-lg transition-all uppercase tracking-tight skew-container relative ${
                allReady
                  ? 'bg-primary hover:bg-white text-white hover:text-black shadow-[0_0_20px_rgba(226,27,35,0.5)]'
                  : 'bg-surface border border-border text-on-surface-muted cursor-not-allowed'
              }`}
            >
              <span className="unskew-content block">
                {allReady ? 'COMMENCE OPERATION' : 'WAITING FOR TEAM...'}
              </span>
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsAbortModalOpen(true)} 
          className="mt-2 font-mono text-[10px] text-on-surface-muted hover:text-white uppercase transition-colors text-center w-full"
        >
          ABORT & RETURN TO DASHBOARD
        </button>

      </div>
      
      <AbortModal 
        isOpen={isAbortModalOpen} 
        onCancel={() => setIsAbortModalOpen(false)} 
        onAbort={() => logoutUser(navigate, mp)} 
      />
    </div>
  );
}
