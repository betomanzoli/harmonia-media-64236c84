

/**
 * Formats time in seconds to MM:SS format
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Calculates the maximum slider value based on duration and preview duration
 */
export const calculateMaxSliderValue = (
  duration: number, 
  previewDuration?: number
): number => {
  return previewDuration ? Math.min(duration, previewDuration) : duration;
};
