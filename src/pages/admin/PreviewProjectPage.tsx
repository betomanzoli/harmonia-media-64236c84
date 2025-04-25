
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
  const { projects, updateProject } = usePreviewProjects();

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
        let enhancedProject = { ...foundProject };
        
        // Certifique-se que versionsList existe
        if (!enhancedProject.versionsList) {
          enhancedProject.versionsList = [];
          
          // Se houver um número de versões mas não tiver a lista, crie versões de exemplo
          if (enhancedProject.versions && enhancedProject.versions > 0) {
            for (let i = 0; i < enhancedProject.versions; i++) {
              enhancedProject.versionsList.push({
                id: `v${i+1}`,
                name: `Versão ${i+1}`,
                description: `Descrição da versão ${i+1}`,
                dateAdded: enhancedProject.createdAt,
                recommended: i === 0
              });
            }
          }
        }
        
        // Inicializa o feedback se não existir
        if (!enhancedProject.feedback) {
          enhancedProject.feedback = '';
        }
        
        // Inicializa o histórico se não existir
        if (!enhancedProject.history) {
          enhancedProject.history = [
            { action: 'Projeto criado', timestamp: enhancedProject.createdAt }
          ];
        }
        
        setProject(enhancedProject);
        console.log("Project found:", enhancedProject);
      } else {
        console.error(`Project with ID ${projectId} not found`);
        toast({
          title: "Erro",
          description: "Projeto não encontrado",
          variant: "destructive"
        });
      }
      
      setLoading(false);
    }
  }, [projectId, projects, toast]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando detalhes do projeto...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
          <p className="text-gray-500 mb-4">O projeto solicitado não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/admin-j28s7d1k/previews">Voltar para lista de projetos</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const isNearExpiration = () => {
    if (!project.expirationDate) return false;
    
    const expirationParts = project.expirationDate.split('/');
    if (expirationParts.length !== 3) return false;
    
    const expirationDate = new Date(
      parseInt(expirationParts[2]), 
      parseInt(expirationParts[1]) - 1, 
      parseInt(expirationParts[0])
    );
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" asChild className="mb-2">
              <Link to="/admin-j28s7d1k/previews">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para lista de projetos
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-harmonia-green">Projeto {project.id}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowHelpDialog(true)}
              className="border-harmonia-green text-harmonia-green"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Ajuda
            </Button>
            <Button variant="outline" onClick={copyPreviewLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar link
            </Button>
            <Button variant="outline" onClick={() => setShowAddVersion(true)}>
              <FileMusic className="mr-2 h-4 w-4" />
              Adicionar versão
            </Button>
            <Button onClick={() => setShowNotifyDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Enviar notificação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ProjectClientInfo client={{
            name: project.clientName || "Cliente",
            email: project.clientEmail || "cliente@exemplo.com",
            packageType: project.packageType || "Padrão"
          }} />

          <ProjectStatusCard 
            status={project.status || "waiting"}
            createdAt={project.createdAt || new Date().toLocaleDateString('pt-BR')}
            expirationDate={project.expirationDate || new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('pt-BR')}
            isNearExpiration={isNearExpiration()}
          />

          <ProjectActionCard 
            onAddVersion={() => setShowAddVersion(true)}
            onExtendDeadline={() => setShowExtendDialog(true)}
            previewUrl={`/preview/${projectId}`}
            projectId={projectId || ''}
          />
        </div>
        
        {/* Status control buttons */}
        <div className="bg-card p-4 border rounded-md shadow-sm">
          <h3 className="text-sm font-medium mb-3">Controle de status do projeto</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={project.status === 'waiting' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => updateProjectStatus('waiting')}
            >
              <Clock className="mr-1 h-3 w-3" />
              Aguardando avaliação
            </Button>
            <Button 
              variant={project.status === 'feedback' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => updateProjectStatus('feedback')}
              className={project.status === 'feedback' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              <MessageCircle className="mr-1 h-3 w-3" />
              Feedback recebido
            </Button>
            <Button 
              variant={project.status === 'approved' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => updateProjectStatus('approved')}
              className={project.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <FileMusic className="mr-1 h-3 w-3" />
              Aprovado
            </Button>
          </div>
        </div>

        <Tabs defaultValue="versions">
          <TabsList>
            <TabsTrigger value="versions">Versões</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="versions" className="mt-4">
            <PreviewVersionsList 
              versions={project.versionsList || []} 
              onDeleteVersion={deleteVersion}
            />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-4">
            <ClientFeedbackCard 
              feedback={project.feedback || ""} 
              status={project.status || "waiting"} 
              onSaveFeedback={saveFeedback}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <ProjectHistoryList history={project.history || []} />
          </TabsContent>
        </Tabs>

        <Dialog open={showAddVersion} onOpenChange={setShowAddVersion}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Adicionar nova versão</DialogTitle>
              <DialogDescription>
                Adicione uma nova versão musical ao projeto {project.id} do cliente {project.clientName}.
              </DialogDescription>
            </DialogHeader>
            
            <AddVersionForm 
              projectId={projectId || ''} 
              onAddComplete={(versionName) => {
                setShowAddVersion(false);
                updateProjectHistory('version_added', { name: versionName });
                toast({
                  title: "Versão adicionada",
                  description: `A versão "${versionName}" foi adicionada com sucesso.`
                });
              }} 
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Estender prazo de avaliação</DialogTitle>
              <DialogDescription>
                O prazo atual termina em {project.expirationDate}. Defina por quantos dias deseja estender.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="extension-days" className="text-sm font-medium">
                  Dias adicionais
                </label>
                <Select value={extensionDays} onValueChange={setExtensionDays}>
                  <SelectTrigger id="extension-days">
                    <SelectValue placeholder="Selecione o número de dias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="5">5 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="10">10 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExtendDialog(false)}>Cancelar</Button>
              <Button onClick={extendDeadline}>Estender prazo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showNotifyDialog} onOpenChange={setShowNotifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar notificação ao cliente</DialogTitle>
              <DialogDescription>
                Envie uma notificação para o cliente sobre atualizações no projeto.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="notification-message" className="text-sm font-medium">
                  Mensagem de notificação
                </label>
                <Textarea
                  id="notification-message"
                  placeholder="Digite a mensagem para o cliente..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotifyDialog(false)}>Cancelar</Button>
              <Button onClick={sendNotification}>Enviar notificação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Como usar o sistema de notificações</DialogTitle>
            </DialogHeader>
            <NotificationGuide />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
