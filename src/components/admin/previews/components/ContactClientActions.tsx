
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogDescription 
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Phone, 
  Send,
  Mail,
  Loader2
} from 'lucide-react';
import webhookService from '@/services/webhookService';

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
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const openWhatsApp = () => {
    if (!clientPhone) {
      toast({
        title: "Telefone não disponível",
        description: "Não há um número de telefone cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Format phone number
    let phoneNumber = clientPhone.replace(/\D/g, '');
    
    // If it doesn't start with country code, add Brazil's code
    if (!phoneNumber.startsWith('55')) {
      phoneNumber = '55' + phoneNumber;
    }
    
    // Open WhatsApp web
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };
  
  const openEmailClient = () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Não há um email cadastrado para este cliente.",
        variant: "destructive"
      });
      return;
    }
    
    // Open email client
    window.open(`mailto:${clientEmail}?subject=Atualização sobre seu projeto musical`, '_blank');
  };
  
  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, escreva uma mensagem para enviar ao cliente.",
        variant: "destructive"
      });
      return;
    }
    
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "Não é possível enviar a mensagem pois não há um email cadastrado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send message via webhook
      const result = await webhookService.sendItemNotification('client_message', {
        projectId,
        clientName,
        clientEmail,
        message,
        timestamp: new Date().toISOString()
      });
      
      if (result) {
        toast({
          title: "Mensagem enviada",
          description: `Sua mensagem foi enviada para ${clientName}.`
        });
        
        setMessage('');
        setShowMessageDialog(false);
      } else {
        throw new Error("Não foi possível enviar a mensagem. Verifique as configurações de webhook.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Contato com o Cliente</h3>
        
        <div className="grid grid-cols-3 gap-2">
          {clientPhone && (
            <Button 
              onClick={openWhatsApp} 
              variant="outline" 
              className="w-full"
              title="Abrir WhatsApp"
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          
          {clientEmail && (
            <Button 
              onClick={openEmailClient} 
              variant="outline" 
              className="w-full"
              title="Abrir Cliente de Email"
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            onClick={() => setShowMessageDialog(true)} 
            variant="outline" 
            className="w-full"
            title="Enviar Mensagem pelo Sistema"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Mensagem para {clientName}</DialogTitle>
            <DialogDescription>
              Esta mensagem será enviada para o email do cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Sua mensagem</Label>
              <Textarea
                id="message"
                placeholder="Escreva sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={sendMessage} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactClientActions;
