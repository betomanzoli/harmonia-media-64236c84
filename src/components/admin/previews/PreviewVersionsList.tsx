
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pencil, Trash, Check } from 'lucide-react';
import GoogleDriveAudioPlayer from '@/components/previews/GoogleDriveAudioPlayer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  audioUrl?: string;
  url?: string;
  dateAdded: string;
  recommended?: boolean;
}

interface PreviewVersionsListProps {
  versions: VersionItem[];
  projectId: string;
  onDeleteVersion?: (id: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({
  versions,
  projectId,
  onDeleteVersion
}) => {
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getFileId = (version: VersionItem): string => {
    if (version.fileId) return version.fileId;
    
    const url = version.audioUrl || version.url || '';
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  };
  
  const handleConfirmDelete = () => {
    if (versionToDelete && onDeleteVersion) {
      onDeleteVersion(versionToDelete);
      setVersionToDelete(null);
    }
  };
  
  const handlePlayAudio = (version: VersionItem) => {
    const fileId = getFileId(version);
    if (fileId) {
      window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank');
    } else {
      toast({
        title: "Erro ao reproduzir",
        description: "Não foi possível encontrar o ID do arquivo de áudio.",
        variant: "destructive"
      });
    }
  };

  if (!versions || versions.length === 0) {
    return (
      <div>
        <CardHeader>
          <CardTitle>Versões do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500">Nenhuma versão adicionada.</p>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Versões do Projeto ({versions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {versions.map((version) => (
              <Card key={version.id} className="overflow-hidden">
                <div className={`p-4 border-l-4 ${version.recommended ? 'border-l-harmonia-green' : 'border-l-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{version.name}</h3>
                        {version.recommended && (
                          <Badge variant="outline" className="bg-harmonia-green/10 text-harmonia-green border-harmonia-green">
                            <Check className="w-3 h-3 mr-1" /> Recomendada
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Adicionada em: {version.dateAdded}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handlePlayAudio(version)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Ouvir completo
                      </Button>
                      {onDeleteVersion && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setVersionToDelete(version.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    {version.description}
                  </div>
                  
                  <div className="mt-4">
                    {getFileId(version) ? (
                      <GoogleDriveAudioPlayer
                        fileId={getFileId(version)}
                        title={version.name}
                        isPreview={true}
                      />
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-500">
                        Nenhum arquivo de áudio vinculado. Adicione um ID de arquivo do Google Drive.
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!versionToDelete} onOpenChange={() => setVersionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir versão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PreviewVersionsList;
