import React from 'react';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';

interface BandcampVersionCardProps {
  version: {
    name: string;
    description?: string;
    bandcamp_url?: string;
    recommended?: boolean;
    created_at?: string;
  };
}

const BandcampVersionCard: React.FC<BandcampVersionCardProps> = ({ version }) => {
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold text-lg">{version.name}</h3>
        {version.recommended && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Recomendada</span>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-2">{version.description}</div>
      {version.bandcamp_url && (
        <BandcampEmbedPlayer embedUrl={version.bandcamp_url} title={version.name} />
      )}
      <div className="text-xs text-gray-400 mt-2">
        Adicionada em: {version.created_at ? new Date(version.created_at).toLocaleDateString('pt-BR') : '--'}
      </div>
    </div>
  );
};

export default BandcampVersionCard;
