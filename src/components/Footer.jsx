export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full flex items-center justify-between px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/90 backdrop-blur-md h-10 border-t border-outline-variant/20 z-50">
      <div className="flex items-center gap-6">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60">FRAUDOPS SYSTEM v2.4.0</span>
        <div className="hidden md:flex gap-4">
          <a className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold underline hover:text-tertiary transition-colors" href="#">Session Data</a>
          <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-tertiary transition-colors" href="#">Network Latency</a>
          <a className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 hover:text-tertiary transition-colors" href="#">Privacy Protocol</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant/60">PREVENTED:</span>
          <span className="font-label-sm text-label-sm text-tertiary">$4.2M</span>
        </div>
        <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-4">
          <span className="font-label-sm text-label-sm text-on-surface-variant/60">FP RATE:</span>
          <span className="font-label-sm text-label-sm text-secondary">1.2%</span>
        </div>
      </div>
    </footer>
  );
}
