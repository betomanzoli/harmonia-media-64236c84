
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SharePreviewDialog from './SharePreviewDialog';

interface PreviewHeaderProps {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ 
  clientName, 
  projectTitle,
  status 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 text-gray-400 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à página inicial
        </Button>
      </div>
      
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{projectTitle}</h1>
          <p className="text-xl text-gray-300">Olá, {clientName}!</p>
          <p className="text-gray-400 mt-4">
            Estamos animados para apresentar as primeiras versões da sua música. 
            Por favor, ouça cada uma delas e nos informe qual você prefere.
            As prévias têm duração limitada para proteção dos direitos autorais.
          </p>
        </div>
        
        {status !== 'approved' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </DialogTrigger>
            <SharePreviewDialog />
          </Dialog>
        )}
      </div>
    </>
  );
};

export default PreviewHeader;
