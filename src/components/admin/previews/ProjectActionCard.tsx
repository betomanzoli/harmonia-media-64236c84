
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, PlusCircle, Clock, Link, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddVersionDialog from './AddVersionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import ContactClientActions from './components/ContactClientActions';

interface ProjectActionCardProps {
  projectId: string;
  projectStatus: string;
  packageType?: string;
  onAddVersion: (version: VersionItem) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone?: string;
  clientEmail?: string;
  clientName: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl,
  projectStatus,
  packageType,
  clientPhone,
  clientEmail,
  clientName
}) => {
  const { toast } = useToast();
  const [showAddVersion, setShowAddVersion] = useState(false);
  
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/preview/${projectId}`;
    
    navigator.clipboard.writeText(fullUrl)
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
  
  // Primeiro letra maiúscula para pacote
  const capitalizedPackageType = packageType 
    ? packageType.charAt(0).toUpperCase() + packageType.slice(1) 
    : '';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => setShowAddVersion(true)}
            className="w-full"
            variant="default"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {projectStatus === 'approved' ? "Adicionar Versão Final" : "Adicionar Versão"}
          </Button>

          <Button 
            onClick={handleCopyLink} 
            variant="outline" 
            className="w-full"
          >
            <Link className="mr-2 h-4 w-4" />
            Copiar Link de Prévia
          </Button>
          
          <Button 
            onClick={onExtendDeadline} 
            variant="outline" 
            className="w-full"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Estender Prazo
          </Button>
        </div>
        
        {/* Contact client actions */}
        <ContactClientActions 
          clientName={clientName}
          clientPhone={clientPhone}
          clientEmail={clientEmail}
          projectId={projectId}
        />
        
        {/* Add version dialog */}
        <AddVersionDialog 
          isOpen={showAddVersion} 
          onOpenChange={setShowAddVersion}
          onAddVersion={(versionData) => {
            setShowAddVersion(false);
            onAddVersion({
              ...versionData,
              id: `v${Date.now()}`,
              dateAdded: new Date().toLocaleDateString('pt-BR'),
              final: projectStatus === 'approved'
            });
          }}
          projectId={projectId}
          isFinalVersion={projectStatus === 'approved'}
          packageType={capitalizedPackageType}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
