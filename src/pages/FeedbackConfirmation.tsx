
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Clock, Calendar, Bell } from 'lucide-react';

const FeedbackConfirmation: React.FC = () => {
  const navigate = useNavigate();
  
  // Calculate estimated date (3 business days from today)
  const getEstimatedDate = () => {
    const date = new Date();
    let businessDays = 3;
    while (businessDays > 0) {
      date.setDate(date.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDays--;
      }
    }
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-harmonia-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-harmonia-green" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Feedback Enviado com Sucesso!</h1>
            
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Agradecemos por suas considerações. Nossa equipe já começou a trabalhar 
              nos ajustes solicitados e você será notificado assim que a versão revisada 
              estiver disponível.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="text-harmonia-green h-5 w-5" />
                <span className="font-medium">
                  Previsão para entrega: <span className="text-harmonia-green font-bold">3 dias úteis</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="text-harmonia-green h-5 w-5" />
                <span className="font-medium">
                  Data estimada: <span className="text-harmonia-green font-bold">{getEstimatedDate()}</span>
                </span>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-left mb-8">
              <h3 className="font-semibold mb-4">Próximos passos:</h3>
              <ol className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <span>Nossa equipe realizará os ajustes solicitados em sua música</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <span>Você receberá uma notificação por email quando a versão revisada estiver pronta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <span>Após aprovação final, enviaremos todos os arquivos e documentação conforme seu pacote</span>
                </li>
              </ol>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-8 flex items-start gap-3">
              <Bell className="text-blue-500 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h4 className="font-medium text-blue-500 mb-1">Ativar notificações</h4>
                <p className="text-sm text-gray-400">
                  Mantenha-se informado sobre atualizações do seu projeto. Além do email,
                  podemos enviar notificações via WhatsApp quando houver novidades.
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-500"
                  onClick={() => window.open('https://wa.me/5511920585072?text=Olá,%20quero%20ativar%20notificações%20para%20meu%20projeto%20via%20WhatsApp', '_blank')}
                >
                  Ativar notificações por WhatsApp →
                </Button>
              </div>
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
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackConfirmation;
