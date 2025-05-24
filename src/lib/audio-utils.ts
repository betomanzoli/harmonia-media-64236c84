
/**
 * Format seconds to mm:ss format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (mm:ss)
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) {
    return '00:00';
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Calculate percentage based on current value and max value
 * @param current - Current value
 * @param max - Maximum value
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (current: number, max: number): number => {
  if (max === 0 || isNaN(max) || isNaN(current)) {
    return 0;
  }
  return (current / max) * 100;
};

/**
 * Convert percentage to seconds based on total duration
 * @param percentage - Percentage value (0-100)
 * @param duration - Total duration in seconds
 * @returns Seconds value
 */
export const percentageToSeconds = (percentage: number, duration: number): number => {
  return (percentage / 100) * duration;
};

/**
 * Create an audio fade effect (fade in or fade out)
 * @param audioElement - HTML Audio Element
 * @param fadeType - 'in' for fade in, 'out' for fade out
 * @param durationMs - Duration of fade effect in milliseconds
 */
export const fadeAudio = (
  audioElement: HTMLAudioElement, 
  fadeType: 'in' | 'out', 
  durationMs: number = 1000
): void => {
  if (!audioElement) return;
  
  const startVolume = fadeType === 'in' ? 0 : audioElement.volume;
  const targetVolume = fadeType === 'in' ? 1 : 0;
  const startTime = performance.now();
  
  const fadeInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    
    if (progress >= 1) {
      audioElement.volume = targetVolume;
      clearInterval(fadeInterval);
      return;
    }
    
    if (fadeType === 'in') {
      audioElement.volume = startVolume + progress * (targetVolume - startVolume);
    } else {
      audioElement.volume = startVolume - progress * startVolume;
    }
  }, 16); // ~60fps
};
