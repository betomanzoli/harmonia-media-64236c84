import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title: string;
  className?: string;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  // ✅ VALIDAÇÃO RIGOROSA:
  const isValidEmbedUrl = embedUrl && embedUrl.includes('bandcamp.com/EmbeddedPlayer');

  const handleLoad = () => {
    console.log('[BandcampPlayer] Loaded successfully');
    setIsLoading(false);
    setIframeError(false);
  };

  const handleError = () => {
    console.error('[BandcampPlayer] Failed to load:', embedUrl);
    setIsLoading(false);
    setIframeError(true);
  };

  if (!isValidEmbedUrl) {
    console.warn('[BandcampPlayer] Invalid embed URL:', embedUrl);
    return (
      <div className={`p-4 bg-gray-100 rounded text-center ${className}`}>
        <AlertTriangle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400 break-all mt-1">URL inválida</p>
      </div>
    );
  }

  if (iframeError) {
    return (
      <div className={`p-4 bg-red-50 rounded text-center border border-red-200 ${className}`}>
        <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
        <p className="text-red-600">Não foi possível carregar o player</p>
        <button 
          onClick={() => {
            setIframeError(false);
            setIsLoading(true);
          }}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full border rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="relative" style={{ minHeight: '152px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Carregando player...</p>
            </div>
          </div>
        )}
        
        <iframe
          style={{ 
            border: 0, 
            width: '100%', 
            height: '152px',
            display: 'block'
          }}
          src={embedUrl}
          title={title}
          allowFullScreen
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default BandcampEmbedPlayer;
