
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseAudioPlayerControlsProps {
  audioSrc: string;
  previewDuration?: number;
}

export const useAudioPlayerControls = ({ audioSrc, previewDuration = 30 }: UseAudioPlayerControlsProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
    } else {
      audioRef.current.play();
      
      if (previewDuration && !previewTimerRef.current) {
        const remainingPreviewTime = Math.max(0, previewDuration - currentTime) * 1000;
        
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
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      
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
