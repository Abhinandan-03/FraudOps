import React from 'react';

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0 group cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="flex flex-col gap-1 pr-6">
        <span className="font-headline font-bold text-sm uppercase text-white group-hover:text-primary transition-colors">{label}</span>
        {description && (
          <span className="font-mono text-[10px] text-on-surface-muted leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <div className="pt-1 relative flex-shrink-0">
        <div className={`w-10 h-5 border flex items-center p-0.5 transition-colors ${
          checked ? 'bg-primary/20 border-primary' : 'bg-surface-dim border-border'
        }`}>
          <div className={`w-3.5 h-3.5 bg-white transition-transform duration-300 ease-out ${
            checked ? 'transform translate-x-5 shadow-[0_0_10px_rgba(226,27,35,0.8)]' : 'bg-on-surface-muted'
          }`}></div>
        </div>
      </div>
    </div>
  );
}
