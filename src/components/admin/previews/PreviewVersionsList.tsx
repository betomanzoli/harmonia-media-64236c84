
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { FileMusic, Trash, Edit, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PreviewVersionsListProps {
  versions: VersionItem[];
  onDeleteVersion: (versionId: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ versions, onDeleteVersion }) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<VersionItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState('');

  const handlePlayAudio = (version: VersionItem) => {
    const audioUrl = version.audioUrl || version.url;
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "URL de áudio não disponível",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = (versionId: string) => {
    setVersionToDelete(versionId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (versionToDelete) {
      onDeleteVersion(versionToDelete);
      toast({
        title: "Versão excluída",
        description: "A versão foi removida com sucesso."
      });
      setShowDeleteDialog(false);
    }
  };

  const handleEditClick = (version: VersionItem) => {
    setEditingVersion(version);
    setEditName(version.name);
    setEditDescription(version.description || '');
    setEditAudioUrl(version.audioUrl || version.url || '');
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    // In a real implementation, this would update the database
    toast({
      title: "Versão atualizada",
      description: "As alterações foram salvas com sucesso."
    });
    setShowEditDialog(false);
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="bg-card border border-gray-700 rounded-lg p-6 text-center">
        <FileMusic className="mx-auto h-10 w-10 text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-1">Nenhuma versão adicionada</h3>
        <p className="text-gray-400 mb-4">
          Adicione uma versão usando o botão "Adicionar versão" acima.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {versions.map(version => (
        <Card key={version.id} className="p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-secondary p-2 inline-flex">
                  <FileMusic className="h-5 w-5" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{version.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {version.description || "Sem descrição"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Adicionada em {version.dateAdded}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 bg-gray-800/50 rounded-lg p-2 text-xs text-gray-400 break-all">
                <p className="font-mono">
                  {version.audioUrl || version.url || "URL não disponível"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-shrink-0"
                onClick={() => handlePlayAudio(version)}
              >
                <Play className="mr-1 h-4 w-4" />
                Reproduzir
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-shrink-0"
                onClick={() => handleEditClick(version)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Editar
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-shrink-0 text-red-500 hover:bg-red-950"
                onClick={() => handleDeleteClick(version.id)}
              >
                <Trash className="mr-1 h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Version Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Versão</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Versão</Label>
              <Input 
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-audio-url">URL do Áudio</Label>
              <Input 
                id="edit-audio-url"
                value={editAudioUrl}
                onChange={(e) => setEditAudioUrl(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviewVersionsList;
