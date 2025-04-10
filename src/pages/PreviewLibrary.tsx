
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoogleDrivePreviewsList from '@/components/previews/GoogleDrivePreviewsList';

const PreviewLibrary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-harmonia-green">Biblioteca de Prévias</h1>
            <p className="text-gray-600">
              Explore nossa biblioteca de exemplos musicais diretamente do Google Drive
            </p>
          </div>
          <Button 
            variant="outline" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para a página principal
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <GoogleDrivePreviewsList title="Prévias e exemplos musicais" />
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Acesso direto do Google Drive</h2>
            <p className="text-gray-600 mb-4">
              Todas as músicas e prévias estão sendo carregadas diretamente do Google Drive,
              permitindo fácil gestão e atualização do conteúdo sem necessidade de alterar o código.
            </p>
            <p className="text-gray-600">
              Para adicionar novas músicas à biblioteca, basta fazer upload dos arquivos
              para a pasta do Google Drive e eles ficarão disponíveis automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLibrary;
