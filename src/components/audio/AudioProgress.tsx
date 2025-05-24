
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface AudioProgressProps {
  currentTime: number;
  duration: number;
  previewDuration?: number;
  onSliderChange: (value: number[]) => void;
}

const AudioProgress: React.FC<AudioProgressProps> = ({
  currentTime,
  duration,
  previewDuration,
  onSliderChange
}) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const maxTime = previewDuration ? Math.min(duration, previewDuration) : duration;

  return (
    <div className="flex-1 space-y-1">
      <Slider 
        value={[currentTime]} 
        max={maxTime}
        step={0.1}
        onValueChange={onSliderChange}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(maxTime)}</span>
      </div>
    </div>
  );
};

export default AudioProgress;
