/**
 * FraudOps Audio Manager
 * 
 * Centralized singleton audio controller supporting:
 * - /audio/background_music.mp3 (Continuous background investigation music: Metro Boomin - Am I Dreaming Instrumental)
 * - /audio/miles-success.mp3 (Miles Theme -> CORRECT decision)
 * - /audio/black_suit_theme.mp3 (Prowler Theme -> WRONG decision)
 * 
 * Behavior:
 * - Background music plays continuously during active gameplay sessions at ambient volume (~20%).
 * - When a decision occurs, background music is paused/ducked cleanly and decision theme plays at full volume (~85%).
 * - When proceeding to NEXT CASE, decision theme fades out and background music seamlessly resumes.
 * - Respects independent toggles for Background Music and Audio Protocols in Profile Settings.
 */

export const AUDIO_TRACKS = {
  BACKGROUND_MUSIC: '/audio/background_music.mp3',
  MILES_CORRECT: '/audio/miles-success.mp3',
  PROWLER_WRONG: '/audio/black_suit_theme.mp3',
};

let bgAudio = null;
let resultAudio = null;
let resultFadeInterval = null;
let bgFadeInterval = null;

let isBgMusicEnabled = true;
let isSoundEffectsEnabled = true;
let isGameActive = false;

const BG_DEFAULT_VOLUME = 0.20;
const RESULT_DEFAULT_VOLUME = 0.85;

/**
 * Configure Background Music toggle
 */
export function setBgMusicEnabled(enabled) {
  isBgMusicEnabled = Boolean(enabled);
  if (!isBgMusicEnabled) {
    pauseBackgroundMusic();
  } else if (isGameActive && !resultAudio) {
    playBackgroundMusic();
  }
}

/**
 * Configure Sound Effects / Audio Protocols toggle
 */
export function setSoundEffectsEnabled(enabled) {
  isSoundEffectsEnabled = Boolean(enabled);
  if (!isSoundEffectsEnabled && resultAudio) {
    stopResultMusic(200);
  }
}

/**
 * Backward-compatible audio mute setter
 */
export function setAudioMuted(muted) {
  setSoundEffectsEnabled(!muted);
}

/**
 * Mark whether an active gameplay session is currently in progress
 */
export function setGameActive(active) {
  isGameActive = Boolean(active);
  if (!isGameActive) {
    stopBackgroundMusic(600);
  } else if (isBgMusicEnabled && !resultAudio) {
    playBackgroundMusic();
  }
}

/**
 * Play or resume continuous background music
 */
export function playBackgroundMusic({ volume = BG_DEFAULT_VOLUME } = {}) {
  if (!isBgMusicEnabled) {
    return null;
  }

  isGameActive = true;

  if (bgFadeInterval) {
    clearInterval(bgFadeInterval);
    bgFadeInterval = null;
  }

  if (bgAudio) {
    if (bgAudio.paused) {
      bgAudio.volume = volume;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy or user interaction needed
        });
      }
    } else {
      bgAudio.volume = volume;
    }
    return bgAudio;
  }

  try {
    const audio = new Audio(AUDIO_TRACKS.BACKGROUND_MUSIC);
    audio.loop = true;
    audio.volume = volume;
    bgAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay may be deferred until first user click
        console.info('[AudioManager] Background music autoplay pending user interaction:', err.message);
      });
    }
    return audio;
  } catch (err) {
    console.warn('[AudioManager] Failed to initialize background music:', err);
    return null;
  }
}

/**
 * Pause background music without resetting playback position
 */
export function pauseBackgroundMusic() {
  if (bgAudio && !bgAudio.paused) {
    try {
      bgAudio.pause();
    } catch {}
  }
}

/**
 * Fade out and completely stop background music
 */
export function stopBackgroundMusic(fadeDurationMs = 700) {
  if (!bgAudio) return;

  if (bgFadeInterval) {
    clearInterval(bgFadeInterval);
    bgFadeInterval = null;
  }

  const audio = bgAudio;
  const initialVol = audio.volume;
  const stepMs = 50;
  const steps = Math.max(1, Math.floor(fadeDurationMs / stepMs));
  const volStep = initialVol / steps;

  bgFadeInterval = setInterval(() => {
    if (!audio) {
      clearInterval(bgFadeInterval);
      bgFadeInterval = null;
      return;
    }

    if (audio.volume > volStep) {
      audio.volume = Math.max(0, audio.volume - volStep);
    } else {
      clearInterval(bgFadeInterval);
      bgFadeInterval = null;
      audio.volume = 0;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
      bgAudio = null;
    }
  }, stepMs);
}

/**
 * Play a specific result/decision track (Miles or Prowler)
 */
export function playResultMusic(trackUrl, { loop = true, volume = RESULT_DEFAULT_VOLUME } = {}) {
  if (!isSoundEffectsEnabled) {
    return null;
  }

  // Pause background music during decision feedback
  pauseBackgroundMusic();

  if (resultFadeInterval) {
    clearInterval(resultFadeInterval);
    resultFadeInterval = null;
  }

  if (resultAudio) {
    try {
      resultAudio.pause();
      resultAudio.currentTime = 0;
    } catch {}
  }

  try {
    const audio = new Audio(trackUrl);
    audio.loop = loop;
    audio.volume = volume;
    resultAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(`[AudioManager] Decision audio playback error for ${trackUrl}:`, err);
      });
    }
    return audio;
  } catch (err) {
    console.warn(`[AudioManager] Failed to initialize result audio for ${trackUrl}:`, err);
    return null;
  }
}

/**
 * Play Miles theme on Correct Decision
 */
export function playMilesSuccessMusic() {
  return playResultMusic(AUDIO_TRACKS.MILES_CORRECT, { loop: true, volume: RESULT_DEFAULT_VOLUME });
}

/**
 * Play Prowler theme on Wrong Decision
 */
export function playProwlerFailureMusic() {
  return playResultMusic(AUDIO_TRACKS.PROWLER_WRONG, { loop: true, volume: RESULT_DEFAULT_VOLUME });
}

/**
 * Fades out the currently playing result theme and restores background music
 */
export function stopMusic(fadeDurationMs = 700) {
  stopResultMusic(fadeDurationMs);
}

export function stopResultMusic(fadeDurationMs = 700) {
  if (resultFadeInterval) {
    clearInterval(resultFadeInterval);
    resultFadeInterval = null;
  }

  if (resultAudio && !resultAudio.paused) {
    const audioToStop = resultAudio;
    const initialVol = audioToStop.volume;
    const stepMs = 50;
    const steps = Math.max(1, Math.floor(fadeDurationMs / stepMs));
    const volStep = initialVol / steps;

    resultFadeInterval = setInterval(() => {
      if (!audioToStop) {
        clearInterval(resultFadeInterval);
        resultFadeInterval = null;
        return;
      }

      if (audioToStop.volume > volStep) {
        audioToStop.volume = Math.max(0, audioToStop.volume - volStep);
      } else {
        clearInterval(resultFadeInterval);
        resultFadeInterval = null;
        audioToStop.volume = 0;
        try {
          audioToStop.pause();
          audioToStop.currentTime = 0;
        } catch {}
        if (resultAudio === audioToStop) {
          resultAudio = null;
        }

        // Seamlessly resume background music if active
        if (isGameActive && isBgMusicEnabled) {
          playBackgroundMusic();
        }
      }
    }, stepMs);
  } else {
    resultAudio = null;
    if (isGameActive && isBgMusicEnabled) {
      playBackgroundMusic();
    }
  }
}

/**
 * Backward compatibility: generic playMusic helper
 */
export function playMusic(trackUrl, options = {}) {
  if (trackUrl === AUDIO_TRACKS.BACKGROUND_MUSIC) {
    return playBackgroundMusic(options);
  }
  return playResultMusic(trackUrl, options);
}

/**
 * Check if result music is actively playing
 */
export function isMusicPlaying() {
  return (resultAudio !== null && !resultAudio.paused) || (bgAudio !== null && !bgAudio.paused);
}
