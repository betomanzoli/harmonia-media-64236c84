
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
import { STORAGE_FOLDERS } from '@/services/googleDriveService';

interface GoogleDriveAudioPlayerProps {
  fileId: string;
  title: string;
  subtitle?: string;
  isPreview?: boolean;
}

const GoogleDriveAudioPlayer: React.FC<GoogleDriveAudioPlayerProps> = ({
  fileId,
  title,
  subtitle,
  isPreview = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Google Drive direct stream URL
  const audioUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    setAudioElement(audio);

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioLoad = () => {
      setDuration(audio.duration);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleAudioLoad);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleAudioLoad);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  const togglePlay = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioElement) return;
    
    const newTime = value[0];
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioElement) return;
    const newVolume = value[0];
    audioElement.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          
          {isPreview && (
            <span className="text-xs px-2 py-0.5 bg-harmonia-green/20 text-harmonia-green rounded-full">
              Prévia
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>

          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-harmonia-green"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
            >
              <VolumeIcon />
            </Button>
            
            {showVolumeControl && (
              <div className="absolute bottom-full right-0 p-3 bg-white shadow-md rounded-md mb-2 w-32">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoogleDriveAudioPlayer;
