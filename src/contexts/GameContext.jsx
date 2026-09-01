import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import fraudOpsApi from '../services/fraudOpsApi';
import { useTheme } from './ThemeContext';
import { useNotification } from './NotificationContext';
import { useSettings } from './SettingsContext';
import { playBackgroundMusic, stopBackgroundMusic, setGameActive } from '../utils/audio';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { triggerSuccessAnimation, triggerFailureAnimation, handleNextCase } = useTheme();
  const { addNotification } = useNotification();
  const { settings } = useSettings();

  const [currentCase, setCurrentCase] = useState(null);
  const [sessionState, setSessionState] = useState({
    score: 0,
    streak: 0,
    difficulty: 'ELITE',
    cryoTokens: 3,
    casesCompleted: 0,
    detectionAccuracy: 100.0,
    falsePositiveRate: 0.0,
    avgResponseTime: 1.2,
    fraudPrevented: 0,
    playerName: (typeof window !== 'undefined' ? localStorage.getItem('fraudOps_currentPlayer') : null) || "Operative_X",
    activeCaseId: null,
    outcomes: []
  });

  const [lastResult, setLastResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCase, setIsLoadingCase] = useState(true);
  const [error, setError] = useState(null);

  const caseStartTimeRef = useRef(null);
  const isSubmittingRef = useRef(false);

  // Load initial case and session state on mount
  useEffect(() => {
    caseStartTimeRef.current = Date.now();
    let isMounted = true;

    async function loadInitialData() {
      setIsLoadingCase(true);
      setError(null);
      try {
        const [session, caseData] = await Promise.all([
          fraudOpsApi.getSessionState(),
          fraudOpsApi.getNextCase('ELITE')
        ]);

        if (isMounted) {
          if (session) setSessionState(session);
          if (caseData) {
            setCurrentCase(caseData);
            caseStartTimeRef.current = Date.now();
            
            // Threat Intel Radar Check
            if (settings?.notifications?.suspiciousActivity && (caseData.threatLevel === 'CRITICAL' || caseData.threatLevel === 'CRITICAL THREAT LEVEL')) {
              addNotification('threat', 'THREAT INTEL RADAR', `Velocity spike detected on network node. Proceed with extreme caution.`);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing GameContext:', err);
        if (isMounted) setError(err.message || 'Failed to load case data');
      } finally {
        if (isMounted) setIsLoadingCase(false);
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Submit an operative decision on the current case to the backend
   */
  const submitAction = useCallback(async (action) => {
    if (isSubmittingRef.current || !currentCase) {
      return null;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    const startTime = caseStartTimeRef.current || (Date.now() - 1200);
    const elapsedMs = Date.now() - startTime;
    const responseTime = Math.max(0.4, Number((elapsedMs / 1000).toFixed(1)));

    try {
      // Backend is single source of truth for evaluation outcome & scoring
      const result = await fraudOpsApi.submitDecision(currentCase.id, action, { responseTime });

      // Update session metrics from backend outcome
      setSessionState((prev) => {
        const newOutcomes = [...(prev.outcomes || []), {
          caseId: currentCase.id,
          action,
          correct: result.correct,
          points: result.points,
          responseTime,
          fraudPrevented: result.correct && currentCase.groundTruth?.fraudAmount ? currentCase.groundTruth.fraudAmount : 0
        }];
        
        return {
          ...prev,
          score: result.totalScore !== undefined ? result.totalScore : Math.max(0, prev.score + result.points),
          streak: result.streak !== undefined ? result.streak : (result.correct ? prev.streak + 1 : 0),
          casesCompleted: prev.casesCompleted + 1,
          fraudPrevented: result.correct && currentCase.groundTruth?.fraudAmount 
            ? prev.fraudPrevented + currentCase.groundTruth.fraudAmount 
            : prev.fraudPrevented,
          outcomes: newOutcomes
        };
      });

      setLastResult(result);

      // Trigger animations according to backend response
      if (result.correct) {
        triggerSuccessAnimation({
          points: result.points,
          title: 'CORRECT DECISION',
          subtitle: result.outcome ? result.outcome.toUpperCase() : 'THREAT NEUTRALIZED'
        });
      } else {
        triggerFailureAnimation({
          points: result.points,
          title: 'INCORRECT DECISION',
          subtitle: result.outcome ? result.outcome.toUpperCase() : 'SYSTEM BREACH DETECTED'
        });
      }

      // Achievement Unlock Check (every 5 streak)
      const newStreak = result.streak !== undefined ? result.streak : (result.correct ? sessionState.streak + 1 : 0);
      if (settings?.notifications?.achievements && newStreak > 0 && newStreak % 5 === 0) {
        addNotification('achievement', 'ACHIEVEMENT UNLOCKED', `Flawless streak x${newStreak} reached! Operational clearance elevated.`);
      }

      return result;
    } catch (err) {
      console.error('Error submitting decision:', err);
      setError(err.message || 'Error submitting decision to backend');
      return null;
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [currentCase, triggerSuccessAnimation, triggerFailureAnimation]);

  /**
   * Advance to the next case (called explicitly from NEXT CASE / NEXT EVENT)
   */
  const advanceToNextCase = useCallback(async () => {
    // 1. Fade out active music & reset theme state
    handleNextCase();

    // 2. Clear previous result & start loader
    setLastResult(null);
    setIsLoadingCase(true);
    setError(null);

    try {
      const nextCaseData = await fraudOpsApi.getNextCase(sessionState.difficulty || 'ELITE');
      setCurrentCase(nextCaseData);
      caseStartTimeRef.current = Date.now();
      
      // Threat Intel Radar Check
      if (settings?.notifications?.suspiciousActivity && (nextCaseData.threatLevel === 'CRITICAL' || nextCaseData.threatLevel === 'CRITICAL THREAT LEVEL')) {
        addNotification('threat', 'THREAT INTEL RADAR', `Velocity spike detected on network node. Proceed with extreme caution.`);
      }
      
      return nextCaseData;
    } catch (err) {
      console.error('Error fetching next case:', err);
      setError(err.message || 'Failed to retrieve next case');
      return null;
    } finally {
      setIsLoadingCase(false);
    }
  }, [handleNextCase, sessionState.difficulty]);

  /**
   * Start or reset a game session
   */
  const startNewSession = useCallback(async (config = {}) => {
    handleNextCase();
    setLastResult(null);
    setIsLoadingCase(true);
    setError(null);

    try {
      const newSession = await fraudOpsApi.initSession(config);
      setSessionState(newSession);

      const firstCase = await fraudOpsApi.getNextCase(config.difficulty || 'ELITE');
      setCurrentCase(firstCase);
      caseStartTimeRef.current = Date.now();
      return { session: newSession, firstCase };
    } catch (err) {
      console.error('Error starting new session:', err);
      setError(err.message || 'Failed to start new session');
      return null;
    } finally {
      setIsLoadingCase(false);
    }
  }, [handleNextCase]);

  /**
   * Complete the session and submit results to leaderboard
   */
  const completeSession = useCallback(async () => {
    if (!sessionState.outcomes || sessionState.outcomes.length === 0) return;
    
    // Use stored session ID or fallback to a local mock ID
    const sessionId = sessionState.sessionId || sessionState.activeCaseId || "MOCK_SESSION_" + Date.now();
    
    try {
      await fraudOpsApi.submitSessionResult({
        session_id: sessionId,
        player_name: sessionState.playerName,
        outcomes: sessionState.outcomes,
        difficulty: sessionState.difficulty || 'ELITE'
      });
    } catch (err) {
      console.error('Error submitting session to leaderboard:', err);
    }
  }, [sessionState]);

  return (
    <GameContext.Provider value={{
      currentCase,
      sessionState,
      lastResult,
      isSubmitting,
      isLoadingCase,
      error,
      submitAction,
      advanceToNextCase,
      startNewSession,
      completeSession
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
