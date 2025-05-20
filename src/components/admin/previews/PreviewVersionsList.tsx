import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Check, Edit, Plus } from 'lucide-react';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import AddVersionDialog from './AddVersionDialog';

interface PreviewVersionsListProps {
  versions: VersionItem[];
  projectId: string;
  onDeleteVersion?: (versionId: string) => void;
  onAddVersion?: (version: VersionItem) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ 
  versions, 
  projectId,
  onDeleteVersion,
  onAddVersion
}) => {
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (versionId: string) => {
    setVersionToDelete(versionId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (versionToDelete && onDeleteVersion) {
      onDeleteVersion(versionToDelete);
      setIsDeleteDialogOpen(false);
      setVersionToDelete(null);
    }
  };

  const handleAddVersion = (version: VersionItem) => {
    if (onAddVersion) {
      onAddVersion(version);
      setShowAddVersion(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg">Versões da Prévia</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddVersion(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Versão
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {versions.length > 0 ? (
          <div className="space-y-4">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`p-4 border rounded-md ${version.recommended ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{version.name}</h3>
                      {version.recommended && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Recomendada
                        </Badge>
                      )}
                      {version.final && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Final
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Adicionada em: {version.dateAdded}
                    </p>
                    {version.description && (
                      <p className="text-sm">{version.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(version.audioUrl || version.url, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Ouvir
                    </Button>
                    
                    {onDeleteVersion && (
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(version.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a versão "{version.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={confirmDelete}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                
                {/* Additional links section for final versions */}
                {version.additionalLinks && version.additionalLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">Arquivos adicionais:</h4>
                    <div className="space-y-2">
                      {version.additionalLinks.map((link, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{link.label}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Ouvir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma versão adicionada ainda. Clique em "Adicionar Versão" para começar.
          </div>
        )}
      </CardContent>
      
      {/* Add version dialog */}
      <AddVersionDialog 
        projectId={projectId}
        isOpen={showAddVersion}
        onClose={() => setShowAddVersion(false)}
        onAddVersion={handleAddVersion}
      />
    </Card>
  );
};

export default PreviewVersionsList;
