import React, { useEffect, useRef, useState } from 'react';

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
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [safeMode, setSafeMode] = useState(false);

  // ✅ DETECTAR PROBLEMAS E ATIVAR MODO SEGURO:
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.message?.includes('ethereum') || 
          event.message?.includes('removeChild') ||
          event.message?.includes('WebAssembly')) {
        console.log('[BandcampPlayer] Modo seguro ativado devido a:', event.message);
        setSafeMode(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  useEffect(() => {
    if (!embedUrl || !embedUrl.includes('bandcamp.com') || safeMode) {
      return;
    }

    const createPlayer = () => {
      try {
        if (!containerRef.current) return;

        // ✅ CONFORME RESULTADO [3] - USAR dangerouslySetInnerHTML:
        const iframeHTML = `
          <div style="position: relative; isolation: isolate;">
            <iframe 
              style="border: 0; width: 100%; height: 152px;" 
              src="${embedUrl}" 
              title="${title}"
              allowfullscreen
              allow="autoplay; encrypted-media"
              loading="lazy"
            ></iframe>
          </div>
        `;

        containerRef.current.innerHTML = iframeHTML;
        
        setTimeout(() => {
          setPlayerLoaded(true);
        }, 2000);

      } catch (error) {
        console.error('[BandcampPlayer] Erro:', error);
        setHasError(true);
      }
    };

    const timeoutId = setTimeout(createPlayer, 500);
    return () => clearTimeout(timeoutId);
  }, [embedUrl, title, safeMode]);

  // ✅ MODO SEGURO - SEM IFRAME:
  if (safeMode || hasError || !embedUrl) {
    return (
      <div className={`p-4 bg-blue-50 rounded text-center border border-blue-200 ${className}`}>
        <div className="mb-3">
          <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4.369 4.369 0 00-1.045-.049c-2.465 0-4.47 1.243-4.47 2.772S2.49 16.609 4.955 16.609c2.465 0 4.47-1.243 4.47-2.772V7.697l8-1.6v4.431a4.369 4.369 0 00-1.045-.049c-2.465 0-4.47 1.243-4.47 2.772s2.005 2.772 4.47 2.772 4.47-1.243 4.47-2.772V3z"/>
          </svg>
          <h3 className="font-medium text-blue-900">{title}</h3>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          🎵 Player Bandcamp (Modo Seguro)
        </p>
        {(fallbackUrl || embedUrl) && (
          <a 
            href={fallbackUrl || embedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Ouvir no Bandcamp
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        {safeMode && (
          <p className="text-xs text-blue-600 mt-2">
            Modo seguro ativado devido a conflitos do navegador
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full border rounded overflow-hidden bg-white ${className}`}>
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b">
        🎵 Player Bandcamp
      </div>
      
      <div 
        ref={containerRef}
        className="w-full bg-gray-100"
        style={{ minHeight: '152px', isolation: 'isolate' }}
      >
        {!playerLoaded && (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando player...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BandcampEmbedPlayer;
