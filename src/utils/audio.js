/**
 * FraudOps Audio Manager
 * 
 * Uses exact local audio tracks:
 * - /audio/miles-success.mp3 (Miles Theme -> CORRECT decision)
 * - /audio/black_suit_theme.mp3 (Prowler Theme -> WRONG decision)
 * 
 * Behavior:
 * - Music starts during the response sequence
 * - Continues playing seamlessly after the animation finishes
 * - Fades out and stops cleanly when the player advances / clicks NEXT CASE
 * - No music during normal gameplay or suspicious activity
 */

let currentAudio = null;
let fadeInterval = null;

export const AUDIO_TRACKS = {
  MILES_CORRECT: '/audio/miles-success.mp3',
  PROWLER_WRONG: '/audio/black_suit_theme.mp3',
};

/**
 * Play a specific music track with optional volume and loop settings
 */
export function playMusic(trackUrl, { loop = true, volume = 0.85 } = {}) {
  // If a track is already playing the same URL and active, keep playing
  if (currentAudio && !currentAudio.paused && currentAudio.src.includes(trackUrl)) {
    return currentAudio;
  }

  // Clear any existing fade
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  // Stop previous audio immediately
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // Ignore
    }
  }

  try {
    const audio = new Audio(trackUrl);
    audio.loop = loop;
    audio.volume = volume;
    currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(`Audio playback error for ${trackUrl}:`, err);
      });
    }
    return audio;
  } catch (err) {
    console.warn(`Failed to initialize audio for ${trackUrl}:`, err);
    return null;
  }
}

/**
 * Play Miles theme on Correct Decision
 */
export function playMilesSuccessMusic() {
  return playMusic(AUDIO_TRACKS.MILES_CORRECT, { loop: true, volume: 0.85 });
}

/**
 * Play Prowler theme on Wrong Decision
 */
export function playProwlerFailureMusic() {
  return playMusic(AUDIO_TRACKS.PROWLER_WRONG, { loop: true, volume: 0.85 });
}

/**
 * Fades out the currently playing music smoothly and stops it.
 */
export function stopMusic(fadeDurationMs = 700) {
  if (!currentAudio || currentAudio.paused) {
    currentAudio = null;
    return;
  }

  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }

  const audioToStop = currentAudio;
  const initialVolume = audioToStop.volume;
  const stepMs = 50;
  const steps = Math.max(1, Math.floor(fadeDurationMs / stepMs));
  const volumeStep = initialVolume / steps;

  fadeInterval = setInterval(() => {
    if (!audioToStop) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      return;
    }

    if (audioToStop.volume > volumeStep) {
      audioToStop.volume = Math.max(0, audioToStop.volume - volumeStep);
    } else {
      clearInterval(fadeInterval);
      fadeInterval = null;
      audioToStop.volume = 0;
      audioToStop.pause();
      audioToStop.currentTime = 0;
      if (currentAudio === audioToStop) {
        currentAudio = null;
      }
    }
  }, stepMs);
}

/**
 * Check if music is currently actively playing
 */
export function isMusicPlaying() {
  return currentAudio !== null && !currentAudio.paused;
}
