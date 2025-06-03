// src/components/admin/projects/BandcampVersionCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, ExternalLink, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import { useProjects } from '@/hooks/admin/useProjects_with_private_link'; // Import hook to use deleteVersion
import { ProjectVersion } from '@/hooks/admin/useProjects_with_private_link'; // Import updated interface

interface BandcampVersionCardProps {
  version: ProjectVersion; // Use the updated interface
  projectId: string;
  onDeleteSuccess?: () => void; // Callback after successful deletion
}

const BandcampVersionCard: React.FC<BandcampVersionCardProps> = ({
  version,
  projectId,
  onDeleteSuccess
}) => {
  const { toast } = useToast();
  const { deleteVersion } = useProjects(); // Get delete function from the hook
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Determine which URL to use and the type
  const isPrivateLink = !!version.bandcamp_private_url;
  const displayUrl = version.bandcamp_private_url || version.embed_url || version.audio_url || '';
  const originalUrl = version.bandcamp_private_url || version.original_bandcamp_url || version.audio_url || '';

  const handleCopyLink = async () => {
    const linkToCopy = originalUrl || displayUrl;
    if (linkToCopy) {
      try {
        await navigator.clipboard.writeText(linkToCopy);
        toast({ title: "Link copiado!", description: "O link foi copiado." });
      } catch (error) {
        console.error('Erro ao copiar link:', error);
        toast({ title: "Erro", description: "Não foi possível copiar o link.", variant: "destructive" });
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja remover a versão "${version.name}"?`)) {
      setIsDeleting(true);
      const result = await deleteVersion(version.id, projectId);
      setIsDeleting(false);
      if (result.success) {
        toast({ title: "Versão Removida", description: `A versão "${version.name}" foi removida.` });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast({ title: "Erro ao Remover", description: result.error || "Não foi possível remover a versão.", variant: "destructive" });
      }
    }
  };

  const handleOpenLink = () => {
    const urlToOpen = originalUrl || displayUrl;
    if (urlToOpen) {
      // Abre em nova janela com tamanho um pouco maior para links privados
      const windowFeatures = isPrivateLink ? "noopener,noreferrer,width=1000,height=700" : "noopener,noreferrer";
      window.open(urlToOpen, '_blank', windowFeatures);
    }
  };

  return (
    <Card className="w-full border rounded-lg overflow-hidden shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg break-words">{version.name}</h3>
            {version.recommended && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs whitespace-nowrap">
                Recomendada
              </Badge>
            )}
            {isPrivateLink && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                Link Privado
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 sm:text-right whitespace-nowrap">
            Adicionado em: {new Date(version.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {version.description && (
          <p className="text-sm text-gray-600 mb-3 break-words">{version.description}</p>
        )}

        {/* Player ou Botão de Link Privado */}
        <div className="mb-4">
          {isPrivateLink ? (
            <div className="p-4 bg-blue-50 rounded border border-blue-200 flex flex-col items-center justify-center text-center min-h-[120px]">
              <Music className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-blue-800 font-medium mb-3">Esta versão utiliza um Link Privado.</p>
              <Button onClick={handleOpenLink} size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Link Privado no Bandcamp
              </Button>
            </div>
          ) : embedUrl ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">🎵 Player Incorporado</p>
              <BandcampEmbedPlayer
                embedUrl={embedUrl}
                title={version.name}
                fallbackUrl={originalUrl}
                className="w-full h-32 md:h-28" // Mantém altura padrão para player
              />
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded text-center border">
              <p className="text-gray-600 font-medium">⚠️ Nenhuma URL de áudio (Embed ou Privada) encontrada.</p>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            disabled={!originalUrl && !displayUrl}
            title={originalUrl || displayUrl ? "Copiar link" : "Nenhum link disponível"}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Link
          </Button>

          {/* Botão "Abrir no Bandcamp" só faz sentido se não for link privado já tratado acima */}
          {!isPrivateLink && originalUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenLink}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir no Bandcamp
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Removendo...' : 'Remover'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;

