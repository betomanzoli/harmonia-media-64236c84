import React, { useEffect, useRef } from 'react';

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

  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  // ✅ VALIDAÇÃO:
  if (!embedUrl || !embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400 break-all">URL: {embedUrl}</p>
        <p className="text-xs text-gray-500 mt-1">A URL deve conter 'bandcamp.com'</p>
      </div>
    );
  }

  // ✅ CRIAR IFRAME HTML COMPLETO:
  const createIframeHTML = (url: string): string => {
    // Adicionar query aleatória para forçar reload
    const randomQuery = Math.floor(Math.random() * 10000);
    const finalUrl = url.includes('?') 
      ? `${url}&_reload=${randomQuery}` 
      : `${url}?_reload=${randomQuery}`;

    return `
      <iframe 
        style="border: 0; width: 100%; height: ${height}px;" 
        src="${finalUrl}" 
        seamless
        allowfullscreen
        allow="autoplay; encrypted-media"
        title="${title}"
      ></iframe>
    `;
  };

  // ✅ USAR dangerouslySetInnerHTML (SOLUÇÃO DO RESULTADO [2]):
  useEffect(() => {
    if (containerRef.current && embedUrl) {
      const iframeHTML = createIframeHTML(embedUrl);
      containerRef.current.innerHTML = iframeHTML;
      
      console.log('[BandcampPlayer] Iframe inserido via innerHTML');
      
      // ✅ VERIFICAR SE CARREGOU APÓS 3 SEGUNDOS:
      setTimeout(() => {
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe) {
          console.log('[BandcampPlayer] Iframe encontrado após 3 segundos');
        } else {
          console.log('[BandcampPlayer] Iframe não encontrado - possível bloqueio');
        }
      }, 3000);
    }
  }, [embedUrl, height, title]);

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      <div className="p-2 bg-gray-50 text-xs text-gray-600 border-b">
        🎵 Player Bandcamp
      </div>
      <div 
        ref={containerRef}
        className="w-full"
        style={{ minHeight: `${height}px` }}
      />
      <div className="p-2 bg-gray-50 text-xs text-gray-500 border-t">
        Se o player não carregar, <a 
          href={embedUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          clique aqui para abrir em nova aba
        </a>
      </div>
    </div>
  );
};

export default BandcampEmbedPlayer;
