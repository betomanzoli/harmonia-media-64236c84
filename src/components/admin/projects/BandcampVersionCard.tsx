import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';

interface BandcampVersion {
  id: string;
  name: string;
  description?: string;
  embed_url: string;
  original_bandcamp_url?: string;
  final?: boolean;
  recommended?: boolean;
  created_at: string;
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
    const linkToCopy = version.original_bandcamp_url || version.embed_url;
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
            {version.final && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Final
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

        {/* ✅ PLAYER BANDCAMP SEM LINK EXTERNO */}
        <div className="mb-4">
          <BandcampEmbedPlayer 
            embedUrl={version.embed_url}
            title={version.name}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar Link
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
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
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;
