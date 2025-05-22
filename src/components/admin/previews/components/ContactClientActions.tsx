
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import webhookService from '@/services/webhookService';

interface ContactClientActionsProps {
  clientPhone?: string;
  clientEmail?: string;
  clientName?: string;
  projectId: string;
}

const ContactClientActions: React.FC<ContactClientActionsProps> = ({
  clientPhone,
  clientEmail,
  clientName = "Cliente",
  projectId
}) => {
  const { toast } = useToast();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handlePhoneContact = () => {
    if (!clientPhone) {
      toast({
        title: "Telefone indisponível",
        description: "Não há número de telefone cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Garante que o telefone esteja no formato internacional
    // Remove todos os caracteres não numéricos
    const phone = clientPhone.replace(/\D/g, '');
    
    // Verificar se o número já começa com "+" para formato internacional
    const formattedPhone = phone.startsWith('+') ? phone : phone;
    
    // Abre o WhatsApp com o número formatado
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleSendEmail = async () => {
    if (!clientEmail) {
      toast({
        title: "Email indisponível",
        description: "Não há email cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    if (!emailContent.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Send data to webhook
      const webhookUrl = await webhookService.getWebhookUrl();
      if (webhookUrl) {
        await webhookService.sendItemNotification('client_message', {
          projectId,
          clientName,
          clientEmail,
          message: emailContent,
          timestamp: new Date().toISOString()
        });
      }
      
      toast({
        title: "Mensagem enviada",
        description: `A mensagem foi enviada para ${clientEmail}`
      });
      
      setShowEmailDialog(false);
      setEmailContent('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={handlePhoneContact}
          variant="outline" 
          className="w-full"
          disabled={!clientPhone}
        >
          <Phone className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button 
          onClick={() => setShowEmailDialog(true)}
          variant="outline" 
          className="w-full"
          disabled={!clientEmail}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
      </div>
      
      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Email para {clientName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <p className="text-sm text-gray-500">
              Digite a mensagem que deseja enviar para {clientEmail}
            </p>
            
            <Textarea
              placeholder="Escreva sua mensagem aqui..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEmailDialog(false)}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSending || !emailContent.trim()}
            >
              {isSending ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactClientActions;
