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
  const [playerError, setPlayerError] = useState(false);

  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  useEffect(() => {
    if (!embedUrl || !embedUrl.includes('bandcamp.com/EmbeddedPlayer')) {
      console.log('[BandcampPlayer] URL inválida:', embedUrl);
      setPlayerError(true);
      return;
    }

    if (containerRef.current) {
      // ✅ CONFORME RESULTADO [8] - GARANTIR HTTPS:
      let finalUrl = embedUrl;
      if (embedUrl.startsWith('http://')) {
        finalUrl = embedUrl.replace('http://', 'https://');
      }
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https:' + finalUrl;
      }

      // ✅ CONFORME RESULTADO [5] - USAR dangerouslySetInnerHTML:
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

      console.log('[BandcampPlayer] Inserindo iframe:', finalUrl);
      containerRef.current.innerHTML = iframeHTML;
      
      // Verificar se carregou após 3 segundos
      setTimeout(() => {
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe) {
          setPlayerLoaded(true);
          console.log('[BandcampPlayer] Player carregado com sucesso');
        } else {
          setPlayerError(true);
          console.log('[BandcampPlayer] Falha ao carregar player');
        }
      }, 3000);
    }
  }, [embedUrl, title]);

  // ✅ VALIDAÇÃO INICIAL:
  if (!embedUrl) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Nenhuma URL fornecida</p>
      </div>
    );
  }

  if (!embedUrl.includes('bandcamp.com/EmbeddedPlayer')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">URL não é um player Bandcamp válido</p>
        <p className="text-xs text-gray-400 break-all mt-1">URL: {embedUrl}</p>
        <p className="text-xs text-gray-500 mt-1">Deve conter 'bandcamp.com/EmbeddedPlayer'</p>
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
        {!playerLoaded && !playerError && (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando player...</p>
            </div>
          </div>
        )}
      </div>

      {playerError && (
        <div className="p-4 bg-red-50 text-center border-t">
          <p className="text-red-600 text-sm">Não foi possível carregar o player</p>
          <button 
            onClick={() => {
              setPlayerError(false);
              setPlayerLoaded(false);
            }}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default BandcampEmbedPlayer;
