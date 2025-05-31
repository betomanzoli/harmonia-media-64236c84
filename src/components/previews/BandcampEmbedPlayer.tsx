
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play } from 'lucide-react';
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title: string;
  fallbackUrl?: string;
  className?: string;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title,
  fallbackUrl,
  className = ''
}) => {
  const [iframeError, setIframeError] = useState(false);

  // Gerar embed dinâmico se a URL não for um embed
  const actualEmbedUrl = embedUrl.includes('EmbeddedPlayer') 
    ? embedUrl 
    : BandcampUtils.autoGenerateEmbed(embedUrl);

  const handleIframeError = () => {
    setIframeError(true);
  };

  const openInBandcamp = () => {
    const urlToOpen = fallbackUrl || embedUrl;
    window.open(urlToOpen, '_blank');
  };

  if (iframeError || !actualEmbedUrl) {
    return (
      <div className={`bg-gray-100 border rounded-lg p-6 text-center ${className}`}>
        <div className="space-y-3">
          <Play className="h-8 w-8 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600">Player não disponível</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openInBandcamp}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir no Bandcamp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <iframe
        style={{ border: 0, width: '100%', height: '120px' }}
        src={actualEmbedUrl}
        seamless
        onError={handleIframeError}
        title={title}
        allow="autoplay"
      />
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={openInBandcamp}
          className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default BandcampEmbedPlayer;
