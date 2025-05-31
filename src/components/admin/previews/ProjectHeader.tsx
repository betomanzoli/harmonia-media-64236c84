
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectHeaderProps {
  project: {
    id: string;
    title: string;
    client_name: string;
    status: string;
    preview_code?: string;
    created_at: string;
  };
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Feedback</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCopyClientLink = () => {
    if (project.preview_code) {
      const clientLink = `${window.location.origin}/client-preview/${project.preview_code}`;
      navigator.clipboard.writeText(clientLink).then(() => {
        toast({
          title: "Link copiado!",
          description: "O link do cliente foi copiado para a área de transferência."
        });
      }).catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
    }
  };

  const handleOpenClientLink = () => {
    if (project.preview_code) {
      const clientLink = `${window.location.origin}/client-preview/${project.preview_code}`;
      window.open(clientLink, '_blank');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
            <span className="font-medium">Cliente: {project.client_name}</span>
            <span>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            {getStatusBadge(project.status)}
          </div>
        </div>
        
        {project.preview_code && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopyClientLink}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Link Cliente
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenClientLink}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir Preview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
