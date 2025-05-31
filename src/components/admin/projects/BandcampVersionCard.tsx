import React from 'react';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import { Music, Calendar, Star } from 'lucide-react';

interface BandcampVersionCardProps {
  version: {
    id?: string;
    name: string;
    description?: string;
    bandcamp_url?: string;
    recommended?: boolean;
    created_at?: string;
  };
  onEdit?: (version: any) => void;
  onDelete?: (versionId: string) => void;
}

const BandcampVersionCard: React.FC<BandcampVersionCardProps> = ({ 
  version, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '--';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '--';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header da Versão */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Music className="h-4 w-4 text-harmonia-green flex-shrink-0" />
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {version.name}
          </h3>
          {version.recommended && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium">Recomendada</span>
            </div>
          )}
        </div>
        
        {/* Ações (se fornecidas) */}
        {(onEdit || onDelete) && (
          <div className="flex gap-1 ml-2">
            {onEdit && (
              <button
                onClick={() => onEdit(version)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Editar versão"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && version.id && (
              <button
                onClick={() => onDelete(version.id!)}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Excluir versão"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Descrição */}
      {version.description && (
        <div className="text-sm text-gray-600 mb-3 leading-relaxed">
          {version.description}
        </div>
      )}

      {/* Player Bandcamp */}
      {version.bandcamp_url ? (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-gray-700">Player:</h4>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          <BandcampEmbedPlayer 
            embedUrl={version.bandcamp_url} 
            title={`Player - ${version.name}`}
            height={152}
          />
        </div>
      ) : (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg text-center">
          <Music className="h-6 w-6 text-gray-400 mx-auto mb-1" />
          <p className="text-sm text-gray-500">Player não disponível</p>
        </div>
      )}

      {/* Footer com Data */}
      <div className="flex items-center gap-1 text-xs text-gray-400 pt-2 border-t border-gray-100">
        <Calendar className="h-3 w-3" />
        <span>Adicionada em: {formatDate(version.created_at)}</span>
      </div>
    </div>
  );
};

export default BandcampVersionCard;
