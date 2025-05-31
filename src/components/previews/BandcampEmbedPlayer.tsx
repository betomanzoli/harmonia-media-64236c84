import React, { useState, useEffect, useRef } from 'react';

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
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  // ✅ VALIDAÇÃO:
  if (!embedUrl || !embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400 break-all">URL inválida: {embedUrl}</p>
      </div>
    );
  }

  // ✅ SOLUÇÃO PARA NEXT.JS (CONFORME RESULTADO [2]):
  // Adicionar query string aleatória para forçar reload
  const randomQuery = Math.floor(Math.random() * 10000);
  const finalUrl = embedUrl.includes('?') 
    ? `${embedUrl}&_reload=${randomQuery}&retry=${retryCount}` 
    : `${embedUrl}?_reload=${randomQuery}&retry=${retryCount}`;

  // ✅ RETRY AUTOMÁTICO SE FALHAR (CONFORME RESULTADO [3]):
  useEffect(() => {
    if (hasError && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        console.log(`[BandcampPlayer] Retry attempt ${retryCount + 1}`);
        setHasError(false);
        setIsLoaded(false);
        setRetryCount(prev => prev + 1);
      }, 2000);

      return () => clearTimeout(retryTimer);
    }
  }, [hasError, retryCount]);

  // ✅ FORÇAR RELOAD SE NÃO CARREGAR EM 5 SEGUNDOS:
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      if (!isLoaded && !hasError) {
        console.log('[BandcampPlayer] Force reload after 5 seconds');
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
      }
    }, 5000);

    return () => clearTimeout(loadTimer);
  }, [isLoaded, hasError, finalUrl]);

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      {!isLoaded && !hasError && (
        <div className="p-4 bg-gray-50 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-2">Carregando player Bandcamp...</p>
          {retryCount > 0 && (
            <p className="text-xs text-gray-500">Tentativa {retryCount + 1}/4</p>
          )}
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        style={{ 
          border: 0, 
          width: '100%', 
          height: `${height}px`,
          display: hasError ? 'none' : 'block'
        }}
        src={finalUrl}
        title={title}
        allowFullScreen
        onLoad={() => {
          console.log('[BandcampPlayer] Carregado com sucesso');
          setIsLoaded(true);
          setHasError(false);
        }}
        onError={(e) => {
          console.error('[BandcampPlayer] Erro ao carregar:', e);
          setHasError(true);
        }}
      />
      
      {hasError && (
        <div className="p-4 bg-red-100 text-center">
          <p className="text-red-600">Erro ao carregar player</p>
          <p className="text-xs text-red-400">Tentativa {retryCount + 1}/4</p>
          {retryCount < 3 ? (
            <p className="text-xs text-gray-500 mt-1">Tentando novamente em 2 segundos...</p>
          ) : (
            <button 
              onClick={() => {
                setRetryCount(0);
                setHasError(false);
                setIsLoaded(false);
              }}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BandcampEmbedPlayer;
