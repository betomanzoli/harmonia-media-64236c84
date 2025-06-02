// src/components/admin/projects/ProjectCard_v2.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Link as LinkIcon, Clock, User, Music, Trash2, Loader2 } from 'lucide-react'; // Added LinkIcon and Trash2
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/hooks/admin/useProjects'; // Import the full Project interface

interface ProjectCardProps {
  project: Project; // Use the full Project interface which includes preview_code and versions array
  onDelete: (projectId: string) => Promise<{ success: boolean; error?: string }>; // Add onDelete prop
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500 hover:bg-yellow-600' },
      feedback: { label: 'Feedback', color: 'bg-blue-500 hover:bg-blue-600' },
      approved: { label: 'Aprovado', color: 'bg-green-500 hover:bg-green-600' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500 hover:bg-gray-600' };
    return (
      <Badge className={`${config.color} text-white text-xs px-2 py-1`}>
        {config.label}
      </Badge>
    );
  };

  const handleViewProject = () => {
    navigate(`/admin/projects/${project.id}`);
  };

  const handleCopyPreviewLink = () => {
    if (project.preview_code) {
      // Construct the full URL based on your deployment
      const previewUrl = `${window.location.origin}/client-preview/${project.preview_code}`;
      navigator.clipboard.writeText(previewUrl)
        .then(() => {
          toast({ title: "Link Copiado!", description: "Link da prévia copiado para a área de transferência." });
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
          toast({ title: "Erro ao Copiar", description: "Não foi possível copiar o link.", variant: "destructive" });
        });
    } else {
      toast({ title: "Link Indisponível", description: "Este projeto ainda não possui um link de prévia.", variant: "destructive" });
    }
  };

  const handleDeleteProject = async () => {
    // Add confirmation dialog here in a real app
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.title}"? Esta ação não pode ser desfeita.`)) {
      setIsDeleting(true);
      const result = await onDelete(project.id);
      setIsDeleting(false);
      if (result.success) {
        toast({ title: "Projeto Excluído", description: `O projeto "${project.title}" foi excluído com sucesso.` });
        // The list should update automatically via the hook's listener
      } else {
        toast({ title: "Erro ao Excluir", description: result.error || "Não foi possível excluir o projeto.", variant: "destructive" });
      }
    }
  };

  const versionsCount = project.versions?.length || 0;
  const lastActivityDate = project.updated_at || project.created_at;
  const lastActivity = lastActivityDate ? new Date(lastActivityDate).toLocaleDateString('pt-BR') : 'N/A';

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col justify-between h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 truncate" title={project.title}>{project.title}</CardTitle>
            <p className="text-gray-600 text-sm flex items-center truncate" title={project.client_name}>
              <User className="w-4 h-4 mr-1 flex-shrink-0" />
              {project.client_name}
            </p>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-grow justify-between">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center" title={`${versionsCount} versões`}>
            <Music className="w-4 h-4 mr-1 flex-shrink-0" />
            {versionsCount} {versionsCount === 1 ? 'versão' : 'versões'}
          </div>
          <div className="flex items-center" title={`Última atividade: ${lastActivity}`}>
            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
            {lastActivity}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button
            onClick={handleViewProject}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </Button>
          {/* Botão Copiar Link Cliente */}
          <Button
            onClick={handleCopyPreviewLink}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!project.preview_code}
            title={project.preview_code ? "Copiar link da prévia do cliente" : "Link de prévia indisponível"}
          >
            <LinkIcon className="w-4 h-4 mr-1" />
            Link Cliente
          </Button>
           {/* Botão Deletar Projeto */}
           <Button
            onClick={handleDeleteProject}
            variant="destructive"
            size="sm"
            className="px-3" // Smaller padding for icon-only feel on small screens if needed
            disabled={isDeleting}
            title="Excluir projeto"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
