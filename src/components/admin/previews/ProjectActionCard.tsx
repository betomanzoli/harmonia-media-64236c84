
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Send, PhoneCall, Calendar, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddVersionForm from './AddVersionForm';
import ContactClientActions from './components/ContactClientActions';
import DeadlineExtensionDialog from './components/DeadlineExtensionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { generatePreviewLink } from '@/utils/previewLinkUtils';

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
  clientPhone,
  clientEmail,
  projectStatus,
  packageType
}) => {
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [showContactActions, setShowContactActions] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const { toast } = useToast();

  // Generate encoded preview link on component mount
  const encodedPreviewLink = generatePreviewLink(projectId);
  const fullEncodedUrl = `${window.location.origin}/preview/${encodedPreviewLink}`;
  
  const handleCopyLink = () => {
    // Use the encoded link instead of direct link
    navigator.clipboard.writeText(fullEncodedUrl);
    toast({
      title: "Link copiado",
      description: "O link de prévia foi copiado para a área de transferência."
    });
  };

  const handleAddVersion = (version: VersionItem) => {
    onAddVersion(version);
    setShowAddVersion(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={handleCopyLink} className="w-full">
            <Clipboard className="h-4 w-4 mr-2" />
            Copiar link de prévia
          </Button>
          
          <Button onClick={() => setShowContactActions(true)} variant="outline" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Enviar link ao cliente
          </Button>
          
          <Button onClick={() => window.open(`tel:${clientPhone || ''}`)} variant="outline" className="w-full" disabled={!clientPhone}>
            <PhoneCall className="h-4 w-4 mr-2" />
            Ligar para cliente
          </Button>
          
          <Button onClick={() => setShowDeadlineDialog(true)} variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Estender prazo
          </Button>
          
          <Button onClick={() => setShowAddVersion(true)} variant="secondary" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar versão
          </Button>
        </div>

        <Dialog open={showAddVersion} onOpenChange={setShowAddVersion}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Versão</DialogTitle>
            </DialogHeader>
            <AddVersionForm onAddVersion={handleAddVersion} packageType={packageType} />
          </DialogContent>
        </Dialog>

        <ContactClientActions 
          isOpen={showContactActions} 
          onOpenChange={setShowContactActions}
          clientEmail={clientEmail || ''} 
          previewUrl={fullEncodedUrl} 
          projectStatus={projectStatus || 'waiting'} 
          projectId={projectId}
        />

        <DeadlineExtensionDialog
          isOpen={showDeadlineDialog}
          onOpenChange={setShowDeadlineDialog}
          onConfirm={onExtendDeadline}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
