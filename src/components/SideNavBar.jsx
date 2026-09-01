import { Link, useLocation } from 'react-router-dom';

export default function SideNavBar() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClasses = (activePath) => {
    return path === activePath
      ? "bg-secondary-container text-on-secondary-container border-l-4 border-secondary font-bold hover:bg-surface-variant/20 hover:translate-x-1 transition-all active:scale-95 duration-75 flex items-center gap-3 px-4 py-3"
      : "text-on-surface-variant hover:text-secondary hover:bg-surface-variant/20 hover:translate-x-1 transition-all active:scale-95 duration-75 flex items-center gap-3 px-4 py-3 border-l-4 border-transparent";
  };

  return (
    <div className="hidden md:flex flex-col justify-between py-6 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-dim/80 dark:bg-surface-dim/80 backdrop-blur-2xl border-r border-outline-variant/10 shadow-xl z-40">
      <div>
        <div className="px-6 pb-6 border-b border-outline-variant/10 mb-4">
          <span className="font-headline-lg text-headline-lg text-secondary block mb-1">NODE_01</span>
          <span className="font-label-sm text-label-sm text-secondary-container tracking-widest uppercase">OPERATIONAL</span>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
            <span className="material-symbols-outlined">radar</span>
            <span className="font-label-md text-label-md">Live Stream</span>
          </Link>
          <Link to="/investigation" className={getLinkClasses("/investigation")}>
            <span className="material-symbols-outlined">query_stats</span>
            <span className="font-label-md text-label-md">Analysis</span>
          </Link>
          <Link to="/performance-report" className={getLinkClasses("/performance-report")}>
            <span className="material-symbols-outlined">history</span>
            <span className="font-label-md text-label-md">Archive</span>
          </Link>
          <Link to="/leaderboard" className={getLinkClasses("/leaderboard")}>
            <span className="material-symbols-outlined">hub</span>
            <span className="font-label-md text-label-md">Network</span>
          </Link>
        </nav>
      </div>
      <div className="px-4 flex flex-col gap-4">
        <button className="w-full bg-primary-container text-white font-label-md text-label-md py-3 rounded-none uppercase glitch-hover active:skew-x-[-2deg]">
          DEPLOY COUNTERMEASURE
        </button>
        <div className="flex justify-around border-t border-outline-variant/10 pt-4">
          <Link to="/session-setup" className="text-on-surface-variant hover:text-secondary transition-colors p-2">
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <button className="text-on-surface-variant hover:text-secondary transition-colors p-2">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </div>
    </div>
  );
}
