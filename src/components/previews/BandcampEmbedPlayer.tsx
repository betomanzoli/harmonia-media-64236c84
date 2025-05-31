import React from 'react';

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
  console.log('[BandcampPlayer] URL recebida:', embedUrl);

  // ✅ VALIDAÇÃO ULTRA-SIMPLES:
  if (!embedUrl) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Nenhuma URL fornecida</p>
      </div>
    );
  }

  if (!embedUrl.includes('bandcamp.com')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">URL não é do Bandcamp</p>
        <p className="text-xs text-gray-400 break-all">URL: {embedUrl}</p>
      </div>
    );
  }

  // ✅ IFRAME ULTRA-SIMPLES (SEM SANDBOX):
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      <iframe
        style={{ 
          border: 0, 
          width: '100%', 
          height: `${height}px`
        }}
        src={embedUrl}
        title={title}
        allowFullScreen
      />
    </div>
  );
};

export default BandcampEmbedPlayer;
