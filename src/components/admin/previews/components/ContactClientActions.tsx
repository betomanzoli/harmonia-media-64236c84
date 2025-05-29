
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare } from 'lucide-react';

interface ContactClientActionsProps {
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  projectId: string;
}

const ContactClientActions: React.FC<ContactClientActionsProps> = ({
  clientName,
  clientPhone,
  clientEmail,
  projectId
}) => {
  const handlePhoneContact = () => {
    if (clientPhone) {
      window.open(`tel:${clientPhone}`, '_blank');
    }
  };

  const handleEmailContact = () => {
    if (clientEmail) {
      window.open(`mailto:${clientEmail}?subject=Projeto ${projectId}`, '_blank');
    }
  };

  const handleWhatsAppContact = () => {
    if (clientPhone) {
      const message = encodeURIComponent(`Olá ${clientName}, sobre o projeto ${projectId}...`);
      window.open(`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Contato com Cliente</h4>
      <div className="grid grid-cols-1 gap-2">
        {clientPhone && (
          <Button
            onClick={handlePhoneContact}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <Phone className="mr-2 h-3 w-3" />
            Ligar
          </Button>
        )}
        
        {clientEmail && (
          <Button
            onClick={handleEmailContact}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <Mail className="mr-2 h-3 w-3" />
            Email
          </Button>
        )}
        
        {clientPhone && (
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <MessageSquare className="mr-2 h-3 w-3" />
            WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContactClientActions;
