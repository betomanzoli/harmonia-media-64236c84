
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

interface HelpDialogProps {
  getApiUrl: () => string;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ getApiUrl }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Info className="w-4 h-4 mr-2" />
          Como usar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Como usar esta página</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p>Esta página funciona como um banco de dados simples para suas amostras de áudio. Aqui estão algumas formas de usá-la:</p>
          
          <h3 className="font-semibold">Integração com Chatbots</h3>
          <p>Use o URL da API para buscar exemplos de áudio com base em parâmetros:</p>
          <code className="block bg-muted p-2 rounded">
            {getApiUrl()}?style=MPB&mood=Romântico
          </code>
          
          <h3 className="font-semibold">Armazenamento de Arquivos</h3>
          <p>Para MVP, armazene os arquivos de áudio no GitHub ou em serviços como:</p>
          <ul className="list-disc pl-6">
            <li>Google Drive (gere links compartilháveis)</li>
            <li>Firebase Storage</li>
            <li>AWS S3</li>
          </ul>
          
          <h3 className="font-semibold">Fluxo com Zapier/Make</h3>
          <p>Exemplo de fluxo para integração:</p>
          <ol className="list-decimal pl-6">
            <li>Usuário envia briefing</li>
            <li>Zapier/Make processa o estilo/ocasião</li>
            <li>Busca exemplo relevante neste banco de dados</li>
            <li>Envia resposta com link do áudio</li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
