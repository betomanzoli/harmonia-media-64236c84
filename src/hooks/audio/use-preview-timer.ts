
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

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const setupPreviewTimer = () => {
    if (previewDuration && !previewTimerRef.current) {
      const remainingPreviewTime = Math.max(0, previewDuration - currentTime) * 1000;
      
      if (currentTime >= previewDuration) {
        onPause();
        handlePreviewEnd();
        return false;
      }
      
      previewTimerRef.current = window.setTimeout(() => {
        onPause();
        handlePreviewEnd();
        previewTimerRef.current = null;
      }, remainingPreviewTime);

      return true;
    }
    return true;
  };

  const clearPreviewTimer = () => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  };

  return {
    setupPreviewTimer,
    clearPreviewTimer
  };
};
