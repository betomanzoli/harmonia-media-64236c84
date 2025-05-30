import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, User, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { useProjects, Project } from '@/hooks/admin/useProjects'; // ✅ HOOK REAL
import { useVersions, Version } from '@/hooks/admin/useVersions'; // ✅ HOOK REAL
import { supabase } from '@/integrations/supabase/client'; // ✅ SUPABASE REAL
import VersionCard from '@/components/admin/previews/VersionCard'; // ✅ COMPONENTE REAL
import AddVersionDialog from '@/components/admin/previews/AddVersionDialog'; // ✅ COMPONENTE REAL

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [showAddVersionDialog, setShowAddVersionDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✅ USAR HOOKS REAIS:
  const { versions, loading: versionsLoading, addVersion, deleteVersion } = useVersions(projectId);

  // ✅ CARREGAR DADOS REAIS DO SUPABASE:
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔍 Loading project:', projectId);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('❌ Error loading project:', error);
          toast({
            title: "Erro ao carregar projeto",
            description: "Não foi possível carregar os dados do projeto.",
            variant: "destructive"
          });
          return;
        }

        if (!data) {
          console.log('⚠️ Project not found');
          return;
        }

        console.log('✅ Project loaded:', data);
        setProject(data);
        
      } catch (error) {
        console.error('💥 Error loading project:', error);
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar o projeto.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  const handleAddVersion = async (versionData: Omit<Version, 'id' | 'created_at' | 'updated_at'>) => {
    if (!project) return;

    console.log('🆕 Adding version to project:', versionData);
    
    const newVersion = await addVersion(versionData);
    
    if (newVersion) {
      toast({
        title: "Versão adicionada",
        description: `${versionData.name} foi adicionada ao projeto.`
      });
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!project) return;

    const versionToDelete = versions.find(v => v.id === versionId);
    if (!versionToDelete) return;

    const success = await deleteVersion(versionId);
    
    if (success) {
      toast({
        title: "Versão removida",
        description: `${versionToDelete.name} foi removida do projeto.`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const copyClientPreviewLink = () => {
    if (!project?.preview_code) {
      toast({
        title: "Erro",
        description: "Preview code não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const previewUrl = `${window.location.origin}/client-preview/${project.preview_code}`; // ✅ USAR PREVIEW_CODE REAL
    navigator.clipboard.writeText(previewUrl).then(() => {
      toast({
        title: "Link copiado!",
        description: "Link da prévia para o cliente foi copiado."
      });
    });
  };

  if (isLoading) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
              <p>Carregando projeto...</p>
            </div>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  if (!project) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <Button onClick={() => navigate('/admin/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Projetos
            </Button>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/projects')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1> {/* ✅ DADOS REAIS */}
              <p className="text-gray-600">Gerenciamento do projeto</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(project.status)}
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span>{project.client_name}</span> {/* ✅ DADOS REAIS */}
              </div>
              {project.client_email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.client_email}</span> {/* ✅ DADOS REAIS */}
                </div>
              )}
              {project.client_phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{project.client_phone}</span> {/* ✅ DADOS REAIS */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span> {/* ✅ DADOS REAIS */}
              </div>
              {project.package_type && (
                <div>
                  <span className="font-medium">Pacote:</span> {project.package_type} {/* ✅ DADOS REAIS */}
                </div>
              )}
              {project.expires_at && (
                <div>
                  <span className="font-medium">Expira em:</span> {new Date(project.expires_at).toLocaleDateString('pt-BR')} {/* ✅ DADOS REAIS */}
                </div>
              )}
              <div>
                <span className="font-medium">Versões:</span> {versions.length} {/* ✅ DADOS REAIS */}
              </div>
              <div>
                <span className="font-medium">Preview Code:</span> {project.preview_code} {/* ✅ DADOS REAIS */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowAddVersionDialog(true)}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Versão
              </Button>
              
              <Button
                variant="outline"
                onClick={copyClientPreviewLink}
                disabled={!project.preview_code}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copiar Link Cliente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Versions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Versões do Projeto</h2>
            <span className="text-gray-500">{versions.length} versões</span> {/* ✅ DADOS REAIS */}
          </div>
          
          {versionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
              <p>Carregando versões...</p>
            </div>
          ) : versions.length > 0 ? (
            <div className="space-y-4">
              {versions.map((version) => (
                <VersionCard
                  key={version.id}
                  version={version}
                  projectId={project.id}
                  onDeleteVersion={handleDeleteVersion}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">Nenhuma versão criada ainda.</p>
                <Button 
                  onClick={() => setShowAddVersionDialog(true)}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Versão
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Version Dialog */}
        <AddVersionDialog
          isOpen={showAddVersionDialog}
          onOpenChange={setShowAddVersionDialog}
          projectId={project.id}
          onAddVersion={handleAddVersion}
          packageType={project.package_type}
        />
      </div>
    </NewAdminLayout>
  );
};

export default ProjectDetailsPage;
