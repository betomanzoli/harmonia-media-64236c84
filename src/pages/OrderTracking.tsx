
import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OrderTracking: React.FC = () => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderFound, setOrderFound] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite o número do pedido.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulação de busca de pedido
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Exemplo de dados de pedido - em uma implementação real, isso viria do backend
      const mockOrderData = {
        id: orderId,
        status: 'em_andamento',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
        packageType: 'Profissional',
        currentStage: 'composição',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias a partir de agora
        progressPercentage: 60,
        stages: [
          { name: 'Briefing', completed: true, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Análise', completed: true, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Composição', completed: false, currentStage: true, estimatedCompletion: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Produção', completed: false, estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
          { name: 'Finalização', completed: false, estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      };
      
      setOrderData(mockOrderData);
      setOrderFound(true);
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível encontrar o pedido. Verifique o número e tente novamente.",
        variant: "destructive",
      });
      setOrderFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Acompanhe seu Pedido</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Digite o número do seu pedido para verificar o status atual do seu projeto musical.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Digite o número do pedido (ex: HAR-123456789)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  {isLoading ? "Buscando..." : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {orderFound && orderData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Pedido #{orderData.id}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      orderData.status === 'concluido' ? 'bg-green-100 text-green-800' : 
                      orderData.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orderData.status === 'concluido' ? 'Concluído' : 
                       orderData.status === 'em_andamento' ? 'Em andamento' : 
                       'Aguardando'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Data do pedido</p>
                      <p className="font-medium">{formatDate(orderData.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pacote</p>
                      <p className="font-medium">{orderData.packageType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Previsão de entrega</p>
                      <p className="font-medium">{formatDate(orderData.estimatedDelivery)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{orderData.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-harmonia-green h-2 rounded-full" 
                        style={{ width: `${orderData.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Etapas do projeto</h3>
                    <div className="relative">
                      {/* Progress line */}
                      <div className="absolute left-4 top-0 w-px h-full bg-gray-200"></div>
                      
                      {/* Stages */}
                      {orderData.stages.map((stage: any, index: number) => (
                        <div key={index} className="relative flex items-start mb-6 last:mb-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                            ${stage.completed ? 'bg-green-100 text-green-600' : 
                              stage.currentStage ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            {stage.completed ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">{stage.name}</h4>
                            {stage.completed ? (
                              <p className="text-sm text-gray-500">Concluído em {formatDate(stage.date)}</p>
                            ) : (
                              <p className="text-sm text-gray-500">
                                {stage.currentStage ? 'Em progresso' : 'Pendente'} - 
                                Estimativa: {formatDate(stage.estimatedCompletion)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm">
                      Precisa de mais informações sobre seu pedido? Entre em contato conosco através do WhatsApp ou email.
                    </p>
                    <Button variant="link" className="mt-2 p-0 h-auto text-harmonia-green">
                      Falar com um atendente <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {!orderFound && !isLoading && orderId && (
            <Card className="bg-gray-50">
              <CardContent className="py-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Não foi possível encontrar um pedido com esse número. Verifique se o número está correto e tente novamente.
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Dúvidas sobre o acompanhamento do seu pedido? Entre em contato com nosso suporte pelo WhatsApp ou email.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderTracking;
