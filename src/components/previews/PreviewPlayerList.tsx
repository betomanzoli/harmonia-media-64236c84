
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Music } from 'lucide-react';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
}

interface PreviewPlayerListProps {
  previews: MusicPreview[];
  selectedVersion: string | null;
  onVersionSelect: (id: string) => void;
  onPlay: (preview: MusicPreview) => void;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  previews,
  selectedVersion,
  onVersionSelect,
  onPlay
}) => {
  if (!previews || previews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma prévia disponível
          </h3>
          <p className="text-gray-500">
            As prévias serão exibidas aqui quando estiverem prontas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {previews.map((preview) => (
        <Card 
          key={preview.id}
          className={`cursor-pointer transition-all ${
            selectedVersion === preview.id 
              ? 'ring-2 ring-harmonia-green border-harmonia-green' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onVersionSelect(preview.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5" />
                {preview.title}
                {preview.recommended && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Recomendado
                  </Badge>
                )}
              </CardTitle>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(preview);
                }}
                size="sm"
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Reproduzir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{preview.description}</p>
            {selectedVersion === preview.id && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  ✓ Esta versão está selecionada para seu feedback
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PreviewPlayerList;
