import { createContext, useContext, useState, useEffect } from 'react';
import { setBgMusicEnabled, setSoundEffectsEnabled, setAudioMuted } from '../utils/audio';

const SettingsContext = createContext();

export const defaultSettings = {
  theme: 'system', // 'miles', 'prowler', 'system'
  brightness: 100, // 0 to 100
  reduceMotion: false,
  animationsEnabled: true,
  bgMusicEnabled: true,
  soundEnabled: true,
  confirmBeforeFreeze: true,
  autoAdvance: false,
  notifications: {
    suspiciousActivity: true,
    caseCompletion: true,
    leaderboardUpdates: false,
    achievements: true
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const local = localStorage.getItem('fraudOps_settings');
      let loaded = local ? JSON.parse(local) : defaultSettings;
      loaded.brightness = Math.min(100, Math.max(30, loaded.brightness || 100));
      if (loaded.bgMusicEnabled === undefined) loaded.bgMusicEnabled = true;
      return loaded;
    } catch {
      return defaultSettings;
    }
  });

  // Apply theme and other dynamic settings globally
  useEffect(() => {
    localStorage.setItem('fraudOps_settings', JSON.stringify(settings));
    
    // Apply brightness dynamically to documentElement so it affects all views & modals
    document.documentElement.style.filter = `brightness(${settings.brightness}%)`;
    
    // Resolve effective theme
    const applyTheme = () => {
      let resolvedTheme = settings.theme;
      if (settings.theme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = prefersDark ? 'miles' : 'miles'; // In FraudOps cyber aesthetic, miles is default dark
      }
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.body.setAttribute('data-theme', resolvedTheme);
      document.body.setAttribute('data-user-theme', settings.theme);
    };

    applyTheme();

    // Listen for system theme changes if 'system' is selected
    let mediaQuery = null;
    const handleSystemChange = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemChange);
    }

    // Apply reduced motion
    if (settings.reduceMotion) {
      document.body.setAttribute('data-reduce-motion', 'true');
    } else {
      document.body.removeAttribute('data-reduce-motion');
    }

    // Apply audio protocols & background music controls
    setBgMusicEnabled(settings.bgMusicEnabled !== false);
    setSoundEffectsEnabled(settings.soundEnabled !== false);

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      }
    };
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotification = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      updateNotification,
      resetToDefault,
      setSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
