
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  showVolumeControl: boolean;
  onVolumeChange: (value: number) => void;
  onVolumeButtonClick: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  showVolumeControl,
  onVolumeChange,
  onVolumeButtonClick
}) => {
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className="relative">
      <Button
        onClick={onVolumeButtonClick}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <VolumeIcon />
      </Button>
      
      {showVolumeControl && (
        <div className="absolute bottom-full right-0 mb-1 p-3 bg-white shadow-md rounded-md w-32">
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => onVolumeChange(value[0])}
          />
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
