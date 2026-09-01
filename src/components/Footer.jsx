import { useState } from 'react';
import Button from './Button';
import { useGame } from '../contexts/GameContext';

export default function Footer({ showStats = false }) {
  const [activeModal, setActiveModal] = useState(null);
  const { sessionState } = useGame();

  const fraudPreventedFormatted = sessionState?.fraudPrevented 
    ? `$${(sessionState.fraudPrevented / 1000000).toFixed(1)}M`
    : '$0.0M';

  const renderModal = () => {
    if (!activeModal) return null;

    let content = null;
    let title = "";

    switch(activeModal) {
      case 'session':
        title = "SESSION DATA";
        content = (
          <div className="space-y-4 text-sm text-on-surface-muted leading-relaxed font-mono">
            <p><strong>OPERATIVE:</strong> <span className="text-white">{sessionState?.playerName || 'UNKNOWN'}</span></p>
            <p><strong>CURRENT SCORE:</strong> <span className="text-tertiary">{sessionState?.score || 0}</span></p>
            <p><strong>CASES COMPLETED:</strong> <span className="text-primary">{sessionState?.casesCompleted || 0}</span></p>
            <p><strong>ACCURACY:</strong> <span className="text-secondary">{sessionState?.detectionAccuracy?.toFixed(1) || '0.0'}%</span></p>
          </div>
        );
        break;
      case 'network':
        title = "NETWORK LATENCY";
        const nowMs = Date.now();
        const basePing = (nowMs % 20) + 8;
        const server2Ping = (nowMs % 40) + 60;
        const server3Ping = (nowMs % 100) + 120;
        
        content = (
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></span> ASIA-SOUTH-1 (LOCAL)</span>
              <span className="text-tertiary font-bold">{basePing}ms</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> US-EAST-1</span>
              <span className="text-white font-bold">{server3Ping}ms</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-on-surface-muted flex items-center gap-2"><span className="w-1.5 h-1.5 bg-secondary rounded-full"></span> EU-WEST-1</span>
              <span className="text-white font-bold">{server2Ping}ms</span>
            </div>
            <div className="mt-6 pt-2 text-xs text-tertiary font-bold animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full"></span> CONNECTED TO OPTIMAL NODE
            </div>
          </div>
        );
        break;
      case 'privacy':
        title = "PRIVACY PROTOCOL";
        content = <p className="text-sm text-on-surface-muted leading-relaxed">All operative metrics are end-to-end encrypted. FraudOps adheres strictly to global data protection regulations. Unauthorized access to the ops portal is strictly prohibited and logged by our internal security mainframe.</p>;
        break;
      default:
        return null;
    }
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-surface border border-border w-full max-w-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
          <div className="p-8">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <h2 className="font-headline font-bold text-2xl tracking-widest uppercase text-white">{title}</h2>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-muted hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {content}
            <div className="mt-8 flex justify-end">
              <Button variant="outlineSecondary" onClick={() => setActiveModal(null)} className="text-xs px-6 py-2 font-mono uppercase tracking-widest">ACKNOWLEDGE</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderModal()}
      <footer className="h-12 border-t border-border flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-widest text-on-surface-muted bg-background relative z-30">
        <div className="flex items-center gap-6">
          <span>FRAUDOPS SYSTEM V2.4.0</span>
          <span onClick={() => setActiveModal('session')} className="hover:text-white cursor-pointer transition-colors">SESSION DATA</span>
          <span onClick={() => setActiveModal('network')} className="hover:text-white cursor-pointer transition-colors">NETWORK LATENCY</span>
          <span onClick={() => setActiveModal('privacy')} className="hover:text-white cursor-pointer transition-colors">PRIVACY PROTOCOL</span>
        </div>
        {showStats && (
          <div className="flex gap-6">
            <span className="text-on-surface-muted">PREVENTED: <span className="text-tertiary">{fraudPreventedFormatted}</span></span>
            <span>FP RATE: <span className="text-white">{sessionState?.falsePositiveRate || 0}%</span></span>
          </div>
        )}
      </footer>
    </>
  );
}
