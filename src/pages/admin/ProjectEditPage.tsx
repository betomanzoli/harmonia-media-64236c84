
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { usePreviewProjects, VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Copy, Edit, Trash2, PlusCircle, MessageSquare, Mail } from "lucide-react";
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ContactClientActions from '@/components/admin/previews/components/ContactClientActions';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProjectEditPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, updateProject } = usePreviewProjects();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newDeadlineDate, setNewDeadlineDate] = useState('');
  const [showExtendDeadlineDialog, setShowExtendDeadlineDialog] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (projectId) {
      const projectData = getProjectById(projectId);
      setProject(projectData);
      setIsLoading(false);
    }
  }, [projectId, getProjectById]);
  
  const handleAddVersion = (newVersion: VersionItem) => {
    if (!project || !projectId) return;
    
    // Create updated version list
    const updatedVersions = project.versionsList ? [...project.versionsList, newVersion] : [newVersion];
    
    // Update the project
    const updatedProject = updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    if (updatedProject) {
      setProject(updatedProject);
      
      // Create history entry for new version
      const historyEntry = {
        action: `Nova versão adicionada: ${newVersion.name}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          version: newVersion.id
        }
      };
      
      updateProject(projectId, {
        history: [historyEntry]
      });
      
      toast({
        title: 'Versão adicionada',
        description: `A versão "${newVersion.name}" foi adicionada com sucesso.`,
      });
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!project || !projectId) return;
    
    // Filter out the version to delete
    const updatedVersions = project.versionsList?.filter((v: VersionItem) => v.id !== versionId) || [];
    
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
      const versionName = project.versionsList?.find((v: VersionItem) => v.id === versionId)?.name || 'Versão';
      const historyEntry = {
        action: `Versão removida: ${versionName}`,
        timestamp: new Date().toLocaleString('pt-BR'),
        data: {
          version: versionId
        }
      };
      
      updateProject(projectId, {
        history: [historyEntry]
      });
      
      toast({
        title: 'Versão removida',
        description: `A versão foi removida com sucesso.`,
      });
    }
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Versões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={() => setSelectedVersionId(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Nova Versão
                  </Button>
                  
                  <Separator />
                  
                  <h3 className="font-medium">Versões do Projeto</h3>
                  <div className="space-y-4">
                    {project.versionsList && project.versionsList.length > 0 ? (
                      project.versionsList.map((version: VersionItem) => (
                        <div 
                          key={version.id} 
                          className="flex items-center justify-between p-4 border rounded-md bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium">{version.name}</h4>
                            <p className="text-sm text-gray-600">{version.description || 'Sem descrição'}</p>
                            <div className="text-xs text-gray-500 mt-1">Adicionado em: {version.dateAdded}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedVersionId(version.id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
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
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{project.id}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(project.id);
                        toast({ title: "ID Copiado", description: "ID do projeto copiado para a área de transferência" });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {project.status === 'waiting' ? 'Aguardando' : 
                     project.status === 'feedback' ? 'Feedback Recebido' : 
                     project.status === 'approved' ? 'Aprovado' : 'Desconhecido'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{project.clientName}</p>
                  <p className="text-sm text-gray-500">{project.clientEmail}</p>
                  {project.clientPhone && <p className="text-sm text-gray-500">{project.clientPhone}</p>}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Data de Criação</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{project.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Expira em</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-500" />
                      <p className="font-medium text-amber-600">{project.expirationDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Link de Prévia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded border break-all">
                  <p className="text-sm">{window.location.origin}/preview/{project.id}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const url = `${window.location.origin}/preview/${project.id}`;
                    navigator.clipboard.writeText(url);
                    toast({
                      title: "Link copiado",
                      description: "Link de prévia copiado para a área de transferência"
                    });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Link
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowExtendDeadlineDialog(true)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Estender Prazo
                  </Button>
                  
                  <ContactClientActions 
                    clientPhone={project.clientPhone}
                    clientEmail={project.clientEmail}
                    projectId={project.id}
                    onDeleteVersion={handleDeleteVersion}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Dialog for extending deadline */}
        <Dialog 
          open={showExtendDeadlineDialog} 
          onOpenChange={setShowExtendDeadlineDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Estender Prazo</DialogTitle>
              <DialogDescription>
                Defina uma nova data de expiração para este projeto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Nova data de expiração</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newDeadlineDate}
                  onChange={(e) => setNewDeadlineDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExtendDeadlineDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExtendDeadline}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog for deleting version */}
        <Dialog 
          open={showDeleteDialog} 
          onOpenChange={setShowDeleteDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Versão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedVersionId && handleDeleteVersion(selectedVersionId)}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProjectEditPage;
