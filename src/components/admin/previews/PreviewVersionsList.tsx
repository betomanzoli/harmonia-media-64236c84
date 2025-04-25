
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Trash, Star, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Version {
  id: string;
  name: string;
  description?: string;
  dateAdded: string;
  fileId?: string;
  audioUrl?: string;
  recommended?: boolean;
}

interface PreviewVersionsListProps {
  versions: Version[];
  onDeleteVersion?: (id: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ versions, onDeleteVersion }) => {
  const { toast } = useToast();
  const [playing, setPlaying] = React.useState<string | null>(null);

  const handlePlay = (version: Version) => {
    // Would normally play the audio, but for demo we'll just show toast
    setPlaying(version.id);
    toast({
      title: `Reproduzindo: ${version.name}`,
      description: "Iniciando reprodução da prévia..."
    });
    
    // Reset after 3 seconds for demo
    setTimeout(() => {
      setPlaying(null);
    }, 3000);
  };

  const handleDownload = (version: Version) => {
    // Would normally download, but for demo we'll just show toast
    toast({
      title: "Download iniciado",
      description: `Baixando "${version.name}" para seu dispositivo.`
    });
  };

  const handleDelete = (id: string) => {
    if (onDeleteVersion) {
      onDeleteVersion(id);
      toast({
        title: "Versão excluída",
        description: "A versão foi excluída com sucesso."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versões Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-500">
            <Music className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium mb-1">Nenhuma versão disponível</h3>
            <p>Adicione uma nova versão para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`border rounded-lg p-4 transition-colors ${version.recommended ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-lg">{version.name}</h4>
                      {version.recommended && (
                        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">
                          <Star className="h-3 w-3 mr-1" />
                          Recomendada
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{version.description || 'Sem descrição'}</p>
                    <p className="text-xs text-gray-400">Adicionada em: {version.dateAdded}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant={playing === version.id ? 'default' : 'outline'}
                      onClick={() => handlePlay(version)}
                      className={playing === version.id ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''}
                    >
                      <Play className={`h-4 w-4 ${playing === version.id ? 'mr-1' : ''}`} />
                      {playing === version.id && <span>Reproduzindo</span>}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownload(version)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {onDeleteVersion && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:bg-red-50 border-red-200"
                        onClick={() => handleDelete(version.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewVersionsList;
