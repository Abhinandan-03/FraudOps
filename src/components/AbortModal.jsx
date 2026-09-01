import React from 'react';
import Button from './Button';

/**
 * AbortModal displays a confirmation dialog before leaving a multiplayer game.
 */
export default function AbortModal({ isOpen, onCancel, onAbort }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <div className="bg-surface border-2 border-primary shadow-[0_0_20px_rgba(226,27,35,0.3)] max-w-md w-full p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="absolute -left-2 top-2 bottom-2 w-1 bg-primary/20"></div>
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="material-symbols-outlined text-primary text-3xl">warning</span>
            <h2 className="font-headline text-white text-xl uppercase tracking-widest font-bold">Abort Mission</h2>
          </div>
          
          <div className="font-mono text-sm text-on-surface-muted leading-relaxed uppercase tracking-wider">
            <p>Are you sure you want to abort this game?</p>
            <p className="mt-2 text-primary font-bold">Leaving the match will end the current multiplayer session and log you out.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              variant="outlineSecondary" 
              className="flex-1 py-3 text-xs" 
              onClick={onCancel}
            >
              [ CANCEL ]
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 py-3 text-xs" 
              onClick={onAbort}
            >
              [ ABORT & LOG OUT ]
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
