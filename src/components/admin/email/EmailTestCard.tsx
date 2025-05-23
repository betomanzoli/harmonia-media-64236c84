
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

interface EmailTestCardProps {
  emailService?: {
    sendEmail: (to: string, subject: string, content: string) => Promise<{ success: boolean; message: string }>;
  };
}

const EmailTestCard: React.FC<EmailTestCardProps> = ({ emailService }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Teste de Email - Harmonia');
  const [templateType, setTemplateType] = useState('welcome');
  const [isSending, setIsSending] = useState(false);

  const templates = {
    welcome: {
      subject: "Bem-vindo à Harmonia",
      content: "Olá! Seja bem-vindo aos nossos serviços de música personalizada."
    },
    preview: {
      subject: "Sua prévia musical está disponível",
      content: "Sua prévia musical foi finalizada e está disponível para avaliação."
    },
    delivery: {
      subject: "Sua música está pronta!",
      content: "Sua música personalizada está pronta para download. Aproveite sua criação!"
    }
  };

  const handleTemplateChange = (value: string) => {
    setTemplateType(value);
    setSubject(templates[value as keyof typeof templates].subject);
  };

  const handleSendTest = async () => {
    if (!recipient) {
      toast({
        title: "Erro",
        description: "Por favor, informe um email válido",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Check if emailService exists before trying to send an email
      if (!emailService?.sendEmail) {
        throw new Error("Email service not available");
      }

      const content = templates[templateType as keyof typeof templates].content;
      const result = await emailService.sendEmail(recipient, subject, content);

      if (result.success) {
        toast({
          title: "Email Enviado",
          description: "Email de teste enviado com sucesso!"
        });
      } else {
        toast({
          title: "Erro",
          description: result.message || "Falha ao enviar email de teste",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Email test error:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email de teste",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6 bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">Testar Envio de Email</h2>
      <p className="text-gray-600 mb-4">Envie um email de teste para verificar a configuração.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Destinatário</label>
          <Input 
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Template</label>
          <Select value={templateType} onValueChange={handleTemplateChange}>
            <SelectItem value="welcome">Boas-vindas</SelectItem>
            <SelectItem value="preview">Notificação de Prévia</SelectItem>
            <SelectItem value="delivery">Entrega Final</SelectItem>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Assunto</label>
          <Input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSendTest}
          disabled={isSending}
          className="w-full"
        >
          {isSending ? "Enviando..." : "Enviar Email de Teste"}
        </Button>
      </div>
    </Card>
  );
};

export default EmailTestCard;
