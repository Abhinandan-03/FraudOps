import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { THEME_STATES } from './themeConstants';
import { stopMusic } from '../utils/audio';

export { THEME_STATES };

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [appState, setAppState] = useState(THEME_STATES.MILES_NORMAL);
  const [isSuccessAnimationActive, setIsSuccessAnimationActive] = useState(false);
  const [isFailureAnimationActive, setIsFailureAnimationActive] = useState(false);
  const [animationConfig, setAnimationConfig] = useState({
    points: 100,
    title: 'CORRECT DECISION',
    subtitle: 'THREAT NEUTRALIZED'
  });

  useEffect(() => {
    document.body.setAttribute('data-app-state', appState);
  }, [appState]);

  const triggerSuccessAnimation = useCallback((customConfig = {}) => {
    if (!isSuccessAnimationActive && !isFailureAnimationActive) {
      setAnimationConfig({
        points: customConfig.points !== undefined ? customConfig.points : 100,
        title: customConfig.title || 'CORRECT DECISION',
        subtitle: customConfig.subtitle || 'THREAT NEUTRALIZED'
      });
      setIsSuccessAnimationActive(true);
    }
  }, [isSuccessAnimationActive, isFailureAnimationActive]);

  const handleSuccessAnimationComplete = useCallback(() => {
    setIsSuccessAnimationActive(false);
  }, []);

  const triggerFailureAnimation = useCallback((customConfig = {}) => {
    if (!isFailureAnimationActive && !isSuccessAnimationActive) {
      setAnimationConfig({
        points: customConfig.points !== undefined ? customConfig.points : -150,
        title: customConfig.title || 'INCORRECT DECISION',
        subtitle: customConfig.subtitle || 'SYSTEM BREACH DETECTED'
      });
      setIsFailureAnimationActive(true);
    }
  }, [isFailureAnimationActive, isSuccessAnimationActive]);

  const handleFailureAnimationComplete = useCallback(() => {
    setIsFailureAnimationActive(false);
  }, []);

  const handleNextCase = useCallback(() => {
    stopMusic(800);
    setAppState(THEME_STATES.MILES_NORMAL);
    setIsSuccessAnimationActive(false);
    setIsFailureAnimationActive(false);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      appState, 
      setAppState,
      isSuccessAnimationActive,
      triggerSuccessAnimation,
      handleSuccessAnimationComplete,
      isFailureAnimationActive,
      triggerFailureAnimation,
      handleFailureAnimationComplete,
      animationConfig,
      handleNextCase,
      stopMusic
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
