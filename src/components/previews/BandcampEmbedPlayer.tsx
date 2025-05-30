import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title?: string;
  fallbackUrl?: string;
  className?: string;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title = "Bandcamp Audio",
  fallbackUrl,
  className = ""
}) => {
  const handleError = () => {
    console.error('Bandcamp embed failed to load:', embedUrl);
    if (fallbackUrl) {
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardContent className="p-4">
        {title && (
          <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        )}
        
        <div className="relative">
          <iframe
            style={{ 
              border: 0, 
              width: '100%', 
              height: '42px' 
            }}
            src={embedUrl}
            seamless
            title={title}
            onError={handleError}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
          
          {/* Fallback link */}
          {fallbackUrl && (
            <div className="mt-2">
              <a 
                href={fallbackUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Abrir no Bandcamp
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampEmbedPlayer;
