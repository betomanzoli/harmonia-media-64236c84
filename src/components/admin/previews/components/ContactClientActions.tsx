
import React from 'react';
import { MessageSquare, Mail } from 'lucide-react';
import ProjectActionButton from './ProjectActionButton';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactClientActionsProps {
  clientPhone?: string;
  clientEmail?: string;
  projectId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactClientActions: React.FC<ContactClientActionsProps> = ({
  clientPhone,
  clientEmail,
  projectId,
  isOpen,
  onOpenChange
}) => {
  const { toast } = useToast();
  const defaultPhone = "(11) 92058-5072"; // Updated WhatsApp number

  const handleWhatsApp = () => {
    // Use client phone if available, otherwise use default
    const phoneToUse = clientPhone || defaultPhone;
    
    // Format phone number (remove non-digits)
    const formattedPhone = phoneToUse.replace(/\D/g, '');
    
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
    
    // Create mailto link
    const mailtoUrl = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
    
    // Open in new tab/email client
    window.location.href = mailtoUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contatar Cliente</DialogTitle>
        </DialogHeader>
        <div className="pt-2 mt-4">
          <h3 className="text-sm font-medium mb-2">Contatar Cliente</h3>
          <div className="grid grid-cols-2 gap-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactClientActions;
