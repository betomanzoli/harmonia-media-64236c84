
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ExternalLink } from 'lucide-react';

interface BandcampPlayerProps {
  bandcampUrl: string;
  title?: string;
  className?: string;
}

const BandcampPlayer: React.FC<BandcampPlayerProps> = ({
  bandcampUrl,
  title = "Bandcamp Track",
  className = ""
}) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateEmbedUrl = () => {
      try {
        // Extract album and track info from Bandcamp URL
        const albumMatch = bandcampUrl.match(/album\/([^/?]+)/);
        const trackMatch = bandcampUrl.match(/track\/([^/?]+)/);
        
        if (trackMatch) {
          // Individual track - use harmonIA album ID with specific track
          const trackSlug = trackMatch[1];
          const trackMapping: { [key: string]: string } = {
            'vozes-em-harmonia-ex-05': '2755730140',
            'demo-track-02': '2755730141',
            'harmony-sample-03': '2755730142',
            'promocional-01': '2755730143',
            'promocional-02': '2755730144'
          };
          
          const trackId = trackMapping[trackSlug] || '2755730140';
          const albumId = '4290875691'; // harmonIA album ID
          
          const embed = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
          setEmbedUrl(embed);
        } else if (albumMatch) {
          // Album track with ?t= parameter
          const trackParam = bandcampUrl.match(/[\?&]t=(\d+)/);
          const trackId = trackParam ? trackParam[1] : '2755730140';
          const albumId = '4290875691';
          
          const embed = `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
          setEmbedUrl(embed);
        } else {
          // Fallback - use default track
          const embed = `https://bandcamp.com/EmbeddedPlayer/album=4290875691/size=small/bgcol=333333/linkcol=2ebd35/track=2755730140/transparent=true/`;
          setEmbedUrl(embed);
        }
        
        setError('');
      } catch (err) {
        console.error('Error generating embed URL:', err);
        setError('Erro ao carregar player do Bandcamp');
      }
    };

    if (bandcampUrl) {
      generateEmbedUrl();
    }
  }, [bandcampUrl]);

  const handleOpenBandcamp = () => {
    window.open(bandcampUrl, '_blank');
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button variant="outline" onClick={handleOpenBandcamp} className="mt-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir no Bandcamp
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{title}</h4>
            <Button variant="ghost" size="sm" onClick={handleOpenBandcamp}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          
          {embedUrl && (
            <div className="relative">
              <iframe
                src={embedUrl}
                seamless
                style={{ border: 0, width: '100%', height: '120px' }}
                title={`Bandcamp Player: ${title}`}
                className="rounded"
                onLoad={() => setIsLoaded(true)}
                onError={() => setError('Erro ao carregar player')}
              />
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-gray-500 text-sm">Carregando...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampPlayer;
