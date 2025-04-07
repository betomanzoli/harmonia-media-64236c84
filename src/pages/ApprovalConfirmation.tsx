
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Clock, Download, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ApprovalConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDownloadPreview = () => {
    // Em produção, este seria um link real para o arquivo de prévia
    toast({
      title: "Download iniciado",
      description: "O arquivo de prévia de baixa qualidade começou a ser baixado.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Música Aprovada!</h1>
            
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Estamos felizes que você aprovou sua música! Nossa equipe já iniciou o processo 
              de finalização e masterização para entregar a versão completa conforme seu pacote.
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <Clock className="text-green-500 h-5 w-5" />
              <span className="font-medium">
                Previsão para entrega final: <span className="text-green-500 font-bold">5 dias úteis</span>
              </span>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-left mb-8">
              <h3 className="font-semibold mb-4">Próximos passos:</h3>
              <ol className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="bg-green-500/20 text-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <span>Nossa equipe realizará o processo de masterização profissional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-500/20 text-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <span>Você receberá um email quando a versão final estiver pronta para download</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-500/20 text-green-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <span>Todos os arquivos e documentação serão disponibilizados conforme seu pacote</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="p-6 border border-dashed border-gray-500 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-harmonia-green" />
                  Versão de Prévia Disponível
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Enquanto trabalhamos na versão final, você pode baixar uma versão de prévia (qualidade limitada) 
                  da música aprovada para uso interno e planejamento.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleDownloadPreview}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Versão de Prévia
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Nota: Esta versão é protegida por direitos autorais e apenas para uso pessoal.
                </p>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/acompanhar-pedido')}
                  className="flex items-center gap-2"
                >
                  Acompanhar Pedido
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2"
                >
                  Voltar à Página Inicial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApprovalConfirmation;
