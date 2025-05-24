
import { useState, useRef, useEffect } from 'react';
import { setupAudioElement, handlePreviewLimit } from '@/lib/audio-controls/audio-utils';
import { usePreviewTimer } from './audio/use-preview-timer';

interface UseAudioPlayerControlsProps {
  audioSrc: string;
  previewDuration?: number;
}

export const useAudioPlayerControls = ({ audioSrc, previewDuration = 30 }: UseAudioPlayerControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const { setupPreviewTimer, clearPreviewTimer } = usePreviewTimer({
    isPlaying,
    currentTime,
    previewDuration,
    onPause: pauseAudio
  });

  useEffect(() => {
    if (audioRef.current) {
      setupAudioElement(audioRef);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      pauseAudio();
      clearPreviewTimer();
    } else {
      const canPlay = setupPreviewTimer();
      if (canPlay) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const current = audioRef.current.currentTime;
    setCurrentTime(current);
    
    if (previewDuration && current >= previewDuration) {
      pauseAudio();
      clearPreviewTimer();
      handlePreviewLimit();
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    if (previewDuration && value[0] > previewDuration) {
      audioRef.current.currentTime = previewDuration;
      setCurrentTime(previewDuration);
      handlePreviewLimit();
    } else {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    showVolumeControl,
    setShowVolumeControl,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSliderChange,
    handleVolumeChange,
    handleEnded: () => setIsPlaying(false)
  };
};
