
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { formatTime, calculateMaxSliderValue } from '@/lib/audio-utils';

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
  // Calculate max slider value (limit to preview duration)
  const maxSliderValue = calculateMaxSliderValue(duration, previewDuration);

  return (
    <div className="space-y-2">
      <Slider 
        value={[currentTime]} 
        max={maxSliderValue || 100} 
        step={0.1} 
        onValueChange={onSliderChange} 
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>
          {previewDuration && duration > previewDuration 
            ? `${formatTime(Math.min(currentTime, previewDuration))} / ${formatTime(previewDuration)}`
            : formatTime(duration)
          }
        </span>
      </div>
    </div>
  );
};

export default AudioProgress;
