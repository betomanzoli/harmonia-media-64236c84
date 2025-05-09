
import React, { useState } from 'react';
import { Copy, Check, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import emailService from '@/services/emailService';

interface SharePreviewDialogProps {
  projectId?: string;
  clientName?: string;
}

const SharePreviewDialog: React.FC<SharePreviewDialogProps> = ({ 
  projectId = "HAR-2025-0001",
  clientName = "Cliente"
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [expirationDays, setExpirationDays] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get current URL for sharing
  const shareUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copiado!",
          description: "O link da prévia foi copiado para a área de transferência.",
        });
        
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link. Tente selecioná-lo manualmente.",
          variant: "destructive"
        });
      });
  };
  
  const handleShareByEmail = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira um email para compartilhar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simular envio de email
      await emailService.sendPreviewNotification(
        email,
        clientName,
        `${shareUrl}?expiration=${expirationDays}`
      );
      
      toast({
        title: "Link compartilhado!",
        description: `Um email com o link da prévia foi enviado para ${email}. Expira em ${expirationDays} dias.`,
      });
      
      setEmail('');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao enviar o email. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Compartilhar Prévia</DialogTitle>
        <DialogDescription>
          Compartilhe este link para que o cliente possa ouvir as prévias da música.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        <div className="flex items-center space-x-2">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1"
          />
          <Button 
            size="sm" 
            onClick={handleCopyLink}
            className={copied ? "bg-green-600" : ""}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configurar e enviar por email</h3>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select 
              value={expirationDays} 
              onValueChange={setExpirationDays}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o prazo de expiração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Essencial - 7 dias</SelectItem>
                <SelectItem value="10">Profissional - 10 dias</SelectItem>
                <SelectItem value="15">Premium - 15 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Digite o email do cliente"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleShareByEmail}
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            <p className="font-medium mb-1">Email que será enviado:</p>
            <p>Assunto: <span className="text-black">Suas prévias musicais estão prontas para avaliação - harmonIA</span></p>
            <p className="mt-1">Olá {clientName},</p>
            <p className="mt-1">Temos o prazer de informar que as prévias da sua música personalizada estão prontas para sua avaliação.</p>
            <p className="mt-1">Acesse: {shareUrl}</p>
            <p className="mt-1">Importante: Você tem {expirationDays} dias para avaliar e escolher sua versão preferida. Após este período, selecionaremos automaticamente a melhor versão para finalização.</p>
            <p className="mt-1">Aguardamos seu feedback!</p>
            <p className="mt-1">Equipe harmonIA</p>
          </div>
        </div>
      </div>
      
      <DialogFooter className="sm:justify-start">
        <p className="text-xs text-gray-500">
          Observação: O link permite apenas visualizar as prévias. A pessoa não poderá enviar feedback após o prazo de expiração.
        </p>
      </DialogFooter>
    </DialogContent>
  );
};

export default SharePreviewDialog;
