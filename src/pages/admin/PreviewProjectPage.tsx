
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePreviewProjects, ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { notificationService } from '@/services/notificationService';
import PreviewVersionsList from '@/components/admin/previews/PreviewVersionsList';
import ProjectClientInfo from '@/components/admin/previews/ProjectClientInfo';
import ProjectStatusCard from '@/components/admin/previews/ProjectStatusCard';
import ProjectActionCard from '@/components/admin/previews/ProjectActionCard';
import ClientFeedbackCard from '@/components/admin/previews/ClientFeedbackCard';
import ProjectHistoryList from '@/components/admin/previews/ProjectHistoryList';
import AddVersionForm from '@/components/admin/previews/AddVersionForm';
import { ArrowLeft, FileMusic, MessageCircle, Clock, Calendar, Send, Copy } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [extensionDays, setExtensionDays] = useState('7');
  const { projects } = usePreviewProjects();

  // Função para copiar link para o cliente
  const copyPreviewLink = () => {
    const link = `${window.location.origin}/preview/${projectId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Link de prévia copiado para a área de transferência.",
    });
  };

  // Função para enviar notificação
  const sendNotification = () => {
    if (!notificationMessage.trim()) {
      toast({
        title: "Erro",
        description: "A mensagem de notificação não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    // Enviar notificação ao cliente
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

    // Atualizar o histórico do projeto
    updateProjectHistory('notification_sent', { message: notificationMessage });
  };

  // Função para estender o prazo
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

    // Calcular nova data de expiração
    const currentDate = new Date(project.expirationDate.split('/').reverse().join('-'));
    currentDate.setDate(currentDate.getDate() + days);
    const newExpirationDate = currentDate.toLocaleDateString('pt-BR');

    // Atualizar o projeto
    const updatedProject = {
      ...project,
      expirationDate: newExpirationDate
    };
    setProject(updatedProject);

    toast({
      title: "Prazo estendido",
      description: `O prazo de avaliação foi estendido em ${days} dias.`,
    });

    setShowExtendDialog(false);
    setExtensionDays('7');

    // Atualizar o histórico do projeto
    updateProjectHistory('deadline_extended', { days, newDate: newExpirationDate });
  };

  // Função para atualizar o histórico
  const updateProjectHistory = (actionType: string, data: any) => {
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
      default:
        actionDescription = 'Ação realizada';
    }

    const newHistoryItem = {
      action: actionDescription,
      timestamp,
      data
    };

    if (!project.history) {
      project.history = [];
    }

    setProject({
      ...project,
      history: [newHistoryItem, ...project.history]
    });
  };

  // Buscar detalhes do projeto pelo ID
  useEffect(() => {
    if (projectId) {
      // Em produção, buscar do banco de dados
      setTimeout(() => {
        // Localizar o projeto pela ID nos projetos mockados
        const foundProject = projects.find(p => p.id === projectId);
        
        if (foundProject) {
          // Adicionar dados adicionais para a página de detalhes
          const enhancedProject = {
            ...foundProject,
            feedback: 'Gostei muito da melodia, mas gostaria que o tempo fosse um pouco mais rápido. Também seria bom ter mais ênfase nos graves.',
            versions: [
              { id: 'v1', name: 'Versão Inicial', url: '#', dateAdded: '15/03/2025', recommended: true },
              { id: 'v2', name: 'Versão Revisada', url: '#', dateAdded: '22/03/2025' }
            ],
            history: [
              { action: 'Cliente enviou feedback', timestamp: '25/03/2025 14:30' },
              { action: 'Versão 2 adicionada', timestamp: '22/03/2025 10:15' },
              { action: 'Cliente visualizou o projeto', timestamp: '18/03/2025 09:45' },
              { action: 'Versão 1 adicionada', timestamp: '15/03/2025 16:20' },
              { action: 'Projeto criado', timestamp: '15/03/2025 11:00' }
            ]
          };
          setProject(enhancedProject);
        }
        setLoading(false);
      }, 500);
    }
  }, [projectId, projects]);

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

  // Verificar se o projeto está prestes a expirar (3 dias ou menos)
  const isNearExpiration = () => {
    const expirationParts = project.expirationDate.split('/');
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
      <div className="space-y-6">
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
          {/* Componente de informações do cliente */}
          <ProjectClientInfo client={{
            name: project.clientName,
            email: project.clientEmail,
            packageType: project.packageType
          }} />

          {/* Componente de status do projeto */}
          <ProjectStatusCard 
            status={project.status}
            createdAt={project.createdAt}
            expirationDate={project.expirationDate}
            isNearExpiration={isNearExpiration()}
          />

          {/* Componente de ações rápidas */}
          <ProjectActionCard 
            onAddVersion={() => setShowAddVersion(true)}
            onExtendDeadline={() => setShowExtendDialog(true)}
            previewUrl={`/preview/${projectId}`}
          />
        </div>

        <Tabs defaultValue="versions">
          <TabsList>
            <TabsTrigger value="versions">Versões</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="versions" className="mt-4">
            {/* Componente de listagem de versões */}
            <PreviewVersionsList versions={project.versions} />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-4">
            {/* Componente de feedback do cliente */}
            <ClientFeedbackCard feedback={project.feedback} status={project.status} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            {/* Componente de histórico do projeto */}
            <ProjectHistoryList history={project.history} />
          </TabsContent>
        </Tabs>

        {/* Dialog para adicionar nova versão */}
        <Dialog open={showAddVersion} onOpenChange={setShowAddVersion}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar nova versão</DialogTitle>
              <DialogDescription>
                Adicione uma nova versão musical ao projeto {project.id} do cliente {project.clientName}.
              </DialogDescription>
            </DialogHeader>
            
            {/* Formulário para adicionar versão */}
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

        {/* Dialog para estender prazo */}
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

        {/* Dialog para enviar notificação */}
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
      </div>
    </AdminLayout>
  );
};

export default PreviewProjectPage;
