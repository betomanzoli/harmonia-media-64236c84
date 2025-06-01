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

  console.log('[BandcampVersionCard] Renderizando versão de forma segura:', version.id, version.name);

  const embedUrl = version.embed_url || version.bandcamp_url || version.audio_url || '';
  const originalUrl = version.bandcamp_url || version.audio_url || version.original_bandcamp_url || '';
  
  console.log('[BandcampVersionCard] URLs processadas de forma segura:', {
    id: version.id,
    name: version.name,
    finalEmbedUrl: embedUrl,
    finalOriginalUrl: originalUrl
  });

  // ✅ HANDLERS COM TRY-CATCH PARA EVITAR CRASHES:
  const handleCopyLink = async () => {
    try {
      const linkToCopy = originalUrl || embedUrl;
      if (linkToCopy) {
        await navigator.clipboard.writeText(linkToCopy);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência."
        });
      }
    } catch (error) {
      console.error('[BandcampVersionCard] Erro ao copiar link:', error);
      // ✅ FALLBACK SILENCIOSO:
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    try {
      if (onDeleteVersion) {
        onDeleteVersion(version.id);
      }
    } catch (error) {
      console.error('[BandcampVersionCard] Erro ao deletar:', error);
      // ✅ NÃO QUEBRAR A INTERFACE:
      toast({
        title: "Erro",
        description: "Não foi possível remover a versão.",
        variant: "destructive"
      });
    }
  };

  const handleOpenOriginal = () => {
    try {
      if (originalUrl) {
        window.open(originalUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('[BandcampVersionCard] Erro ao abrir URL:', error);
      // ✅ FALLBACK SILENCIOSO
    }
  };

  // ✅ RENDER COM ERROR BOUNDARY IMPLÍCITO:
  try {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
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

          {/* ✅ PLAYER COM ISOLAMENTO: */}
          <div className="mb-4" style={{ isolation: 'isolate' }}>
            {embedUrl ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">🎵 Player Bandcamp</p>
                <BandcampEmbedPlayer 
                  embedUrl={embedUrl}
                  title={version.name}
                  fallbackUrl={originalUrl}
                />
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded text-center border border-red-200">
                <p className="text-red-700 font-medium">❌ Nenhuma URL válida encontrada</p>
              </div>
            )}
          </div>

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
  } catch (error) {
    console.error('[BandcampVersionCard] Erro crítico no render:', error);
    // ✅ FALLBACK SEGURO PARA EVITAR TELA PRETA:
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-4">
          <p className="text-red-600">Erro ao carregar versão: {version.name}</p>
          <p className="text-xs text-gray-500 mt-2">ID: {version.id}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Recarregar página
          </Button>
        </CardContent>
      </Card>
    );
  }
};

export default BandcampVersionCard;
