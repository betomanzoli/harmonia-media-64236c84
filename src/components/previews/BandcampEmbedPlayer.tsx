import React from 'react';

interface BandcampEmbedPlayerProps {
  embedUrl: string;
  title: string;
}

const BandcampEmbedPlayer: React.FC<BandcampEmbedPlayerProps> = ({
  embedUrl,
  title
}) => {
  console.log('Player URL:', embedUrl);

  if (!embedUrl || !embedUrl.includes('bandcamp.com/EmbeddedPlayer')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Player não disponível</p>
        <p className="text-xs text-gray-400 break-all">URL: {embedUrl}</p>
      </div>
    );
  }

  return (
    <div className="w-full border rounded overflow-hidden">
      <iframe
        src={embedUrl}
        style={{ border: 0, width: '100%', height: '152px' }}
        title={title}
        allowFullScreen
      />
    </div>
  );
};

export default BandcampEmbedPlayer;
