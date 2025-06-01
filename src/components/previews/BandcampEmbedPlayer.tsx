import React, { useEffect, useRef, useState } from 'react';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title: string;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  console.log('[BandcampPlayer] Props recebidas:', { embedUrl, title });

  useEffect(() => {
    if (!embedUrl || !embedUrl.includes('bandcamp.com')) {
      console.log('[BandcampPlayer] URL inválida:', embedUrl);
      return;
    }

    if (containerRef.current) {
      // ✅ CONFORME RESULTADO [4] - QUERY ALEATÓRIA PARA NEXT.JS:
      const randomQuery = Math.floor(Math.random() * 1000);
      let finalUrl = embedUrl;
      
      // Garantir HTTPS
      if (!finalUrl.startsWith('https://')) {
        finalUrl = finalUrl.replace('http://', 'https://');
        if (!finalUrl.startsWith('http')) {
          finalUrl = 'https:' + finalUrl;
        }
      }
      
      // ✅ CONFORME RESULTADO [3] - ADICIONAR # NO FINAL:
      if (!finalUrl.endsWith('#')) {
        finalUrl += '#';
      }
      
      // Adicionar query aleatória
      finalUrl += '?ignore=' + randomQuery;

      // ✅ CONFORME RESULTADO [7] - USAR dangerouslySetInnerHTML:
      const iframeHTML = `
        <iframe 
          style="border: 0; width: 100%; height: 152px;" 
          src="${finalUrl}" 
          seamless
          allowfullscreen
          allow="autoplay; encrypted-media"
          title="${title}"
        ></iframe>
      `;

      console.log('[BandcampPlayer] Inserindo iframe com URL:', finalUrl);
      containerRef.current.innerHTML = iframeHTML;
      
      setTimeout(() => {
        setPlayerLoaded(true);
        console.log('[BandcampPlayer] Player marcado como carregado');
      }, 2000);
    }
  }, [embedUrl, title]);

  if (!embedUrl) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Nenhuma URL fornecida</p>
      </div>
    );
  }

  if (!embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-yellow-100 rounded text-center">
        <p className="text-yellow-700">URL não é do Bandcamp</p>
        <p className="text-xs text-yellow-600 break-all mt-1">URL: {embedUrl}</p>
      </div>
    );
  }

  return (
    <div className="w-full border rounded overflow-hidden bg-white">
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b">
        🎵 Player Bandcamp
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
