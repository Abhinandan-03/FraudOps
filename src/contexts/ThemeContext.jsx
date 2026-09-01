import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { THEME_STATES } from './themeConstants';
import { stopMusic } from '../utils/audio';

export { THEME_STATES };

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [appState, setAppState] = useState(THEME_STATES.MILES_NORMAL);
  const [isSuccessAnimationActive, setIsSuccessAnimationActive] = useState(false);
  const [isFailureAnimationActive, setIsFailureAnimationActive] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-app-state', appState);
  }, [appState]);

  const triggerSuccessAnimation = useCallback(() => {
    if (!isSuccessAnimationActive && !isFailureAnimationActive) {
      setIsSuccessAnimationActive(true);
    }
  }, [isSuccessAnimationActive, isFailureAnimationActive]);

  const handleSuccessAnimationComplete = useCallback(() => {
    setIsSuccessAnimationActive(false);
  }, []);

  const triggerFailureAnimation = useCallback(() => {
    if (!isFailureAnimationActive && !isSuccessAnimationActive) {
      setIsFailureAnimationActive(true);
    }
  }, [isFailureAnimationActive, isSuccessAnimationActive]);

  const handleFailureAnimationComplete = useCallback(() => {
    setIsFailureAnimationActive(false);
  }, []);

  const handleNextCase = useCallback(() => {
    stopMusic(800);
    setAppState(THEME_STATES.MILES_NORMAL);
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
      handleNextCase,
      stopMusic
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
