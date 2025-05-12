
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClick }) => {
  return (
    <Button 
      onClick={onClick} 
      variant="outline" 
      size="icon" 
      className="w-12 h-12 rounded-full border-harmonia-green bg-harmonia-green/10"
    >
      {isPlaying ? (
        <Pause className="h-5 w-5 text-harmonia-green" />
      ) : (
        <Play className="h-5 w-5 text-harmonia-green" />
      )}
    </Button>
  );
};

export default PlayButton;
