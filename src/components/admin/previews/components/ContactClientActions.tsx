
import React from 'react';
import { MessageSquare, Mail, Copy, Edit, Trash2 } from 'lucide-react';
import ProjectActionButton from './ProjectActionButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ContactClientActionsProps {
  clientPhone?: string;
  clientEmail?: string;
  projectId: string;
  onDeleteVersion?: (versionId: string) => void;
  canEdit?: boolean;
}

const ContactClientActions: React.FC<ContactClientActionsProps> = ({
  clientPhone,
  clientEmail,
  projectId,
  onDeleteVersion,
  canEdit = true
}) => {
  const { toast } = useToast();
  const [deleteVersionDialogOpen, setDeleteVersionDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);

  const handleWhatsApp = () => {
    if (!clientPhone) {
      toast({
        title: "Telefone não disponível",
        description: "Nenhum número de telefone registrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Format phone number (remove non-digits)
    const formattedPhone = clientPhone.replace(/\D/g, '');
    
    // Prepare message text
    const message = encodeURIComponent(
      `Olá! Sua prévia musical já está disponível para avaliação. Acesse: ${window.location.origin}/preview/${projectId}`
    );
    
    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };
  
  const handleEmail = () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Nenhum endereço de email registrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare email subject and body
    const subject = encodeURIComponent("Sua prévia musical está disponível");
    const body = encodeURIComponent(
      `Olá!\n\nSua prévia musical já está disponível para avaliação.\n\nAcesse: ${window.location.origin}/preview/${projectId}\n\nAguardamos seu feedback!\n\nAtenciosamente,\nEquipe harmonIA`
    );
    
    // Create mailto link with predefined "from" email
    const mailtoUrl = `mailto:${clientEmail}?subject=${subject}&body=${body}&from=contato@harmonia.media`;
    
    // Open in new tab/email client
    window.location.href = mailtoUrl;
  };
  
  const handleCopyLink = () => {
    const previewUrl = `${window.location.origin}/preview/${projectId}`;
    
    navigator.clipboard.writeText(previewUrl)
      .then(() => {
        toast({
          title: "Link copiado",
          description: "O link de prévia foi copiado para a área de transferência"
        });
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link. Por favor, tente novamente.",
          variant: "destructive"
        });
      });
  };
  
  const confirmDeleteVersion = (versionId: string) => {
    if (onDeleteVersion) {
      setVersionToDelete(versionId);
      setDeleteVersionDialogOpen(true);
    }
  };
  
  const handleDeleteConfirm = () => {
    if (versionToDelete && onDeleteVersion) {
      onDeleteVersion(versionToDelete);
      setDeleteVersionDialogOpen(false);
      setVersionToDelete(null);
    }
  };

  return (
    <div className="pt-2 border-t border-gray-100 mt-4">
      <h3 className="text-sm font-medium mb-2">Ações do Projeto</h3>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <ProjectActionButton
          icon={MessageSquare}
          onClick={handleWhatsApp}
          variant="outline"
        >
          WhatsApp
        </ProjectActionButton>
        
        <ProjectActionButton
          icon={Mail}
          onClick={handleEmail}
          variant="outline"
        >
          Email
        </ProjectActionButton>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <ProjectActionButton
          icon={Copy}
          onClick={handleCopyLink}
          variant="outline"
        >
          Copiar Link de Prévia
        </ProjectActionButton>
      </div>
      
      {canEdit && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <h3 className="text-sm font-medium mb-2">Gerenciamento</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
              asChild
            >
              <a href={`/admin-j28s7d1k/previews/${projectId}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Projeto
              </a>
            </Button>
          </div>
        </div>
      )}
      
      {/* Dialog for delete confirmation */}
      <Dialog open={deleteVersionDialogOpen} onOpenChange={setDeleteVersionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteVersionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactClientActions;
