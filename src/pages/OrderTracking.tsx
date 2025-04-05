
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<null | {
    status: string;
    currentStage: string;
    estimatedDelivery: string;
    lastUpdate: string;
  }>(null);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId || !email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulação de chamada de API
      // Em produção, substitua por uma chamada real para seu backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados - substitua pela resposta real da API
      setOrderDetails({
        status: "Em andamento",
        currentStage: "Mixagem final",
        estimatedDelivery: "15/04/2025",
        lastUpdate: "03/04/2025"
      });
      
      toast({
        title: "Sucesso",
        description: "Informações do pedido encontradas",
      });
    } catch (error) {
      console.error("Erro ao buscar informações do pedido:", error);
      toast({
        title: "Erro",
        description: "Não foi possível encontrar seu pedido. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Acompanhar Pedido</h1>
          
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium mb-1">
                  Número do Pedido
                </label>
                <Input
                  id="orderId"
                  placeholder="Ex: HAR-12345"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-mail utilizado na compra
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90" disabled={loading}>
                {loading ? "Buscando..." : "Verificar Status"}
              </Button>
            </form>
          </div>
          
          {orderDetails && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Detalhes do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-medium">{orderDetails.status}</span>
                </div>
                
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-gray-400">Etapa atual:</span>
                  <span className="font-medium">{orderDetails.currentStage}</span>
                </div>
                
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-gray-400">Previsão de entrega:</span>
                  <span className="font-medium">{orderDetails.estimatedDelivery}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Última atualização:</span>
                  <span className="font-medium">{orderDetails.lastUpdate}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Precisa de ajuda?</h2>
            <p className="text-gray-400 mb-4">
              Se você está com algum problema para acompanhar seu pedido ou precisa de informações adicionais, 
              nossa equipe está pronta para ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                className="flex items-center gap-2"
              >
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('mailto:contato@harmonia.media', '_blank')}
                className="flex items-center gap-2"
              >
                E-mail
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
