
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';

interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embed_url?: string;
  bandcamp_url?: string;
  original_bandcamp_url?: string;
  audio_url?: string;
  recommended?: boolean;
  created_at: string;
}

interface BandcampVersionCardProps {
  version: BandcampVersion;
  projectId: string;
  onDeleteVersion?: (versionId: string) => void;
}

const BandcampVersionCard: React.FC<BandcampVersionCardProps> = ({
  version,
  projectId,
  onDeleteVersion
}) => {
  const { toast } = useToast();

  // Buscar a melhor URL disponível em ordem de prioridade
  const embedUrl = version.embed_url || version.bandcamp_url || version.audio_url || '';
  const originalUrl = version.bandcamp_url || version.audio_url || version.original_bandcamp_url || '';
  
  console.log('[BandcampVersionCard] Version data:', {
    id: version.id,
    name: version.name,
    embed_url: version.embed_url,
    bandcamp_url: version.bandcamp_url,
    audio_url: version.audio_url,
    original_bandcamp_url: version.original_bandcamp_url,
    finalEmbedUrl: embedUrl,
    finalOriginalUrl: originalUrl
  });

  const handleCopyLink = () => {
    const linkToCopy = originalUrl || embedUrl;
    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência."
        });
      }).catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
    }
  };

  const handleDelete = () => {
    if (onDeleteVersion) {
      onDeleteVersion(version.id);
    }
  };

  const handleOpenOriginal = () => {
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{version.name}</h3>
            {version.recommended && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Recomendada
              </Badge>
            )}
          </div>
        </div>

        {version.description && (
          <p className="text-sm text-gray-600 mb-3">{version.description}</p>
        )}

        <p className="text-xs text-gray-400 mb-4">
          Adicionado em: {new Date(version.created_at).toLocaleDateString('pt-BR')}
        </p>

        {/* Player Bandcamp */}
        <div className="mb-4">
          {embedUrl ? (
            <BandcampEmbedPlayer 
              embedUrl={embedUrl}
              title={version.name}
              fallbackUrl={originalUrl}
            />
          ) : (
            <div className="p-4 bg-red-50 rounded text-center border border-red-200">
              <p className="text-red-700 font-medium">❌ Nenhuma URL válida encontrada</p>
              <div className="text-xs text-red-600 mt-2 space-y-1">
                <p>embed_url: {version.embed_url || 'null'}</p>
                <p>bandcamp_url: {version.bandcamp_url || 'null'}</p>
                <p>audio_url: {version.audio_url || 'null'}</p>
                <p>original_bandcamp_url: {version.original_bandcamp_url || 'null'}</p>
              </div>
            </div>
          )}
        </div>

        {/* URLs Debug Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium mb-2">URLs disponíveis:</p>
          <div className="space-y-1">
            <p><strong>Embed:</strong> {embedUrl || 'N/A'}</p>
            <p><strong>Original:</strong> {originalUrl || 'N/A'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
            disabled={!embedUrl && !originalUrl}
          >
            <Copy className="h-4 w-4" />
            Copiar Link
          </Button>

          {originalUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenOriginal}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir no Bandcamp
            </Button>
          )}

          {onDeleteVersion && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;
