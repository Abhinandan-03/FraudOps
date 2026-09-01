import React, { useEffect, useState } from 'react';

export default function NotificationToast({ notification, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // Wait for transition
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const typeStyles = {
    achievement: 'border-tertiary bg-tertiary/10 text-tertiary shadow-[0_0_15px_rgba(0,245,255,0.3)]',
    threat: 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(226,27,35,0.3)]',
    leaderboard: 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_15px_rgba(161,0,255,0.3)]',
    default: 'border-border bg-surface-dim text-white'
  };

  const icons = {
    achievement: 'emoji_events',
    threat: 'warning',
    leaderboard: 'trending_up',
    default: 'notifications'
  };

  return (
    <div className={`pointer-events-auto flex items-start gap-4 p-4 border w-80 backdrop-blur-md transition-all duration-300 ${typeStyles[notification.type] || typeStyles.default} ${isClosing ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
      <span className="material-symbols-outlined text-2xl shrink-0">
        {icons[notification.type] || icons.default}
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-headline font-bold uppercase tracking-widest text-sm">
          {notification.title}
        </span>
        <span className="font-mono text-[10px] uppercase text-white/80">
          {notification.message}
        </span>
      </div>
      <button onClick={() => { setIsClosing(true); setTimeout(onClose, 300); }} className="ml-auto opacity-50 hover:opacity-100">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}
