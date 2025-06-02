
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

  const embedUrl = version.embed_url || version.bandcamp_url || version.audio_url || '';
  const originalUrl = version.bandcamp_url || version.audio_url || version.original_bandcamp_url || '';

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('project_versions')
        .delete()
        .eq('id', version.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Versão removida com sucesso"
      });

      if (onDeleteVersion) {
        onDeleteVersion(version.id);
      }
    } catch (error: any) {
      console.error('[BandcampVersionCard] Erro ao deletar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a versão.",
        variant: "destructive"
      });
    }
  };

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

        <div className="mb-4">
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
            className="text-red-600 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BandcampVersionCard;
