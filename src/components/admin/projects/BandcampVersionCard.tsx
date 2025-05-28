
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embedUrl: string;
  bandcampUrl: string;
  final?: boolean;
  recommended?: boolean;
  dateAdded: string;
  albumId?: string;
  trackId?: string;
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(version.bandcampUrl).then(() => {
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
    window.open(version.bandcampUrl, '_blank');
  };

  const copyClientPreviewLink = () => {
    const previewUrl = `${window.location.origin}/client-preview/${projectId}`;
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
                Adicionado em: {version.dateAdded}
                {version.trackId && (
                  <span className="ml-2">• Track #{version.trackId}</span>
                )}
              </div>
            </div>
          </div>

          {/* Bandcamp Player */}
          <div className="relative">
            <iframe
              src={version.embedUrl}
              seamless
              style={{ border: 0, width: '100%', height: '120px' }}
              title={`Bandcamp Player: ${version.name}`}
              className="rounded"
              onLoad={() => setIsPlayerLoaded(true)}
            />
            {!isPlayerLoaded && (
              <div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center">
                <div className="text-gray-500 text-sm">Carregando player do Bandcamp...</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenBandcamp}
              className="text-gray-600"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Abrir no Bandcamp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-gray-600"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copiar Link
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyClientPreviewLink}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Copy className="h-4 w-4 mr-1" />
              Link Cliente
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
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

          {/* Debug Info (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-400 mt-2">
              <summary className="cursor-pointer">Debug Info</summary>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify({
                  embedUrl: version.embedUrl,
                  albumId: version.albumId,
                  trackId: version.trackId
                }, null, 2)}
              </pre>
            </details>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;
