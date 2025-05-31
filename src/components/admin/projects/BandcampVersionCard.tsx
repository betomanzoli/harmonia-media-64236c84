import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Interface atualizada para refletir os dados esperados (incluindo embed_url)
interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embed_url: string; // <-- Espera receber a URL de embed
  original_bandcamp_url?: string; // <-- URL original para referência/botão
  final?: boolean;
  recommended?: boolean;
  created_at: string; // ou Date
}

interface BandcampVersionCardProps {
  version: BandcampVersion;
  projectId: string;
  onDeleteVersion: (versionId: string) => void;
}

const BandcampVersionCard: React.FC<BandcampVersionCardProps> = ({
  version,
  projectId,
  onDeleteVersion
}) => {
  const { toast } = useToast();
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  // Usa a URL original para copiar e abrir no Bandcamp, se disponível
  const bandcampLink = version.original_bandcamp_url || version.embed_url; 

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bandcampLink).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link do Bandcamp foi copiado para a área de transferência."
      });
    }).catch(err => {
      console.error('Erro ao copiar link:', err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    });
  };

  const handleOpenBandcamp = () => {
    window.open(bandcampLink, '_blank');
  };

  const copyClientPreviewLink = () => {
    // Assume que a lógica para obter o preview_code está no componente pai ou contexto
    // Aqui, apenas montamos a URL baseada no projectId para simplificar
    // Idealmente, buscaria o preview_code associado ao projeto
    const previewUrl = `${window.location.origin}/client-preview/${projectId}`; // Ajustar se o previewCode for diferente do projectId
    navigator.clipboard.writeText(previewUrl).then(() => {
      toast({
        title: "Link de prévia copiado!",
        description: "Link para o cliente foi copiado para a área de transferência."
      });
    });
  };

  return (
    <Card className={`bg-white ${version.final ? 'border-green-500 border-2' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{version.name}</h3>
                <div className="flex gap-1">
                  {version.recommended && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Recomendada
                    </Badge>
                  )}
                  {version.final && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Final
                    </Badge>
                  )}
                </div>
              </div>
              
              {version.description && (
                <p className="text-gray-600 text-sm mb-2">{version.description}</p>
              )}
              
              <div className="text-xs text-gray-500">
                Adicionado em: {new Date(version.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Bandcamp Player - Usa embed_url */}
          <div className="relative min-h-[120px]"> {/* Garante altura mínima */}
            {!isPlayerLoaded && (
              <div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center z-0">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-500 text-sm">Carregando player...</span>
              </div>
            )}
            <iframe
              src={version.embed_url} // <-- USA A URL DE EMBED AQUI
              seamless
              style={{ border: 0, width: '100%', height: '120px' }} 
              title={`Bandcamp Player: ${version.name}`}
              className={`rounded transition-opacity duration-300 ${isPlayerLoaded ? 'opacity-100 z-10 relative' : 'opacity-0'}`}
              onLoad={() => setIsPlayerLoaded(true)}
              onError={() => {
                // Opcional: Lidar com erro de carregamento do iframe
                console.error("Erro ao carregar iframe do Bandcamp para:", version.embed_url);
                setIsPlayerLoaded(true); // Para remover o loader mesmo em caso de erro
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenBandcamp}
              className="text-gray-600"
              disabled={!bandcampLink} // Desabilita se não houver link
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Abrir no Bandcamp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-gray-600"
              disabled={!bandcampLink}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copiar Link
            </Button>

            {/* O botão de copiar link cliente pode fazer mais sentido na página de detalhes do projeto */}
            {/* <Button
              variant="outline"
              size="sm"
              onClick={copyClientPreviewLink}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Copy className="h-4 w-4 mr-1" />
              Link Cliente
            </Button> */}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto" // ml-auto para empurrar para a direita
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover versão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover "{version.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteVersion(version.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;

