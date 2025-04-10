
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, HelpCircle, FileMusic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreviewsHeaderProps {
  scrollToNewForm: () => void;
}

const PreviewsHeader: React.FC<PreviewsHeaderProps> = ({ scrollToNewForm }) => {
  const { toast } = useToast();

  const syncWithDrive = () => {
    toast({
      title: "Sincronizando com Google Drive",
      description: "Sincronizando arquivos de prévia com o Google Drive...",
    });

    // Simulação de sincronização
    setTimeout(() => {
      toast({
        title: "Sincronização concluída",
        description: "Todos os arquivos de prévia estão atualizados.",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-harmonia-green mb-2">Sistema de Prévias Musicais</h2>
            <p className="text-gray-500 mb-4">
              Gerencie as prévias musicais enviadas para os clientes, receba feedback e acompanhe aprovações.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={scrollToNewForm}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
              </Button>
              
              <Button variant="outline" onClick={syncWithDrive}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sincronizar com Drive
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/PREVIEWS_README.md" target="_blank" rel="noopener noreferrer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Guia do sistema
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <FileMusic className="h-4 w-4 text-yellow-500 mr-2" />
                <span>Aguardando avaliação</span>
              </div>
              <span className="font-bold">3</span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <FileMusic className="h-4 w-4 text-blue-500 mr-2" />
                <span>Feedback recebido</span>
              </div>
              <span className="font-bold">2</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileMusic className="h-4 w-4 text-green-500 mr-2" />
                <span>Aprovadas</span>
              </div>
              <span className="font-bold">5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewsHeader;
