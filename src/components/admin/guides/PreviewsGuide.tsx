
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, Mail, SmartphoneIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { siteConfig } from '@/config/site';

const PreviewsGuide: React.FC = () => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  // Template para Email
  const emailTemplate = `Olá [Nome do Cliente],

Estamos animados em compartilhar as primeiras versões da sua música personalizada!

Para ouvi-las e fornecer seu feedback, acesse o link abaixo:
${baseUrl}${siteConfig.urls.previews}/[ID_DO_PREVIEW]

Neste link, você poderá:
- Ouvir as diferentes versões que criamos
- Selecionar a que mais gostou
- Fornecer feedback específico para ajustes
- Aprovar a versão final quando estiver satisfeito

O link estará disponível por 30 dias após a criação.

Estamos ansiosos pelo seu feedback!

Equipe harmonIA
${siteConfig.contact.email}
${siteConfig.contact.whatsapp}`;

  // Template para WhatsApp
  const whatsappTemplate = `Olá [Nome do Cliente]! 😊

As primeiras versões da sua música já estão disponíveis para audição!

Acesse este link para ouvir e escolher sua versão preferida:
${baseUrl}${siteConfig.urls.previews}/[ID_DO_PREVIEW]

Aguardamos seu feedback!
Equipe harmonIA`;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Guia: Sistema de Prévias Musicais</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Como funciona o sistema de prévias?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">
              O sistema de prévias permite que os clientes ouçam versões limitadas das músicas criadas antes da 
              finalização, escolham sua favorita e forneçam feedback.
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Crie as versões iniciais da música do cliente</li>
              <li>Faça upload das prévias no sistema administrativo</li>
              <li>Gere um link único de preview para o cliente</li>
              <li>Envie o link por e-mail ou WhatsApp usando os templates abaixo</li>
              <li>O cliente ouve, seleciona uma versão e fornece feedback</li>
              <li>Com base no feedback, faça os ajustes necessários ou finalize a música</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Como criar um novo link de preview?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">Para criar um novo link de preview, siga estas etapas:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Acesse a seção "Gerenciar Prévias" no painel administrativo</li>
              <li>Clique em "Nova Prévia"</li>
              <li>Preencha as informações do cliente e do projeto</li>
              <li>Faça upload dos arquivos de áudio para as prévias (máx. 5 arquivos)</li>
              <li>Configure a duração da prévia (padrão: 30 segundos)</li>
              <li>Clique em "Gerar Link de Preview"</li>
              <li>Copie o link gerado e envie ao cliente</li>
            </ol>
            <div className="mt-4 p-3 bg-muted rounded-md text-xs font-mono">
              Formato do link: {baseUrl}{siteConfig.urls.previews}/[ID_UNICO_GERADO]
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Template para E-mail</AccordionTrigger>
          <AccordionContent>
            <div className="relative">
              <pre className="p-4 rounded-md bg-card border text-sm whitespace-pre-wrap overflow-auto">
                {emailTemplate}
              </pre>
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(emailTemplate)}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="mt-4 w-full"
              variant="outline"
              onClick={() => {
                window.open(`mailto:?subject=Suas%20prévias%20musicais%20da%20harmonIA&body=${encodeURIComponent(emailTemplate)}`);
              }}
            >
              <Mail className="mr-2 h-4 w-4" /> Abrir no cliente de e-mail
            </Button>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>Template para WhatsApp</AccordionTrigger>
          <AccordionContent>
            <div className="relative">
              <pre className="p-4 rounded-md bg-card border text-sm whitespace-pre-wrap overflow-auto">
                {whatsappTemplate}
              </pre>
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(whatsappTemplate)}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="mt-4 w-full"
              variant="outline"
              onClick={() => {
                window.open(`https://wa.me/?text=${encodeURIComponent(whatsappTemplate)}`);
              }}
            >
              <SmartphoneIcon className="mr-2 h-4 w-4" /> Abrir no WhatsApp Web
            </Button>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>Perguntas frequentes</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Por quanto tempo o link fica disponível?</h4>
                <p className="text-gray-400">Os links de preview ficam disponíveis por 30 dias após a criação.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">O cliente pode baixar as prévias?</h4>
                <p className="text-gray-400">Não, o sistema permite apenas ouvir as prévias online para proteger os direitos autorais.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">É possível adicionar mais versões depois?</h4>
                <p className="text-gray-400">Sim, você pode adicionar novas versões ao mesmo link de preview a qualquer momento.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">O cliente recebe notificações?</h4>
                <p className="text-gray-400">O sistema envia e-mails automáticos quando novas versões são adicionadas ou quando há atualizações no projeto.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Como saber se o cliente já viu as prévias?</h4>
                <p className="text-gray-400">O painel administrativo mostra estatísticas de visualização, incluindo quando o cliente acessou o link pela última vez.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

// Export both as default and named export to ensure compatibility
export { PreviewsGuide };
export default PreviewsGuide;
