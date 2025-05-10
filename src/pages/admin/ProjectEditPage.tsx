
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, PlusCircle, Trash2, Check } from "lucide-react";
import EditVersionItem from '@/components/admin/previews/components/EditVersionItem';
import ContactClientActions from '@/components/admin/previews/components/ContactClientActions';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';

const ProjectEditPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newDeadlineDate, setNewDeadlineDate] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showExtendDeadlineDialog, setShowExtendDeadlineDialog] = useState(false);
  const [newVersion, setNewVersion] = useState({
    name: '',
    description: '',
    audioUrl: '',
    recommended: false,
    final: false
  });
  const { toast } = useToast();
  
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      setProject(projectData);
      setIsLoading(false);
    }
  }, [projectId, getProjectById]);
  
  const handleAddVersionClick = () => {
    setNewVersion({
      name: '',
      description: '',
      audioUrl: '',
      recommended: false,
      final: false
    });
    setShowAddVersionDialog(true);
  };
  
  const handleAddVersion = () => {
    if (!project || !projectId || !newVersion.name || !newVersion.audioUrl) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome da versão e URL do áudio são obrigatórios.',
        variant: 'destructive'
      });
      return;
    }
    
    const versionItem: VersionItem = {
      id: uuidv4(),
      name: newVersion.name,
      description: newVersion.description,
      audioUrl: newVersion.audioUrl,
      dateAdded: new Date().toLocaleDateString('pt-BR'),
      recommended: newVersion.recommended,
      final: newVersion.final
    };
    
    // Create updated version list
    const updatedVersions = project.versionsList ? [...project.versionsList, versionItem] : [versionItem];
    
    // Update the project
    const updatedProject = updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      setShowAddVersionDialog(false);
      
      // Create history entry for new version
      const historyEntry = {
        action: `Nova versão adicionada: ${versionItem.name}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          version: versionItem.id
        }
      };
      
      updateProject(projectId, {
        history: [...(project.history || []), historyEntry]
      });
      
      toast({
        title: 'Versão adicionada',
        description: `A versão "${versionItem.name}" foi adicionada com sucesso.`,
      });
    }
  };
  
  const handleDeleteVersionClick = (versionId: string) => {
    setSelectedVersionId(versionId);
    setShowDeleteDialog(true);
  };

  const handleDeleteVersion = () => {
    if (!project || !projectId || !selectedVersionId) return;
    
    // Find version name before deletion
    const versionName = project.versionsList?.find((v: VersionItem) => v.id === selectedVersionId)?.name || 'Versão';
    
    // Filter out the version to delete
    const updatedVersions = project.versionsList?.filter((v: VersionItem) => v.id !== selectedVersionId) || [];
    
    // Update the project
    const updatedProject = updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      setSelectedVersionId(null);
      setShowDeleteDialog(false);
      
      // Create history entry for deleted version
      const historyEntry = {
        action: `Versão removida: ${versionName}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          version: selectedVersionId
        }
      };
      
      updateProject(projectId, {
        history: [...(project.history || []), historyEntry]
      });
      
      toast({
        title: 'Versão removida',
        description: `A versão foi removida com sucesso.`,
      });
    }
  };

  const handleExtendDeadlineClick = () => {
    setNewDeadlineDate(project.expirationDate || '');
    setShowExtendDeadlineDialog(true);
  };

  const handleExtendDeadline = () => {
    if (!project || !projectId || !newDeadlineDate) return;
    
    // Update the project with the new deadline
    const updatedProject = updateProject(projectId, {
      expirationDate: newDeadlineDate,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      setShowExtendDeadlineDialog(false);
      
      // Create history entry for deadline extension
      const historyEntry = {
        action: `Prazo estendido para: ${newDeadlineDate}`,
        timestamp: new Date().toLocaleString('pt-BR')
      };
      
      updateProject(projectId, {
        history: [...(project.history || []), historyEntry]
      });
      
      toast({
        title: 'Prazo estendido',
        description: `O prazo foi estendido para ${newDeadlineDate}.`,
      });
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin h-8 w-8 border-2 border-harmonia-green rounded-full border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!project) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link to="/admin-j28s7d1k/previews">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <p>O projeto com ID {projectId} não foi encontrado.</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link to="/admin-j28s7d1k/previews">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edição de Projeto: {project.id}</h1>
              <p className="text-gray-500">Cliente: {project.clientName} • Pacote: {project.packageType}</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleExtendDeadlineClick}>
            <Calendar className="mr-2 h-4 w-4" />
            Estender Prazo
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Versões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleAddVersionClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Nova Versão
                  </Button>
                  
                  <Separator />
                  
                  <h3 className="font-medium">Versões do Projeto</h3>
                  <div className="space-y-4">
                    {project.versionsList && project.versionsList.length > 0 ? (
                      project.versionsList.map((version: VersionItem) => (
                        <EditVersionItem
                          key={version.id}
                          version={version}
                          onDelete={handleDeleteVersionClick}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 p-4 text-center">Nenhuma versão adicionada ainda.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Histórico do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                {project.history && project.history.length > 0 ? (
                  <div className="space-y-3">
                    {project.history.map((entry: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md border">
                        <div className="flex justify-between">
                          <span className="font-medium">{entry.action}</span>
                          <span className="text-sm text-gray-500">{entry.timestamp}</span>
                        </div>
                        {entry.data && entry.data.message && (
                          <p className="text-sm mt-1 text-gray-600">{entry.data.message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 p-4 text-center">Nenhum histórico disponível.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">ID do Projeto</p>
                  <p className="font-medium">{project.id}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{project.clientName}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email do Cliente</p>
                  <p className="font-medium">{project.clientEmail || 'Não informado'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Telefone do Cliente</p>
                  <p className="font-medium">{project.clientPhone || 'Não informado'}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pacote</p>
                  <p className="font-medium">{project.packageType}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Tipo de Projeto</p>
                  <p className="font-medium">{project.projectType}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <p 
                    className={`font-medium py-1 px-2 rounded-full text-xs inline-block
                      ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                      project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {project.status}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Data de Adição</p>
                  <p className="font-medium">{project.dateAdded}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Data de Expiração</p>
                  <p className="font-medium">{project.expirationDate}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Última Atividade</p>
                  <p className="font-medium">{project.lastActivityDate || 'Não disponível'}</p>
                </div>
                
                <Separator />
                
                <ContactClientActions
                  clientPhone={project.clientPhone}
                  clientEmail={project.clientEmail}
                  projectId={project.id}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Link de Prévia</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  value={`${window.location.origin}/preview/${project.id}`}
                  readOnly
                />
                <Button 
                  variant="outline" 
                  className="mt-2 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/preview/${project.id}`);
                    toast({
                      title: "Link copiado",
                      description: "O link de prévia foi copiado para a área de transferência"
                    });
                  }}
                >
                  Copiar Link
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Envie este link para o cliente visualizar as prévias
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Add Version Dialog */}
      <Dialog open={showAddVersionDialog} onOpenChange={setShowAddVersionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Versão</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova versão do projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="versionName">Nome da Versão *</Label>
              <Input
                id="versionName"
                placeholder="Ex: Versão 1 - Acústica"
                value={newVersion.name}
                onChange={(e) => setNewVersion({...newVersion, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="versionDescription">Descrição</Label>
              <Textarea
                id="versionDescription"
                placeholder="Descreva detalhes sobre essa versão..."
                value={newVersion.description}
                onChange={(e) => setNewVersion({...newVersion, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audioUrl">URL do Áudio *</Label>
              <Input
                id="audioUrl"
                placeholder="https://exemplo.com/audio.mp3"
                value={newVersion.audioUrl}
                onChange={(e) => setNewVersion({...newVersion, audioUrl: e.target.value})}
              />
              <p className="text-xs text-gray-500">URL do arquivo de áudio (MP3, WAV, etc.)</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="recommended"
                checked={newVersion.recommended}
                onCheckedChange={(checked) => setNewVersion({...newVersion, recommended: checked})}
              />
              <Label htmlFor="recommended">Versão Recomendada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="final"
                checked={newVersion.final}
                onCheckedChange={(checked) => setNewVersion({...newVersion, final: checked})}
              />
              <Label htmlFor="final">Versão Final</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVersionDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddVersion}>
              <Check className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Version Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Versão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover esta versão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteVersion}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remover Versão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Extend Deadline Dialog */}
      <Dialog open={showExtendDeadlineDialog} onOpenChange={setShowExtendDeadlineDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Estender Prazo</DialogTitle>
            <DialogDescription>
              Defina uma nova data de expiração para este projeto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="deadlineDate">Nova Data de Expiração</Label>
              <Input
                id="deadlineDate"
                type="date"
                value={newDeadlineDate}
                onChange={(e) => setNewDeadlineDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendDeadlineDialog(false)}>Cancelar</Button>
            <Button onClick={handleExtendDeadline}>
              <Calendar className="mr-2 h-4 w-4" />
              Atualizar Prazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProjectEditPage;
