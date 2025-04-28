
import React from 'react';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Trash, Calendar } from 'lucide-react';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface PreviewVersionsListProps {
  versions: VersionItem[];
  projectId: string;
  onDeleteVersion: (versionId: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({
  versions,
  projectId,
  onDeleteVersion
}) => {
  const handleDelete = (versionId: string) => {
    if (confirm("Tem certeza que deseja remover esta versão?")) {
      onDeleteVersion(versionId);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="h-5 w-5 mr-2 text-gray-500" />
          Versões Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500 mb-2">Nenhuma versão adicionada ainda</p>
            <p className="text-xs text-gray-400">
              Adicione uma nova versão clicando no botão "Adicionar Nova Versão"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`p-4 rounded-md border ${version.recommended ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center">
                      {version.name}
                      {version.recommended && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">Recomendada</Badge>
                      )}
                    </h4>
                    
                    {version.description && (
                      <p className="text-sm text-gray-600 mt-1">{version.description}</p>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Adicionado em {version.dateAdded}</span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(version.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 break-all">
                    <strong>Link:</strong> {version.audioUrl || version.fileId || "Sem link"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
};

export default PreviewVersionsList;
