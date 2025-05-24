
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const GoogleDriveGuide: React.FC = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-300 text-sm">
        Aprenda como usar o Google Drive para armazenar e gerenciar os arquivos multimídia do seu portfólio.
      </p>
      
      <div className="space-y-3">
        <div className="p-3 border border-slate-600 rounded-md bg-slate-800">
          <h3 className="text-sm font-semibold text-gray-300">1. Configure sua conta Google</h3>
          <p className="text-xs text-gray-400 mt-1">
            Certifique-se de que você tenha uma conta Google com espaço suficiente no Drive.
          </p>
        </div>
        
        <div className="p-3 border border-slate-600 rounded-md bg-slate-800">
          <h3 className="text-sm font-semibold text-gray-300">2. Crie uma pasta específica</h3>
          <p className="text-xs text-gray-400 mt-1">
            Crie uma pasta dedicada ao portfólio no seu Google Drive.
          </p>
        </div>
        
        <div className="p-3 border border-slate-600 rounded-md bg-slate-800">
          <h3 className="text-sm font-semibold text-gray-300">3. Configure o compartilhamento</h3>
          <p className="text-xs text-gray-400 mt-1">
            Configure a pasta para ser compartilhada publicamente ou com usuários específicos.
          </p>
        </div>
        
        <div className="p-3 border border-slate-600 rounded-md bg-slate-800">
          <h3 className="text-sm font-semibold text-gray-300">4. Use os links nos itens do portfólio</h3>
          <p className="text-xs text-gray-400 mt-1">
            Copie os links compartilháveis dos arquivos para usar nos itens do portfólio.
          </p>
        </div>
      </div>
      
      <div className="pt-2">
        <Button className="w-full" variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Acessar Documentação Completa
        </Button>
      </div>
    </div>
  );
};

export default GoogleDriveGuide;
