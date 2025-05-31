import React from 'react';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title?: string;
  height?: number;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title = "Bandcamp Player",
  height = 42
}) => {
  // Verifica se a URL é válida
  if (!embedUrl || !embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400">URL inválida: {embedUrl}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <iframe
        style={{ border: 0, width: '100%', height: `${height}px` }}
        src={embedUrl}
        seamless
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
};

export default BandcampEmbedPlayer;
