import React, { useState, useEffect } from 'react';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title?: string;
  height?: number;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title = "Bandcamp Player",
  height = 152
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [embedUrl]);

  console.log('[BandcampPlayer] Rendering with URL:', embedUrl);

  // ✅ VALIDAÇÃO MAIS RIGOROSA:
  if (!embedUrl || !embedUrl.includes('bandcamp.com/EmbeddedPlayer')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400">URL inválida: {embedUrl}</p>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      {!isLoaded && !hasError && (
        <div className="p-4 bg-gray-100 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-2">Carregando player...</p>
        </div>
      )}
      
      <iframe
        style={{ 
          border: 0, 
          width: '100%', 
          height: `${height}px`,
          display: hasError ? 'none' : 'block'
        }}
        src={embedUrl}
        seamless
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allow="autoplay; encrypted-media; fullscreen"
        onLoad={() => {
          console.log('[BandcampPlayer] Loaded successfully');
          setIsLoaded(true);
        }}
        onError={(e) => {
          console.error('[BandcampPlayer] Failed to load:', e);
          setHasError(true);
        }}
      />
      
      {hasError && (
        <div className="p-4 bg-red-100 text-center">
          <p className="text-red-600">Erro ao carregar player</p>
          <p className="text-xs text-red-400">Verifique se a URL está correta</p>
          <button 
            onClick={() => {
              setHasError(false);
              setIsLoaded(false);
            }}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default BandcampEmbedPlayer;
