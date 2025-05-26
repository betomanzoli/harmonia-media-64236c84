import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Copy, Clock, Mail, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePreviewProjects, VersionItem } from '@/hooks/admin/usePreviewProjects';
import AddVersionDialog from './AddVersionDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ProjectHeader from './ProjectHeader';
import PreviewVersionsList from './PreviewVersionsList';
import ProjectClientInfo from './ProjectClientInfo';
import { emailService } from '@/lib/supabase';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProject, loadProjects } = usePreviewProjects();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  const [isAddVersionOpen, setIsAddVersionOpen] = useState(false);
  const [isExtendDeadlineOpen, setIsExtendDeadlineOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  
  // Add loading flag ref to prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);
  // Add loaded flag to prevent unnecessary reloads
  const hasLoadedRef = useRef(false);
  
  // Debug the issue
  console.log("Current projectId:", projectId);
  
  // Memoize the loadProjectData function to prevent recreating it on each render
  const loadProjectData = useCallback(async (forceReload = false) => {
    // Skip if already loading
    if (isLoadingRef.current) {
      console.log("Loading already in progress, skipping");
      return;
    }
    
    // Skip if already loaded and not forced to reload
    if (hasLoadedRef.current && !forceReload && project) {
      console.log("Project already loaded, skipping");
      return;
    }
    
    if (!projectId) {
      console.log("No project ID provided, returning early");
      setIsLoading(false);
      setLoadFailed(true);
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      console.log("ProjectDetails Component - Loading project:", projectId);
      
      // Try direct project lookup first without reloading all projects
      const existingProject = getProjectById(projectId);
      
      if (existingProject) {
        console.log("Project found in cache:", existingProject);
        setProject(existingProject);
        setLoadFailed(false);
        hasLoadedRef.current = true;
      } else {
        console.log("Project not found in cache, loading projects...");
        // Only load projects if direct lookup fails
        const projects = await loadProjects();
        console.log("Projects loaded:", projects ? projects.length : 0);
        
        // Get all available project IDs for debugging
        const availableIds = projects?.map(p => p.id) || [];
        console.log("Available project IDs:", availableIds.join(', '));
        
        // Try project lookup again after loading
        const projectData = getProjectById(projectId);
        
        if (projectData) {
          console.log("Project found after loading:", projectData);
          setProject(projectData);
          setLoadFailed(false);
          hasLoadedRef.current = true;
        } else {
          console.error(`Project with ID ${projectId} not found`);
          setLoadFailed(true);
          toast({
            title: "Projeto não encontrado",
            description: `Não foi possível encontrar o projeto com ID: ${projectId}`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error loading project:", error);
      setLoadFailed(true);
      toast({
        title: "Erro ao carregar projeto",
        description: "Ocorreu um erro ao carregar os dados do projeto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [projectId, getProjectById, loadProjects, toast, project]);
  
  // Load project data only once on component mount
  useEffect(() => {
    // Reset state when projectId changes
    hasLoadedRef.current = false;
    
    loadProjectData();
    
    // Cleanup function
    return () => {
      // Clear loading flag on unmount
      isLoadingRef.current = false;
    };
  }, [projectId, loadProjectData]);
  
  // Handle project not found scenario with retry option
  const handleRetry = () => {
    if (!projectId) return;
    
    // Force reload data
    hasLoadedRef.current = false;
    loadProjectData(true);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin-j28s7d1k/previews')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <h2 className="text-xl font-semibold mt-4">Carregando projeto...</h2>
          <p className="text-sm text-gray-500 mt-2">ID do Projeto: {projectId}</p>
        </div>
      </div>
    );
  }
  
  // Show error state with retry button and improved diagnostic info
  if (!project || loadFailed) {
    return (
      <div className="p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin-j28s7d1k/previews')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">Projeto não encontrado</h2>
          <p className="mb-6 text-gray-500">
            Não foi possível carregar os dados do projeto. Verifique se o projeto existe ou tente novamente.
          </p>
          <div className="space-y-4">
            <Button onClick={handleRetry}>
              Tentar novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin-j28s7d1k/previews')}
              className="ml-2"
            >
              Voltar para prévias
            </Button>
          </div>
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-medium mb-2">Informações de diagnóstico:</h3>
            <p>ID do Projeto solicitado: {projectId}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const isApproved = project.status === 'approved';
  
  const handleAddVersion = (newVersion: VersionItem) => {
    if (!projectId) return;
    
    const currentVersions = project.versionsList || [];
    
    // Se a nova versão for marcada como final, adiciona um indicador
    const isFinalVersion = newVersion.final === true;
    const versionTitle = isFinalVersion ? `FINAL - ${newVersion.name}` : newVersion.name;
    
    const versionToAdd = {
      ...newVersion,
      name: versionTitle
    };
    
    // If the new version is marked as recommended, remove recommended from others
    let updatedVersions = currentVersions;
    if (newVersion.recommended) {
      updatedVersions = currentVersions.map(v => ({
        ...v,
        recommended: false
      }));
    }
    
    // Add the new version
    updatedVersions = [...updatedVersions, versionToAdd];
    
    // Update history
    const historyAction = isFinalVersion 
      ? `Versão final adicionada: ${versionTitle}` 
      : `Nova versão adicionada: ${versionTitle}`;
      
    const historyEntry = {
      action: historyAction,
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: newVersion.description || 'Sem descrição'
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: isFinalVersion ? "Versão final adicionada" : "Versão adicionada",
      description: `${versionTitle} foi adicionada ao projeto com sucesso.`
    });
    
    setIsAddVersionOpen(false);
  };
  
  const handleExtendDeadline = () => {
    if (!projectId) return;
    
    // Calculate new expiration date (current + 7 days)
    const currentDate = project.expirationDate 
      ? new Date(project.expirationDate.split('/').reverse().join('-')) 
      : new Date();
      
    currentDate.setDate(currentDate.getDate() + 7);
    const newExpirationDate = currentDate.toLocaleDateString('pt-BR');
    
    // Add history entry
    const historyEntry = {
      action: "Prazo estendido",
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: `Prazo estendido por +7 dias. Nova data de expiração: ${newExpirationDate}`
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      expirationDate: newExpirationDate,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      expirationDate: newExpirationDate,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: "Prazo estendido",
      description: `O prazo foi estendido por +7 dias. Nova data: ${newExpirationDate}`
    });
    
    setIsExtendDeadlineOpen(false);
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!projectId) return;
    
    const currentVersions = project.versionsList || [];
    const versionToDelete = currentVersions.find(v => v.id === versionId);
    
    if (!versionToDelete) return;
    
    const updatedVersions = currentVersions.filter(v => v.id !== versionId);
    
    // Add history entry
    const historyEntry = {
      action: `Versão removida: ${versionToDelete.name}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      data: {
        message: `A versão "${versionToDelete.name}" foi removida do projeto.`
      }
    };
    
    const history = [...(project.history || []), historyEntry];
    
    // Update project
    updateProject(projectId, {
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    // Update local state
    setProject({
      ...project,
      versionsList: updatedVersions,
      versions: updatedVersions.length,
      history,
      lastActivityDate: new Date().toLocaleDateString('pt-BR')
    });
    
    toast({
      title: "Versão removida",
      description: `${versionToDelete.name} foi removida com sucesso.`
    });
  };
  
  const handleCopyLink = () => {
    const previewUrl = `${window.location.origin}/preview/${projectId}`;
    
    navigator.clipboard.writeText(previewUrl)
      .then(() => {
        toast({
          title: "Link copiado",
          description: "O link de prévia foi copiado para a área de transferência."
        });
      })
      .catch(err => {
        console.error('Falha ao copiar link:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link. Por favor, tente novamente.",
          variant: "destructive"
        });
      });
  };
  
  const handleSendEmail = async () => {
    if (!project.clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Não há email cadastrado para este cliente."
      });
      return;
    }
    
    if (!emailContent.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem antes de enviar."
      });
      return;
    }
    
    // Enviar notificação por email
    try {
      const previewUrl = `${window.location.origin}/preview/${projectId}`;
      const result = await emailService.sendPreviewNotification(
        project.clientEmail,
        project.clientName || 'Cliente',
        previewUrl
      );
      
      if (result.success) {
        toast({
          title: "Email enviado",
          description: `Email de notificação enviado para ${project.clientEmail}`
        });
      } else {
        throw new Error('Falha ao enviar email');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsEmailOpen(false);
    setEmailContent('');
  };
  
  const handleWhatsAppContact = () => {
    if (!project.clientPhone) {
      toast({
        title: "Telefone não disponível",
        description: "Não há número de telefone cadastrado para este cliente."
      });
      return;
    }
    
    // Format phone number (remove non-numeric characters)
    const formattedPhone = project.clientPhone.replace(/\D/g, '');
    
    // Open WhatsApp with the client's phone number
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin-j28s7d1k/previews')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      {/* Project content when loaded successfully */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ProjectHeader 
            projectTitle={project.title || project.packageType || 'Projeto musical'} 
            clientName={project.clientName}
            packageType={project.packageType}
          />
          
          <PreviewVersionsList 
            versions={project.versionsList || []}
            projectId={projectId || ''}
            onDeleteVersion={handleDeleteVersion}
          />
          
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Histórico do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {project.history && project.history.length > 0 ? (
                <ul className="divide-y">
                  {project.history.map((entry: any, index: number) => (
                    <li key={index} className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between mb-1">
                        <span className="font-medium">{entry.action}</span>
                        <span className="text-gray-500 text-sm">{entry.timestamp}</span>
                      </div>
                      {entry.data?.message && (
                        <p className="text-gray-600 text-sm">{entry.data.message}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum registro de atividade ainda.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <ProjectClientInfo 
            clientName={project.clientName}
            clientEmail={project.clientEmail || ''}
            packageType={project.packageType || 'Padrão'}
            createdAt={project.createdAt || new Date().toLocaleDateString('pt-BR')}
            expirationDate={project.expirationDate || 'Não definida'}
            lastActivityDate={project.lastActivityDate || new Date().toLocaleDateString('pt-BR')}
          />
          
          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <CardTitle>Ações do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setIsAddVersionOpen(true)} 
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isApproved ? "Adicionar Versão Final" : "Adicionar Versão"}
              </Button>
              
              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                className="w-full text-gray-300 border-gray-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar Link de Prévia
              </Button>
              
              <Button 
                onClick={() => setIsExtendDeadlineOpen(true)} 
                variant="outline" 
                className="w-full text-gray-300 border-gray-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                Estender Prazo
              </Button>
              
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-medium mb-3">Contatar Cliente</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleWhatsAppContact} 
                    variant="outline" 
                    className="text-gray-300 border-gray-700"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={() => setIsEmailOpen(true)} 
                    variant="outline" 
                    className="text-gray-300 border-gray-700"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Version Dialog */}
      <AddVersionDialog 
        isOpen={isAddVersionOpen}
        onOpenChange={setIsAddVersionOpen}
        projectId={projectId || ''}
        onAddVersion={handleAddVersion}
        isFinalVersion={isApproved}
        packageType={project?.packageType}
      />
      
      {/* Extend Deadline Dialog */}
      <Dialog open={isExtendDeadlineOpen} onOpenChange={setIsExtendDeadlineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estender Prazo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estender o prazo da prévia por mais 7 dias?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtendDeadlineOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExtendDeadline}>
              Confirmar Extensão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Email Dialog */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Email para {project.clientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <p className="text-sm text-gray-500">
              Digite a mensagem que deseja enviar para {project.clientEmail}
            </p>
            <Textarea
              placeholder="Escreva sua mensagem aqui..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmail}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
