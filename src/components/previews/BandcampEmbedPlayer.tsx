
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

  console.log('[BandcampPlayer] Iniciando render seguro:', { embedUrl, title });

  useEffect(() => {
    console.log('[BandcampPlayer] useEffect executado de forma segura');
    
    if (!embedUrl) {
      console.log('[BandcampPlayer] URL vazia, abortando');
      return;
    }

    // Validar se é uma URL do Bandcamp
    if (!embedUrl.includes('bandcamp.com')) {
      console.log('[BandcampPlayer] URL não é do Bandcamp:', embedUrl);
      setHasError(true);
      return;
    }

    // Função segura para criar iframe
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
        
        // Garantir HTTPS
        if (!finalUrl.startsWith('https://')) {
          if (finalUrl.startsWith('http://')) {
            finalUrl = finalUrl.replace('http://', 'https://');
          } else if (finalUrl.startsWith('//')) {
            finalUrl = 'https:' + finalUrl;
          } else if (!finalUrl.startsWith('http')) {
            finalUrl = 'https://' + finalUrl;
          }
        }

        // Limpar container de forma segura
        const container = containerRef.current;
        while (container.firstChild) {
          try {
            container.removeChild(container.firstChild);
          } catch (error) {
            console.warn('[BandcampPlayer] Erro ao remover child, continuando...', error);
            break;
          }
        }

        // Criar iframe usando createElement (mais seguro)
        const iframe = document.createElement('iframe');
        iframe.style.border = '0';
        iframe.style.width = '100%';
        iframe.style.height = '152px';
        iframe.src = finalUrl;
        iframe.title = title;
        iframe.setAttribute('seamless', 'true');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');

        // Event listeners seguros
        iframe.onload = () => {
          console.log('[BandcampPlayer] Iframe carregado com sucesso');
          setPlayerLoaded(true);
        };

        iframe.onerror = (error) => {
          console.error('[BandcampPlayer] Erro no iframe:', error);
          setHasError(true);
        };

        // Inserir iframe de forma segura
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

    // Usar timeout para evitar conflitos
    const timeoutId = setTimeout(createSafeIframe, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current) {
        try {
          const container = containerRef.current;
          while (container.firstChild) {
            try {
              container.removeChild(container.firstChild);
            } catch (error) {
              console.warn('[BandcampPlayer] Erro no cleanup, continuando...', error);
              break;
            }
          }
        } catch (error) {
          console.warn('[BandcampPlayer] Erro no cleanup geral:', error);
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
