
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, Download, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Version {
  id: string;
  name: string;
  url: string;
  dateAdded: string;
  recommended?: boolean;
}

interface PreviewVersionsListProps {
  versions: Version[];
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ versions }) => {
  const { toast } = useToast();

  const handlePlay = (version: Version) => {
    // Em produção, reproduzir o áudio
    toast({
      title: "Reproduzindo",
      description: `Reproduzindo a versão: ${version.name}`
    });
  };

  const handleDownload = (version: Version) => {
    // Em produção, disponibilizar o download do arquivo
    toast({
      title: "Download iniciado",
      description: `Baixando a versão: ${version.name}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Versões do projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version) => (
            <div 
              key={version.id} 
              className={`
                flex flex-col sm:flex-row sm:items-center justify-between 
                border-b pb-4 gap-3
                ${version.recommended ? 'bg-harmonia-green/5 -mx-2 p-2 rounded border border-harmonia-green/20' : ''}
              `}
            >
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{version.name}</h3>
                  {version.recommended && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="ml-2 inline-flex items-center">
                            <Star className="h-4 w-4 fill-harmonia-green text-harmonia-green" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Versão recomendada para o cliente</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-sm text-gray-500">Adicionado em {version.dateAdded}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePlay(version)}
                  className="text-harmonia-green"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Ouvir
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(version)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
          
          {versions.length === 0 && (
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma versão disponível ainda.</p>
              <p className="text-sm text-gray-400 mt-2">Adicione uma nova versão para o cliente avaliar.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewVersionsList;
