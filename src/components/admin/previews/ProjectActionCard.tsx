
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CalendarPlus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddVersionDialog from './AddVersionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import ProjectActionButton from './components/ProjectActionButton';
import ContactClientActions from './components/ContactClientActions';
import DeadlineExtensionDialog from './components/DeadlineExtensionDialog';

interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone?: string;
  clientEmail?: string;
  projectStatus?: string;
  packageType?: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl,
  clientPhone = '',
  clientEmail = '',
  projectStatus = 'waiting',
  packageType = ''
}) => {
  const { toast } = useToast();
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [isFinalVersionDialogOpen, setIsFinalVersionDialogOpen] = useState(false);
  const [isDeadlineConfirmOpen, setIsDeadlineConfirmOpen] = useState(false);
  
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/preview/${projectId}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast({
          title: "Link copiado!",
          description: "O link de prévia foi copiado para a área de transferência."
        });
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
  };

  const handleAddFinalVersion = (version: VersionItem) => {
    // Adicione 'final: true' à versão
    const finalVersion = {
      ...version,
      final: true
    };
    
    onAddVersion(finalVersion);
    setIsFinalVersionDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProjectActionButton 
          icon={Copy}
          onClick={() => setIsVersionDialogOpen(true)}
          variant="default"
          className="w-full"
        >
          Adicionar Nova Versão
        </ProjectActionButton>
        
        {projectStatus === 'approved' && (
          <ProjectActionButton 
            icon={CheckCircle}
            onClick={() => setIsFinalVersionDialogOpen(true)}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Adicionar Versão Final
          </ProjectActionButton>
        )}
        
        <ProjectActionButton 
          icon={CalendarPlus}
          onClick={() => setIsDeadlineConfirmOpen(true)}
          variant="outline"
          className="w-full"
        >
          Estender Prazo (+7 dias)
        </ProjectActionButton>
        
        <ProjectActionButton 
          icon={Copy}
          onClick={handleCopyLink}
          variant="outline"
          className="w-full"
        >
          Copiar Link de Prévia
        </ProjectActionButton>
        
        <ContactClientActions
          projectId={projectId}
          clientPhone={clientPhone}
          clientEmail={clientEmail}
        />
      </CardContent>
      
      {/* Version Dialogs */}
      <AddVersionDialog 
        projectId={projectId}
        isOpen={isVersionDialogOpen}
        onClose={() => setIsVersionDialogOpen(false)}
        onSubmit={onAddVersion}
        onAddVersion={onAddVersion}
      />

      <AddVersionDialog 
        projectId={projectId}
        isOpen={isFinalVersionDialogOpen}
        onClose={() => setIsFinalVersionDialogOpen(false)}
        onSubmit={handleAddFinalVersion}
        onAddVersion={onAddVersion}
        isFinalVersion={true}
      />
      
      {/* Deadline Extension Dialog */}
      <DeadlineExtensionDialog
        isOpen={isDeadlineConfirmOpen}
        onClose={() => setIsDeadlineConfirmOpen(false)}
        onConfirm={onExtendDeadline}
      />
    </Card>
  );
};

export default ProjectActionCard;
