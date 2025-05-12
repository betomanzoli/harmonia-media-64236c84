
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactClientActionsProps {
  clientPhone?: string;
  clientEmail?: string;
  projectId: string;
}

const ContactClientActions: React.FC<ContactClientActionsProps> = ({
  clientPhone,
  clientEmail,
  projectId
}) => {
  const { toast } = useToast();
  
  const handleWhatsAppClick = () => {
    if (!clientPhone) {
      toast({
        title: "Telefone não disponível",
        description: "Não há número de telefone cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Format phone number (remove non-numeric characters)
    const formattedPhone = clientPhone.replace(/\D/g, '');
    
    // Prepare message
    const message = `Olá! Entro em contato sobre sua prévia musical (ID: ${projectId}).`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };
  
  const handleEmailClick = () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Não há email cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare email subject and body
    const subject = `Prévia Musical - harmonIA (ID: ${projectId})`;
    const body = `Olá!\n\nEntro em contato sobre sua prévia musical (ID: ${projectId}).\n\nAtenciosamente,\nEquipe harmonIA`;
    
    // Create mailto URL
    const mailtoUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open in mail client
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium mb-2">Contatar Cliente</h4>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleWhatsAppClick}
          disabled={!clientPhone}
        >
          <Phone className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleEmailClick}
          disabled={!clientEmail}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
    </div>
  );
};

export default ContactClientActions;
