
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Folder, FileText, FilePlus, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { STORAGE_FOLDERS } from '@/services/googleDriveService';

const InvoicesGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guia de Gerenciamento de Faturas</CardTitle>
        <CardDescription>Como gerenciar faturas e documentos fiscais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <Folder className="mr-2 h-5 w-5 text-harmonia-green" />
            Armazenamento de Faturas
          </h3>
          <p className="text-sm text-muted-foreground">
            Todas as faturas são armazenadas no Google Drive na pasta:
          </p>
          <div className="bg-muted p-3 rounded-md text-sm font-mono">
            {STORAGE_FOLDERS.INVOICES}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Fluxo de Trabalho</h3>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mr-3">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">1. Geração da fatura</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Após a confirmação do pagamento, a fatura é gerada automaticamente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mr-3">
                <FilePlus className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">2. Upload da nota fiscal</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Use o botão "Anexar NF" para fazer o upload da nota fiscal no formato PDF.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mr-3">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">3. Download de documentos</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Acesse as faturas e notas fiscais a qualquer momento através da interface.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mr-3">
                <RefreshCw className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium">4. Atualização de status</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Atualize o status da fatura conforme necessário (Emitida, Paga, Cancelada).
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-lg font-medium flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
            Boas Práticas
          </h3>
          
          <ul className="space-y-2 ml-6 mt-2 list-disc text-sm text-muted-foreground">
            <li>Sempre nomeie os arquivos de nota fiscal com o ID do projeto</li>
            <li>Verifique se todos os documentos foram corretamente anexados</li>
            <li>Mantenha o registro de faturas atualizado com o status correto</li>
            <li>Faça backup mensal de todos os documentos fiscais</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesGuide;
