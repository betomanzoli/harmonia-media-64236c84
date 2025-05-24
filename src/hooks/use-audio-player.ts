
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseAudioPlayerProps {
  audioSrc: string;
  previewDuration?: number;
}

export const useAudioPlayer = ({ audioSrc, previewDuration = 30 }: UseAudioPlayerProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<number | null>(null);
  
  // Reset player when audio source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioSrc]);
  
  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (previewTimerRef.current) {
          clearTimeout(previewTimerRef.current);
          previewTimerRef.current = null;
        }
      } else {
        audioRef.current.play();
        
        // Setup timer to stop after preview duration
        if (previewDuration && !previewTimerRef.current) {
          // Calculate remaining preview time
          const remainingPreviewTime = Math.max(0, previewDuration - currentTime) * 1000;
          
          // If already past preview time, don't allow more playback
          if (currentTime >= previewDuration) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(false);
            toast({
              title: "Prévia limitada",
              description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
            });
            return;
          }
          
          previewTimerRef.current = window.setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
              toast({
                title: "Prévia finalizada",
                description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
              });
            }
            previewTimerRef.current = null;
          }, remainingPreviewTime);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      
      // Check if exceeded preview limit
      if (previewDuration && current >= previewDuration) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (previewTimerRef.current) {
          clearTimeout(previewTimerRef.current);
          previewTimerRef.current = null;
        }
        toast({
          title: "Prévia finalizada",
          description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      // Don't allow dragging beyond preview time
      if (previewDuration && value[0] > previewDuration) {
        audioRef.current.currentTime = previewDuration;
        setCurrentTime(previewDuration);
        toast({
          title: "Prévia limitada",
          description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
        });
      } else {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSliderChange,
    handleEnded: () => setIsPlaying(false)
  };
};
