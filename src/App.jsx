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
    handleSuccessAnimationComplete,
    isFailureAnimationActive,
    handleFailureAnimationComplete,
    animationConfig
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
        points={animationConfig?.points ?? 100}
        title={animationConfig?.title ?? "CORRECT DECISION"}
        subtitle={animationConfig?.subtitle ?? "THREAT NEUTRALIZED"}
      />

      {/* Spider Swarm Failure Overlay Animation */}
      <SpiderSwarmFailureAnimation 
        isActive={isFailureAnimationActive} 
        onComplete={handleFailureAnimationComplete}
        points={animationConfig?.points ?? -150}
        title={animationConfig?.title ?? "INCORRECT DECISION"}
      />
    </Router>
  );
}

export default App;
