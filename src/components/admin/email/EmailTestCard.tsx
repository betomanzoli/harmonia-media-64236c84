
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { emailService } from '@/lib/supabase';
import { Alert, AlertDescription } from "@/components/ui/alert";

const EmailTestCard: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const [emailType, setEmailType] = useState('briefing');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira um email para enviar o teste.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    
    try {
      let result;
      
      switch (emailType) {
        case 'briefing':
          result = await emailService.sendBriefingConfirmation(testEmail, testName || 'Cliente Teste');
          break;
        case 'preview':
          result = await emailService.sendPreviewNotification(
            testEmail, 
            testName || 'Cliente Teste',
            `${window.location.origin}/cliente/previews/test-12345`
          );
          break;
        case 'payment':
          result = await emailService.sendPaymentConfirmation(
            testEmail,
            testName || 'Cliente Teste',
            'Pacote Premium (Teste)'
          );
          break;
        default:
          throw new Error('Tipo de email não reconhecido');
      }
      
      if (result.success) {
        toast({
          title: "Email enviado",
          description: "O email de teste foi enviado com sucesso.",
        });
      } else {
        setErrorMessage(result.error?.message || "Falha na edge function. Verifique as configurações do Supabase.");
        toast({
          title: "Falha no envio",
          description: "Não foi possível enviar o email de teste. Veja os detalhes abaixo.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro ao enviar email de teste:", error);
      setErrorMessage(error.message || "Ocorreu um erro ao enviar o email.");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Email</CardTitle>
        <CardDescription>
          Envie emails de teste para verificar a configuração
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="text-xs">
              <p className="font-medium mb-1">Erro ao enviar email:</p>
              <p>{errorMessage}</p>
              <p className="mt-2 text-xs">Nota: Este erro pode ocorrer porque a Edge Function no Supabase não está configurada. Para resolver, acesse o Supabase Dashboard e certifique-se de que a função "send-email" está criada e configurada corretamente.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="test-email">Email para Teste</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="test-name">Nome para Teste</Label>
          <Input
            id="test-name"
            placeholder="Nome do Cliente"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-type">Tipo de Email</Label>
          <Select
            value={emailType}
            onValueChange={setEmailType}
          >
            <SelectTrigger id="email-type">
              <SelectValue placeholder="Selecione o tipo de email" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="briefing">Confirmação de Briefing</SelectItem>
              <SelectItem value="preview">Notificação de Prévias</SelectItem>
              <SelectItem value="payment">Confirmação de Pagamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleSendTestEmail}
          disabled={isSending}
          className="w-full mt-4"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Email de Teste'
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Nota: Para utilizar este recurso, é necessário ter uma Edge Function "send-email" configurada no Supabase. Consulte o arquivo de exemplo em src/services/edgeFunctionExample.js.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailTestCard;
