
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePreviewProjects } from '@/hooks/admin/usePreviewProjects';
import { notificationService } from '@/services/notificationService';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectStatusCard from '@/components/admin/previews/ProjectStatusCard';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ClientFeedbackCard from '@/components/admin/previews/ClientFeedbackCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import AddVersionForm from '@/components/admin/previews/AddVersionForm';
import NotificationGuide from '@/components/admin/guides/NotificationGuide';
import { ArrowLeft, FileMusic, MessageCircle, Clock, Calendar, Send, Copy, HelpCircle, AlertTriangle } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any | null>(null);
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [extensionDays, setExtensionDays] = useState('7');
  const { projects, updateProject, getProjectById } = usePreviewProjects();

  const copyPreviewLink = () => {
    const link = `${window.location.origin}/preview/${projectId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Link de prévia copiado para a área de transferência.",
    });
  };

  const sendNotification = () => {
    if (!notificationMessage.trim()) {
      toast({
        title: "Erro",
        description: "A mensagem de notificação não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    console.log(`Enviando notificação para ${project?.clientEmail}: ${notificationMessage}`);
    
    notificationService.notify('new_preview', {
      projectId,
      message: notificationMessage,
      clientName: project?.clientName,
      clientEmail: project?.clientEmail
    });

    toast({
      title: "Notificação enviada",
      description: "O cliente foi notificado com sucesso.",
    });

    setShowNotifyDialog(false);
    setNotificationMessage('');

    updateProjectHistory('notification_sent', { message: notificationMessage });
  };

  const extendDeadline = () => {
    const days = parseInt(extensionDays);
    if (isNaN(days) || days <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, informe um número válido de dias.",
        variant: "destructive"
      });
      return;
    }

    const currentDate = new Date(project?.expirationDate.split('/').reverse().join('-') || '');
    currentDate.setDate(currentDate.getDate() + days);
    const newExpirationDate = currentDate.toLocaleDateString('pt-BR');

    const updatedProject = {
      ...project,
      expirationDate: newExpirationDate
    };
    setProject(updatedProject);
    
    if (updateProject && projectId) {
      updateProject(projectId, { expirationDate: newExpirationDate });
    }

    toast({
      title: "Prazo estendido",
      description: `O prazo de avaliação foi estendido em ${days} dias.`,
    });

    setShowExtendDialog(false);
    setExtensionDays('7');

    updateProjectHistory('deadline_extended', { days, newDate: newExpirationDate });
  };

  const deleteVersion = (versionId: string) => {
    if (!project || !project.versionsList) return;
    
    const updatedVersions = project.versionsList.filter((v: any) => v.id !== versionId);
    
    const updatedProject = {
      ...project,
      versionsList: updatedVersions,
      versions: updatedVersions.length
    };
    
    setProject(updatedProject);
    
    if (updateProject && projectId) {
      updateProject(projectId, { 
        versions: updatedVersions.length,
        versionsList: updatedVersions
      });
    }
    
    updateProjectHistory('version_deleted', { versionId });
  };

  const updateProjectHistory = (actionType: string, data: any) => {
    if (!project) return;
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    
    let actionDescription = '';
    switch (actionType) {
      case 'notification_sent':
        actionDescription = 'Notificação enviada ao cliente';
        break;
      case 'deadline_extended':
        actionDescription = `Prazo estendido em ${data.days} dias`;
        break;
      case 'version_added':
        actionDescription = `Versão "${data.name}" adicionada`;
        break;
      case 'version_deleted':
        actionDescription = `Versão removida`;
        break;
      case 'status_updated':
        actionDescription = `Status alterado para ${data.status}`;
        break;
      case 'feedback_recorded':
        actionDescription = 'Feedback do cliente registrado';
        break;
      default:
        actionDescription = 'Ação realizada';
    }

    const newHistoryItem = {
      action: actionDescription,
      timestamp,
      data
    };

    const updatedHistory = project.history 
      ? [newHistoryItem, ...project.history] 
      : [newHistoryItem];
    
    setProject({
      ...project,
      history: updatedHistory
    });
    
    if (updateProject && projectId) {
      updateProject(projectId, { history: updatedHistory });
    }
  };

  // Função para atualizar o status do projeto
  const updateProjectStatus = (newStatus: 'waiting' | 'feedback' | 'approved') => {
    if (!project || project.status === newStatus) return;
    
    const updatedProject = {
      ...project,
      status: newStatus
    };
    
    setProject(updatedProject);
    
    if (updateProject && projectId) {
      updateProject(projectId, { status: newStatus });
      
      // Registrar a mudança de status no histórico
      updateProjectHistory('status_updated', { 
        previousStatus: project.status,
        status: newStatus 
      });
      
      toast({
        title: "Status atualizado",
        description: `O status do projeto foi atualizado para ${newStatus}.`,
      });
    }
  };

  // Função para salvar feedback do cliente
  const saveFeedback = (feedbackText: string) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      feedback: feedbackText,
      status: 'feedback' as const // Atualiza o status para feedback
    };
    
    setProject(updatedProject);
    
    if (updateProject && projectId) {
      updateProject(projectId, { 
        feedback: feedbackText,
        status: 'feedback'
      });
      
      // Registrar o feedback no histórico
      updateProjectHistory('feedback_recorded', { feedback: feedbackText });
      
      toast({
        title: "Feedback salvo",
        description: "O feedback do cliente foi registrado com sucesso.",
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
      } else {
        toast({
          title: "Projeto não encontrado",
          description: `Não foi possível encontrar o projeto com ID ${projectId}.`,
          variant: "destructive"
        });
      }
      
      setLoading(false);
    }
  }, [projectId, projects, toast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center flex-col p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-6">
              O projeto com ID {projectId} não foi encontrado no sistema.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/admin-j28s7d1k/previews">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar às prévias
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="mr-2"
              >
                <Link to="/admin-j28s7d1k/previews">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Projeto: {project.id}</h1>
            </div>
            <p className="text-gray-500">{project.clientName} - {project.packageType}</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex items-center"
              onClick={copyPreviewLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar link
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowNotifyDialog(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Notificar cliente
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="versions">
              <TabsList className="w-full">
                <TabsTrigger value="versions" className="flex-1">
                  <FileMusic className="mr-2 h-4 w-4" />
                  Versões
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  <Clock className="mr-2 h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="versions" className="p-4 bg-white rounded-lg shadow mt-2">
                {showAddVersion ? (
                  <AddVersionForm 
                    projectId={project.id} 
                    onAddComplete={(versionName) => {
                      setShowAddVersion(false);
                      if (versionName) {
                        updateProjectHistory('version_added', { name: versionName });
                        // Refresh project data
                        const refreshedProject = getProjectById(project.id);
                        if (refreshedProject) {
                          setProject(refreshedProject);
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="space-y-4">
                    <Button 
                      className="mb-4"
                      onClick={() => setShowAddVersion(true)}
                    >
                      <FileMusic className="mr-2 h-4 w-4" />
                      Adicionar Nova Versão
                    </Button>
                    
                    <PreviewVersionsList 
                      versions={project.versionsList || []} 
                      onDeleteVersion={deleteVersion}
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-4 p-4 bg-white rounded-lg shadow mt-2">
                <ClientFeedbackCard 
                  feedback={project.feedback || ''} 
                  status={project.status}
                  onSaveFeedback={saveFeedback}
                  onStatusUpdate={updateProjectStatus}
                />
              </TabsContent>
              
              <TabsContent value="history" className="p-4 bg-white rounded-lg shadow mt-2">
                <ProjectHistoryList history={project.history || []} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <ProjectClientInfo 
              clientName={project.clientName}
              clientEmail={project.clientEmail}
              packageType={project.packageType}
              createdAt={project.createdAt}
              expirationDate={project.expirationDate}
              lastActivityDate={project.lastActivityDate || project.createdAt}
            />
            
            <ProjectStatusCard 
              status={project.status} 
              onStatusUpdate={updateProjectStatus}
            />
            
            <ProjectActionCard 
              onAddVersion={() => setShowAddVersion(true)}
              onExtendDeadline={() => setShowExtendDialog(true)}
              previewUrl={project.previewUrl || ''}
              projectId={project.id}
            />
          </div>
        </div>
      </div>
      
      {/* Dialog para notificar o cliente */}
      <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificar Cliente</DialogTitle>
            <DialogDescription>
              Envie um e-mail para informar o cliente sobre a disponibilidade das prévias.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Cliente: {project.clientName}</p>
              <p className="text-sm font-medium">Email: {project.clientEmail}</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensagem
              </label>
              <Textarea
                id="message"
                placeholder="Escreva uma mensagem para o cliente..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifyDialog(false)}>Cancelar</Button>
            <Button onClick={sendNotification}>Enviar Notificação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para estender o prazo */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estender Prazo</DialogTitle>
            <DialogDescription>
              Estenda o prazo para avaliação das prévias por parte do cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="days" className="text-sm font-medium">
                Quantidade de dias
              </label>
              <Input
                id="days"
                type="number"
                min="1"
                max="30"
                value={extensionDays}
                onChange={(e) => setExtensionDays(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Data atual de expiração: {project.expirationDate}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendDialog(false)}>Cancelar</Button>
            <Button onClick={extendDeadline}>Estender Prazo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
