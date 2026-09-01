import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import Alerts from './pages/Alerts';
import SessionSetup from './pages/SessionSetup';
import Leaderboard from './pages/Leaderboard';
import PerformanceReport from './pages/PerformanceReport';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Success from './pages/Success';
import Failure from './pages/Failure';
import MilesSuccessAnimation from './components/MilesSuccessAnimation';
import SpiderSwarmFailureAnimation from './components/SpiderSwarmFailureAnimation';
import ProfileSettings from './pages/ProfileSettings';
import Network from './pages/Network';
import MultiplayerEntry from './pages/MultiplayerEntry';
import MultiplayerRoom from './pages/MultiplayerRoom';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './contexts/ThemeContext';
import { useSettings } from './contexts/SettingsContext';

export default function App() {
  const { 
    isSuccessAnimationActive, 
    handleSuccessAnimationComplete,
    isFailureAnimationActive,
    handleFailureAnimationComplete,
    animationConfig
  } = useTheme();
  
  const { settings } = useSettings();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/session-setup" element={<SessionSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/investigation" element={<Investigation />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/performance-report" element={<PerformanceReport />} />
          <Route path="/network" element={<Network />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/multiplayer" element={<MultiplayerEntry />} />
          <Route path="/multiplayer/:roomCode" element={<MultiplayerRoom />} />
        </Route>
      </Routes>

      {/* Miles Success Overlay Animation */}
      {settings.animationsEnabled && (
        <MilesSuccessAnimation 
          isActive={isSuccessAnimationActive} 
          onComplete={handleSuccessAnimationComplete}
          points={animationConfig?.points ?? 100}
          title={animationConfig?.title ?? "CORRECT DECISION"}
          subtitle={animationConfig?.subtitle ?? "THREAT NEUTRALIZED"}
        />
      )}

      {/* Spider Swarm Failure Overlay Animation */}
      {settings.animationsEnabled && (
        <SpiderSwarmFailureAnimation 
          isActive={isFailureAnimationActive} 
          onComplete={handleFailureAnimationComplete}
          points={animationConfig?.points ?? -150}
          title={animationConfig?.title ?? "INCORRECT DECISION"}
        />
      )}
    </Router>
  );
}
