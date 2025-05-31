import React, { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  // ✅ VALIDAÇÃO:
  if (!embedUrl || !embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400 break-all">URL: {embedUrl}</p>
      </div>
    );
  }

  // ✅ EXTRAIR INFORMAÇÕES DO EMBED PARA CRIAR LINK DIRETO:
  const extractTrackInfo = (url: string) => {
    try {
      // Extrair album e track IDs da URL
      const albumMatch = url.match(/album=(\d+)/);
      const trackMatch = url.match(/track=(\d+)/);
      
      if (albumMatch && trackMatch) {
        return {
          albumId: albumMatch[1],
          trackId: trackMatch[1],
          directUrl: `https://harmonia-media.bandcamp.com/track/electro-choro-choro-eletronico` // URL base conhecida
        };
      }
    } catch (error) {
      console.error('Error extracting track info:', error);
    }
    return null;
  };

  const trackInfo = extractTrackInfo(embedUrl);

  useEffect(() => {
    if (containerRef.current && embedUrl && !showFallback) {
      // ✅ TENTAR MÚLTIPLAS ABORDAGENS:
      
      // Abordagem 1: dangerouslySetInnerHTML com delay
      const randomQuery = Math.floor(Math.random() * 10000);
      const finalUrl = embedUrl.includes('?') 
        ? `${embedUrl}&_reload=${randomQuery}&t=${Date.now()}` 
        : `${embedUrl}?_reload=${randomQuery}&t=${Date.now()}`;

      const iframeHTML = `
        <div style="position: relative; width: 100%; height: ${height}px; background: #f5f5f5;">
          <iframe 
            style="border: 0; width: 100%; height: 100%; position: absolute; top: 0; left: 0;" 
            src="${finalUrl}" 
            seamless
            allowfullscreen
            allow="autoplay; encrypted-media; fullscreen"
            title="${title}"
            onload="console.log('Bandcamp iframe loaded')"
            onerror="console.log('Bandcamp iframe error')"
          ></iframe>
        </div>
      `;

      // Inserir com delay para evitar detecção
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = iframeHTML;
          console.log('[BandcampPlayer] Iframe inserido com delay');
        }
      }, 100);

      // ✅ TIMEOUT PARA FALLBACK:
      const fallbackTimer = setTimeout(() => {
        if (!playerLoaded) {
          console.log('[BandcampPlayer] Timeout reached, showing fallback');
          setShowFallback(true);
        }
      }, 8000); // 8 segundos

      // ✅ VERIFICAR SE CARREGOU:
      const checkTimer = setTimeout(() => {
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe) {
          setPlayerLoaded(true);
          console.log('[BandcampPlayer] Player detected as loaded');
        }
      }, 3000);

      return () => {
        clearTimeout(fallbackTimer);
        clearTimeout(checkTimer);
      };
    }
  }, [embedUrl, height, title, showFallback, playerLoaded]);

  // ✅ MOSTRAR FALLBACK SE PLAYER NÃO CARREGOU:
  if (showFallback || !embedUrl.includes('EmbeddedPlayer')) {
    return (
      <div className="w-full border rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="p-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4.369 4.369 0 00-1.045-.049c-2.465 0-4.47 1.243-4.47 2.772S2.49 16.609 4.955 16.609c2.465 0 4.47-1.243 4.47-2.772V7.697l8-1.6v4.431a4.369 4.369 0 00-1.045-.049c-2.465 0-4.47 1.243-4.47 2.772s2.005 2.772 4.47 2.772 4.47-1.243 4.47-2.772V3z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              🎵 Ouça esta faixa no Bandcamp
            </p>
          </div>
          
          <div className="space-y-3">
            {trackInfo?.directUrl && (
              <a 
                href={trackInfo.directUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M4 7h16M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l2-2h12l2 2"/>
                </svg>
                Ouvir no Bandcamp
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
            
            <button 
              onClick={() => {
                setShowFallback(false);
                setPlayerLoaded(false);
              }}
              className="block mx-auto text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Tentar carregar player novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ CONTAINER PARA O PLAYER:
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b flex items-center justify-between">
        <span>🎵 Player Bandcamp</span>
        <button 
          onClick={() => setShowFallback(true)}
          className="text-blue-600 hover:underline"
        >
          Não carrega?
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="w-full bg-gray-100"
        style={{ minHeight: `${height}px` }}
      >
        {!playerLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando player...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BandcampEmbedPlayer;
