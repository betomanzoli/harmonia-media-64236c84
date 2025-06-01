import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, User, Music, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/admin/useProjects'; // Import the hook

// Interface atualizada para corresponder aos dados do hook useProjects
interface ProjectCardProps {
  project: {
    id: string;
    client_name: string; // Corrigido de clientName
    title: string;
    status: 'waiting' | 'feedback' | 'approved';
    versions: Array<any>; // Apenas para contar, não precisa do tipo completo aqui
    created_at: string;
    updated_at?: string; // Adicionado para lastActivity
  };
  // onDeleteProject: (projectId: string) => void; // Remover se o hook já faz o reload
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteProject, isLoading: isDeleting } = useProjects(); // Usa a função do hook

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'Aguardando', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-500' };
    return (
      <Badge className={`${config.color} text-white text-xs px-2 py-0.5`}>
        {config.label}
      </Badge>
    );
  };

  const handleViewProject = () => {
    navigate(`/admin/projects/${project.id}`);
  };

  const handleDeleteProject = async () => {
    const result = await deleteProject(project.id);
    if (result.success) {
      toast({
        title: "Projeto removido",
        description: `"${project.title}" foi removido com sucesso.`,
      });
      // Não precisa chamar onDeleteProject se o useProjects já atualiza a lista via listener
    } else {
      toast({
        title: "Erro ao remover projeto",
        description: result.error || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  // Determina a data da última atividade (atualização ou criação)
  const lastActivityDate = project.updated_at || project.created_at;
  const formattedLastActivity = lastActivityDate
    ? new Date(lastActivityDate).toLocaleDateString('pt-BR')
    : 'N/A';

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-2">
            <CardTitle className="text-lg mb-1 line-clamp-2">{project.title}</CardTitle>
            <p className="text-gray-600 text-sm flex items-center truncate">
              <User className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{project.client_name}</span>
            </p>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-1" />
            {project.versions?.length ?? 0} versões
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formattedLastActivity}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            onClick={handleViewProject}
            className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Detalhes
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 px-2"
                title="Remover Projeto"
                disabled={isDeleting} // Desabilita enquanto deleta
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover Projeto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover o projeto "{project.title}"?
                  Todas as suas versões e histórico associado também serão removidos.
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Removendo...' : 'Confirmar Remoção'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;

