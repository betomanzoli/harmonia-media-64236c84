
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

  console.log('[BandcampPlayer] Iniciando render:', { embedUrl, title, fallbackUrl });

  useEffect(() => {
    console.log('[BandcampPlayer] useEffect executado:', { embedUrl });
    
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

    if (containerRef.current) {
      console.log('[BandcampPlayer] Container encontrado, criando iframe');
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
      
      // Adicionar query aleatória para evitar cache
      const separator = finalUrl.includes('?') ? '&' : '?';
      finalUrl += `${separator}t=${Date.now()}`;

      try {
        const iframeHTML = `
          <iframe 
            style="border: 0; width: 100%; height: 152px;" 
            src="${finalUrl}" 
            seamless
            allowfullscreen
            allow="autoplay; encrypted-media"
            title="${title}"
            onload="console.log('Iframe carregado com sucesso')"
            onerror="console.error('Erro no iframe:', event)"
          ></iframe>
        `;

        console.log('[BandcampPlayer] Inserindo iframe HTML:', finalUrl);
        containerRef.current.innerHTML = iframeHTML;
        
        // Simular carregamento
        setTimeout(() => {
          console.log('[BandcampPlayer] Marcando player como carregado');
          setPlayerLoaded(true);
        }, 2000);
        
      } catch (error) {
        console.error('[BandcampPlayer] Erro ao criar iframe:', error);
        setHasError(true);
      }
    } else {
      console.warn('[BandcampPlayer] Container não encontrado');
    }
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

  console.log('[BandcampPlayer] Renderizando: Player normal');

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
        className="w-full bg-gray-100"
        style={{ minHeight: '152px' }}
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
