
import { useRef, useEffect } from 'react';
import { handlePreviewEnd } from '@/lib/audio-controls/audio-utils';

export const usePreviewTimer = ({
  isPlaying,
  currentTime,
  previewDuration,
  onPause
}: {
  isPlaying: boolean;
  currentTime: number;
  previewDuration?: number;
  onPause: () => void;
}) => {
  const previewTimerRef = useRef<number | null>(null);

  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  // Setup a new timer when isPlaying changes or when the timer is cleared
  useEffect(() => {
    if (isPlaying && previewDuration) {
      if (currentTime >= previewDuration) {
        // If current time is already past preview duration, pause immediately
        onPause();
        handlePreviewEnd();
        return;
      }

      // Clear any existing timer
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }

      // Set new timer for remaining time
      const remainingPreviewTime = Math.max(0, previewDuration - currentTime) * 1000;
      previewTimerRef.current = window.setTimeout(() => {
        onPause();
        handlePreviewEnd();
        previewTimerRef.current = null;
      }, remainingPreviewTime);
    } else if (!isPlaying && previewTimerRef.current) {
      // Clear timer when paused
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  }, [isPlaying, currentTime, previewDuration, onPause]);

  return {
    clearPreviewTimer: () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
    }
  };
};
