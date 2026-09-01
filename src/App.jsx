import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import Alerts from './pages/Alerts';
import SessionSetup from './pages/SessionSetup';
import Leaderboard from './pages/Leaderboard';
import PerformanceReport from './pages/PerformanceReport';
import Login from './pages/Login';
import Success from './pages/Success';
import Failure from './pages/Failure';
import MilesSuccessAnimation from './components/MilesSuccessAnimation';
import SpiderSwarmFailureAnimation from './components/SpiderSwarmFailureAnimation';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { 
    isSuccessAnimationActive, 
    triggerSuccessAnimation, 
    handleSuccessAnimationComplete,
    isFailureAnimationActive,
    triggerFailureAnimation,
    handleFailureAnimationComplete,
    handleNextCase
  } = useTheme();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/session-setup" element={<SessionSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/investigation" element={<Investigation />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/performance-report" element={<PerformanceReport />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
      </Routes>

      {/* Miles Success Overlay Animation */}
      <MilesSuccessAnimation 
        isActive={isSuccessAnimationActive} 
        onComplete={handleSuccessAnimationComplete} 
      />

      {/* Spider Swarm Failure Overlay Animation */}
      <SpiderSwarmFailureAnimation 
        isActive={isFailureAnimationActive} 
        onComplete={handleFailureAnimationComplete} 
      />

      {/* Temporary Dev Triggers */}
      <div className="fixed bottom-16 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={triggerSuccessAnimation}
          disabled={isSuccessAnimationActive || isFailureAnimationActive}
          className="bg-primary/90 hover:bg-primary text-white font-mono text-xs font-bold px-4 py-2 border border-white/20 shadow-[0_0_20px_rgba(226,27,35,0.6)] uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          title="Trigger Miles Morales correct response animation (+100)"
        >
          <span className="material-symbols-outlined text-sm text-yellow-300">bolt</span>
          TEST CORRECT
        </button>

        <button
          onClick={triggerFailureAnimation}
          disabled={isSuccessAnimationActive || isFailureAnimationActive}
          className="bg-secondary/90 hover:bg-secondary text-white font-mono text-xs font-bold px-4 py-2 border border-secondary shadow-[0_0_20px_rgba(161,0,255,0.6)] uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
          title="Trigger Spider Swarm incorrect response animation (-150)"
        >
          <span className="material-symbols-outlined text-sm text-red-400">pest_control</span>
          TEST WRONG
        </button>

        <button
          onClick={handleNextCase}
          className="bg-surface border border-tertiary/60 text-tertiary hover:bg-tertiary/10 font-mono text-xs font-bold px-4 py-2 shadow-[0_0_15px_rgba(0,245,255,0.4)] uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          title="Simulate advancing to next case (fades out active theme music)"
        >
          <span className="material-symbols-outlined text-sm">skip_next</span>
          NEXT CASE (STOP AUDIO)
        </button>
      </div>
    </Router>
  );
}

export default App;


