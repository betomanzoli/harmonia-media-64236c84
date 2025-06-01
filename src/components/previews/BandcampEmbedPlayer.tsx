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
  const iframeRef = useRef<HTMLIFrameElement | null>(null); // ✅ REF PARA IFRAME

  console.log('[BandcampPlayer] Iniciando render seguro:', { embedUrl, title });

  useEffect(() => {
    console.log('[BandcampPlayer] useEffect executado de forma segura');
    
    if (!embedUrl) {
      console.log('[BandcampPlayer] URL vazia, abortando');
      return;
    }

    if (!embedUrl.includes('bandcamp.com')) {
      console.log('[BandcampPlayer] URL não é do Bandcamp:', embedUrl);
      setHasError(true);
      return;
    }

    const createSafeIframe = () => {
      try {
        if (!containerRef.current) {
          console.warn('[BandcampPlayer] Container não encontrado');
          return;
        }

        console.log('[BandcampPlayer] Criando iframe de forma segura');
        setHasError(false);
        setPlayerLoaded(false);
        
        let finalUrl = embedUrl;
        
        if (!finalUrl.startsWith('https://')) {
          if (finalUrl.startsWith('http://')) {
            finalUrl = finalUrl.replace('http://', 'https://');
          } else if (finalUrl.startsWith('//')) {
            finalUrl = 'https:' + finalUrl;
          } else if (!finalUrl.startsWith('http')) {
            finalUrl = 'https://' + finalUrl;
          }
        }

        // ✅ CLEANUP SEGURO SEM LOOP:
        const container = containerRef.current;
        if (container && container.firstChild) {
          try {
            container.innerHTML = ''; // ✅ MAIS SEGURO QUE removeChild
          } catch (error) {
            console.warn('[BandcampPlayer] Erro ao limpar container:', error);
          }
        }

        // ✅ CRIAR IFRAME COM REFERÊNCIA:
        const iframe = document.createElement('iframe');
        iframe.style.border = '0';
        iframe.style.width = '100%';
        iframe.style.height = '152px';
        iframe.src = finalUrl;
        iframe.title = title;
        iframe.setAttribute('seamless', 'true');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');

        // ✅ EVENT LISTENERS COM CLEANUP:
        const handleLoad = () => {
          console.log('[BandcampPlayer] Iframe carregado com sucesso');
          setPlayerLoaded(true);
        };

        const handleError = (error: any) => {
          console.error('[BandcampPlayer] Erro no iframe:', error);
          setHasError(true);
        };

        iframe.addEventListener('load', handleLoad);
        iframe.addEventListener('error', handleError);

        // ✅ SALVAR REFERÊNCIA PARA CLEANUP:
        iframeRef.current = iframe;

        try {
          container.appendChild(iframe);
          console.log('[BandcampPlayer] Iframe inserido com sucesso');
        } catch (error) {
          console.error('[BandcampPlayer] Erro ao inserir iframe:', error);
          setHasError(true);
        }

      } catch (error) {
        console.error('[BandcampPlayer] Erro geral ao criar iframe:', error);
        setHasError(true);
      }
    };

    const timeoutId = setTimeout(createSafeIframe, 100);

    // ✅ CLEANUP MELHORADO:
    return () => {
      clearTimeout(timeoutId);
      
      // ✅ REMOVER EVENT LISTENERS:
      if (iframeRef.current) {
        try {
          iframeRef.current.removeEventListener('load', () => {});
          iframeRef.current.removeEventListener('error', () => {});
          iframeRef.current = null;
        } catch (error) {
          console.warn('[BandcampPlayer] Erro ao remover listeners:', error);
        }
      }
      
      // ✅ CLEANUP SEGURO DO CONTAINER:
      if (containerRef.current) {
        try {
          containerRef.current.innerHTML = '';
        } catch (error) {
          console.warn('[BandcampPlayer] Erro no cleanup final:', error);
        }
      }
    };
  }, [embedUrl, title]);

  if (!embedUrl) {
    console.log('[BandcampPlayer] Renderizando: URL vazia');
    return (
      <div className={`p-4 bg-gray-100 rounded text-center ${className}`}>
        <p className="text-gray-600">Nenhuma URL de embed fornecida</p>
      </div>
    );
  }

  if (hasError || !embedUrl.includes('bandcamp.com')) {
    console.log('[BandcampPlayer] Renderizando: Erro ou URL inválida');
    return (
      <div className={`p-4 bg-yellow-100 rounded text-center ${className}`}>
        <p className="text-yellow-700">URL inválida para player do Bandcamp</p>
        <p className="text-xs text-yellow-600 break-all mt-1">URL: {embedUrl}</p>
        {fallbackUrl && (
          <a 
            href={fallbackUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm mt-2 block"
          >
            Abrir no Bandcamp
          </a>
        )}
      </div>
    );
  }

  console.log('[BandcampPlayer] Renderizando: Player normal seguro');

  return (
    <div className={`w-full border rounded overflow-hidden bg-white ${className}`}>
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b flex justify-between items-center">
        <span>🎵 Player Bandcamp</span>
        {fallbackUrl && (
          <a 
            href={fallbackUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Abrir original
          </a>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="w-full bg-gray-100 relative"
        style={{ minHeight: '152px' }}
      >
        {!playerLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
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
