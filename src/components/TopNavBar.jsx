import { Link } from 'react-router-dom';

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container/70 dark:bg-surface-container-low/70 backdrop-blur-xl border-b border-outline-variant/10 shadow-[0_0_20px_rgba(226,27,35,0.15)] z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary-container tracking-tighter uppercase italic">
          FRAUDOPS
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-on-surface-variant">SCORE</span>
            <span className="font-headline-lg text-headline-lg text-primary">1,240</span>
          </div>
          <div className="flex flex-col items-end border-l border-outline-variant/30 pl-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant">STREAK</span>
            <span className="font-headline-lg text-headline-lg text-secondary">x3</span>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="glass-panel px-3 py-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
            <span className="font-label-md text-label-md">02</span>
          </div>
          <div className="glass-panel px-3 py-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <span className="font-label-md text-label-md">05</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-primary dark:text-primary">
          <button className="hover:bg-primary/10 transition-all duration-150 p-2 rounded-full active:skew-x-[-2deg]">
            <span className="material-symbols-outlined">query_stats</span>
          </button>
          <button className="hover:bg-primary/10 transition-all duration-150 p-2 rounded-full active:skew-x-[-2deg]">
            <span className="material-symbols-outlined">stadium</span>
          </button>
          <button className="hover:bg-primary/10 transition-all duration-150 p-2 rounded-full active:skew-x-[-2deg]">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
          <img alt="Operator Profile" className="w-8 h-8 rounded-full border border-primary/50 object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3VKLv5oh9ahWn2egMexOpY4Ptl-MEdstvnZFrgujymZkPM-SUZ4ZzWPU4_DhIY08X5QlXQzo46JDvc7waWNL0PGsb16C09gej4MAl0n-xAs72HPcG3vcSLuzavZq0kdIi1Sl8CwgAbLqp-XXSl7WAZzs7JQuYLBCFG0WEjL1TG0dUMjhe6QB9W0AxS69uVc1ehAUlDtulb-dEERqbSJs_CbDwO7M27nOsk4FwwXp7Z1XEFm4CvvZdRA"/>
        </div>
      </div>
    </nav>
  );
}
