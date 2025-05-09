
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlayCircle, PauseCircle, SkipForward, SkipBack } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface ComparisonPlayerProps {
  title: string;
  description?: string;
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ComparisonPlayer: React.FC<ComparisonPlayerProps> = ({
  title,
  description,
  beforeUrl,
  afterUrl,
  beforeLabel = "Antes",
  afterLabel = "Depois"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playingBefore, setPlayingBefore] = useState(true);
  const beforeAudioRef = useRef<HTMLAudioElement | null>(null);
  const afterAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    beforeAudioRef.current = new Audio(beforeUrl);
    afterAudioRef.current = new Audio(afterUrl);
    
    // Set event listeners
    const beforeAudio = beforeAudioRef.current;
    const afterAudio = afterAudioRef.current;
    
    const setAudioData = () => {
      const currentAudio = playingBefore ? beforeAudio : afterAudio;
      setDuration(currentAudio.duration || 0);
    };
    
    const updateTime = () => {
      const currentAudio = playingBefore ? beforeAudio : afterAudio;
      setCurrentTime(currentAudio.currentTime || 0);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (playingBefore) {
        // Auto-switch to "after" when "before" finishes
        switchToAfter();
      }
    };
    
    beforeAudio.addEventListener('loadedmetadata', setAudioData);
    beforeAudio.addEventListener('timeupdate', updateTime);
    beforeAudio.addEventListener('ended', handleEnded);
    
    afterAudio.addEventListener('loadedmetadata', setAudioData);
    afterAudio.addEventListener('timeupdate', updateTime);
    afterAudio.addEventListener('ended', handleEnded);
    
    return () => {
      beforeAudio.pause();
      afterAudio.pause();
      
      beforeAudio.removeEventListener('loadedmetadata', setAudioData);
      beforeAudio.removeEventListener('timeupdate', updateTime);
      beforeAudio.removeEventListener('ended', handleEnded);
      
      afterAudio.removeEventListener('loadedmetadata', setAudioData);
      afterAudio.removeEventListener('timeupdate', updateTime);
      afterAudio.removeEventListener('ended', handleEnded);
    };
  }, [beforeUrl, afterUrl, playingBefore]);

  const togglePlay = () => {
    const currentAudio = playingBefore ? beforeAudioRef.current : afterAudioRef.current;
    if (!currentAudio) return;
    
    if (isPlaying) {
      currentAudio.pause();
      setIsPlaying(false);
    } else {
      currentAudio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };
  
  const switchToBefore = () => {
    if (afterAudioRef.current) {
      afterAudioRef.current.pause();
      afterAudioRef.current.currentTime = 0;
    }
    
    setPlayingBefore(true);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (beforeAudioRef.current) {
      beforeAudioRef.current.currentTime = 0;
      if (isPlaying) {
        beforeAudioRef.current.play().catch(console.error);
      }
    }
  };
  
  const switchToAfter = () => {
    if (beforeAudioRef.current) {
      beforeAudioRef.current.pause();
      beforeAudioRef.current.currentTime = 0;
    }
    
    setPlayingBefore(false);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (afterAudioRef.current) {
      afterAudioRef.current.currentTime = 0;
      if (isPlaying) {
        afterAudioRef.current.play().catch(console.error);
      }
    }
  };
  
  const handleSliderChange = (values: number[]) => {
    const currentAudio = playingBefore ? beforeAudioRef.current : afterAudioRef.current;
    if (!currentAudio) return;
    
    const newTime = values[0];
    currentAudio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>
        
        <div className="mb-4 flex space-x-2">
          <Button 
            variant={playingBefore ? "default" : "outline"} 
            onClick={switchToBefore}
            className={playingBefore ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            <SkipBack className="w-4 h-4 mr-2" />
            {beforeLabel}
          </Button>
          
          <Button 
            variant={!playingBefore ? "default" : "outline"} 
            onClick={switchToAfter}
            className={!playingBefore ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {afterLabel}
            <SkipForward className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={togglePlay} 
            className="focus:outline-none text-harmonia-green hover:text-harmonia-green/80"
          >
            {isPlaying ? (
              <PauseCircle className="w-12 h-12" />
            ) : (
              <PlayCircle className="w-12 h-12" />
            )}
          </button>
          
          <div className="w-full">
            <Slider 
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span className="font-semibold">
                {playingBefore ? beforeLabel : afterLabel}
              </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonPlayer;
