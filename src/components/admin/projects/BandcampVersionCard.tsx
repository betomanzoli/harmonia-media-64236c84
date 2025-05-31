import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';

interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embed_url?: string; // ✅ Campo correto do schema
  bandcamp_url?: string; // ✅ Campo alternativo
  original_bandcamp_url?: string;
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

  // ✅ BUSCAR URL EM MÚLTIPLOS CAMPOS:
  const embedUrl = version.embed_url || version.bandcamp_url || '';
  
  console.log('[BandcampVersionCard] Version data:', {
    id: version.id,
    name: version.name,
    embed_url: version.embed_url,
    bandcamp_url: version.bandcamp_url,
    finalEmbedUrl: embedUrl
  });

  const handleCopyLink = () => {
    const linkToCopy = version.original_bandcamp_url || embedUrl;
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

        {/* ✅ PLAYER BANDCAMP COM DEBUG */}
        <div className="mb-4">
          {embedUrl ? (
            <BandcampEmbedPlayer 
              embedUrl={embedUrl}
              title={version.name}
            />
          ) : (
            <div className="p-4 bg-yellow-50 rounded text-center border border-yellow-200">
              <p className="text-yellow-700">Nenhuma URL de player encontrada</p>
              <p className="text-xs text-yellow-600 mt-1">
                embed_url: {version.embed_url || 'null'}<br/>
                bandcamp_url: {version.bandcamp_url || 'null'}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
            disabled={!embedUrl}
          >
            <Copy className="h-4 w-4" />
            Copiar Link
          </Button>

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
