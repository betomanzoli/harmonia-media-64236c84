
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, PlusCircle, User, Mail, Phone, Package, Calendar, Info, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddVersionDialog from './AddVersionDialog';
import BandcampVersionCard from './BandcampVersionCard';
import ProjectHistory from './ProjectHistory';
import { Project, ProjectVersion } from '@/hooks/admin/useProjects';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddVersionOpen, setIsAddVersionOpen] = useState(false);

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('Projeto não encontrado.');

      const { data: versionsData, error: versionsError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (versionsError) throw versionsError;

      setProject({
        ...projectData,
        versions: []
      } as Project);
      setVersions((versionsData || []) as ProjectVersion[]);

    } catch (err: any) {
      console.error('Error fetching project details:', err);
      setError(err.message || 'Erro ao carregar detalhes do projeto.');
      toast({
        title: "Erro",
        description: err.message || 'Não foi possível carregar os detalhes do projeto.',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleVersionAdded = () => {
    fetchProjectDetails();
  };

  const handleVersionDeleted = () => {
    fetchProjectDetails();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    return (
      <Badge className={`${config.color} text-white text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="p-6">Carregando detalhes do projeto...</div>;
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/projects')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Projetos
        </Button>
        <p className="text-red-600">{error || 'Não foi possível carregar o projeto.'}</p>
      </div>
    );
  }

  const clientInfo = [
    { icon: User, label: 'Cliente', value: project.client_name },
    { icon: Mail, label: 'Email', value: project.client_email },
    { icon: Phone, label: 'Telefone', value: project.client_phone },
  ].filter(info => info.value);

  const projectInfo = [
    { icon: Package, label: 'Pacote', value: project.package_type },
    { icon: Calendar, label: 'Criado em', value: new Date(project.created_at).toLocaleDateString('pt-BR') },
    { icon: Calendar, label: 'Expira em', value: project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : 'N/A' },
    { icon: Info, label: 'Preview Code', value: project.preview_code ? project.preview_code : 'Nenhum' },
  ].filter(info => info.value);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate('/admin/projects')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Projetos
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            {project.title}
            <Button variant="ghost" size="icon" className="ml-2 h-7 w-7">
              <Edit className="h-4 w-4" />
            </Button>
          </h1>
          <p className="text-muted-foreground">Detalhes e versões do projeto</p>
        </div>
        {getStatusBadge(project.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {clientInfo.map((info, index) => (
              <div key={index} className="flex items-center text-sm">
                <info.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium mr-1">{info.label}:</span>
                <span className="text-muted-foreground truncate">{info.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {projectInfo.map((info, index) => (
              <div key={index} className="flex items-center text-sm">
                <info.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium mr-1">{info.label}:</span>
                <span className="text-muted-foreground truncate">{info.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {(project.status === 'feedback' || project.status === 'approved') && project.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              {project.status === 'approved' ? <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> : <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />}
              {project.status === 'approved' ? 'Feedback Final / Aprovação' : 'Feedback Recebido'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.feedback}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Versões do Projeto</CardTitle>
            <CardDescription>Gerencie as versões enviadas para o cliente.</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAddVersionOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Versão
          </Button>
        </CardHeader>
        <CardContent>
          {versions.length > 0 ? (
            <div className="space-y-4">
              {versions.map((version) => (
                <BandcampVersionCard
                  key={version.id}
                  version={version}
                  projectId={project.id}
                  onDeleteVersion={handleVersionDeleted}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma versão adicionada ainda.</p>
          )}
        </CardContent>
      </Card>

      <ProjectHistory projectId={project.id} />

      <AddVersionDialog
        isOpen={isAddVersionOpen}
        setIsOpen={setIsAddVersionOpen}
        projectId={project.id}
        onVersionAdded={handleVersionAdded}
        packageType={project.package_type}
      />
    </div>
  );
};

export default ProjectDetailsPage;
