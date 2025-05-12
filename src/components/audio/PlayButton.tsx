
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="h-8 w-8 p-0 rounded-full"
    >
      {isPlaying ? 
        <Pause className="h-3.5 w-3.5" /> : 
        <Play className="h-3.5 w-3.5 ml-0.5" />
      }
    </Button>
  );
};

export default PlayButton;
