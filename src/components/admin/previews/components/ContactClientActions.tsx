
import React from 'react';
import { MessageSquare, Mail, Copy } from 'lucide-react';
import ProjectActionButton from './ProjectActionButton';
import { useToast } from '@/hooks/use-toast';

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
  projectId
}) => {
  const { toast } = useToast();

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

  return (
    <div className="pt-2 border-t border-gray-100 mt-4">
      <h3 className="text-sm font-medium mb-2">Comunicação com Cliente</h3>
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
    </div>
  );
};

export default ContactClientActions;
