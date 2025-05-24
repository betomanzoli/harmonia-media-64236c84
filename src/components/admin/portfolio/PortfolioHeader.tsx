
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { FileAudio, Info, ArrowLeft, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PortfolioHeaderProps {
  onAdd?: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ onAdd }) => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Portfólio</h1>
        <p className="text-muted-foreground">
          Área administrativa para gerenciar exemplos de áudio do portfólio
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex gap-2">
        {onAdd && (
          <Button onClick={onAdd} variant="default" className="flex items-center gap-1">
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Item
          </Button>
        )}
        
        <Link to="/admin-j28s7d1k/audio-database">
          <Button variant="outline" className="flex items-center gap-1">
            <FileAudio className="w-4 h-4 mr-1" />
            Banco de Áudio
          </Button>
        </Link>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Info className="w-4 h-4 mr-2" />
              Como usar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Como usar o gerenciamento de portfólio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p>Esta página permite gerenciar os exemplos de áudio que aparecem no portfólio público do site. Você pode:</p>
              
              <h3 className="font-semibold">Adicionar novos exemplos</h3>
              <p>Use o formulário na parte inferior para adicionar novos exemplos ao portfólio.</p>
              
              <h3 className="font-semibold">Gerenciar exemplos existentes</h3>
              <p>Visualize, edite ou remova exemplos existentes na tabela principal.</p>
              
              <h3 className="font-semibold">Integração com automações</h3>
              <p>Configure webhooks para integrar com Zapier/Make para automatizar o processo de adição de novos exemplos.</p>
            </div>
          </DialogContent>
        </Dialog>
        
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Página Inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PortfolioHeader;
