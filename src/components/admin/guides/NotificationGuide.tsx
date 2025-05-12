
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Guia de Configuração de Notificações</h2>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          As notificações são enviadas usando o webhook do Zapier já configurado no sistema.
          Para personalizar e gerenciar estas notificações, siga o guia abaixo.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">1. Configuração Inicial do Webhook</h3>
        <p>
          O sistema de notificações usa um webhook do Zapier para enviar atualizações para diferentes sistemas,
          incluindo e-mails para clientes. A URL padrão do webhook já está configurada:
        </p>
        <code className="block bg-slate-100 p-2 rounded">
          https://hooks.zapier.com/hooks/catch/22316385/2031hl7/
        </code>
        
        <h3 className="text-lg font-medium mt-6">2. Como as Notificações Funcionam</h3>
        <p>
          Quando você clica em "Enviar notificação" na página de detalhes do projeto, o sistema:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Envia os dados do cliente e da mensagem para o webhook configurado</li>
          <li>O Zapier recebe esses dados e pode acionar diversas ações automatizadas</li>
          <li>Por padrão, as notificações são configuradas para enviar um e-mail ao cliente</li>
        </ol>
        
        <h3 className="text-lg font-medium mt-6">3. Personalizando as Notificações de E-mail</h3>
        <p>
          Para personalizar o modelo de e-mail enviado para os clientes:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Acesse sua conta do Zapier (zapier.com)</li>
          <li>Localize o Zap conectado ao webhook do harmonIA</li>
          <li>Edite a etapa de envio de e-mail para personalizar o modelo</li>
          <li>Você pode usar os dados enviados pelo webhook como variáveis no seu e-mail</li>
        </ol>
        
        <h3 className="text-lg font-medium mt-6">4. Testando o Sistema de Notificações</h3>
        <p>
          Para testar se o sistema de notificações está funcionando corretamente:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Vá para a página de Armazenamento ou de Prévias no painel administrativo</li>
          <li>Localize a seção de configuração do webhook</li>
          <li>Clique no botão "Enviar teste"</li>
          <li>Verifique nos logs do Zapier se o teste foi recebido</li>
        </ol>
        
        <h3 className="text-lg font-medium mt-6">5. Ações no Painel de Prévias</h3>
        <p>
          No painel de detalhes do projeto de prévia, você pode:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Enviar notificação:</strong> Envia uma mensagem personalizada ao cliente sobre o projeto</li>
          <li><strong>Adicionar versão:</strong> Adiciona uma nova versão musical ao projeto</li>
          <li><strong>Copiar link:</strong> Copia o link da página de prévia para compartilhar com o cliente</li>
        </ul>
        
        <div className="mt-8">
          <Button asChild variant="outline" className="flex items-center">
            <a href="https://zapier.com/app/dashboard" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Acessar Dashboard do Zapier
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationGuide;
