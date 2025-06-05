
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Music, X, Minimize2, Maximize2 } from 'lucide-react';

const GlobalBandcampPlayer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full w-12 h-12 bg-harmonia-green hover:bg-harmonia-green/90 text-white shadow-lg"
          aria-label="Mostrar player de música"
        >
          <Music className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header do Player */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-harmonia-green" />
            <span className="text-sm font-medium text-gray-700">harmonIA</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
              aria-label={isMinimized ? "Expandir player" : "Minimizar player"}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
              aria-label="Fechar player"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Player Bandcamp */}
        {!isMinimized && (
          <div className="w-80">
            <iframe 
              style={{ border: 0, width: '100%', height: '120px' }} 
              src="https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=large/bgcol=ffffff/linkcol=2ebd35/tracklist=false/artwork=small/transparent=true/" 
              seamless
              title="Promocionais - harmonIA by harmonIA"
            >
              <a href="https://harmonia-media.bandcamp.com/album/promocionais-harmonia">Promocionais - harmonIA by harmonIA</a>
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalBandcampPlayer;
