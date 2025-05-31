import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Calendar, Loader2 } from 'lucide-react';
import { useProjects, Project } from '@/hooks/admin/useProjects'; // ✅ CORRIGIDO

const OrderTracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Project | null>(null); // ✅ CORRIGIDO
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projects } = useProjects(); // ✅ CORRIGIDO
  
  const handleSearch = () => {
    if (!orderId.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, informe o código do pedido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simular busca de pedido
    setTimeout(() => {
      const foundProject = projects.find(p => 
        p.id.toLowerCase() === orderId.toLowerCase() && 
        p.client_email?.toLowerCase() === email.toLowerCase() // ✅ CORRIGIDO
      );
      
      if (foundProject) {
        setOrderDetails(foundProject);
      } else {
        toast({
          title: "Pedido não encontrado",
          description: "Verifique o código e email informados e tente novamente.",
          variant: "destructive"
        });
      }
      
      setIsSearching(false);
    }, 1000);
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'Aguardando sua avaliação';
      case 'feedback':
        return 'Em ajustes conforme seu feedback';
      case 'approved':
        return 'Projeto aprovado - Finalização em andamento';
      default:
        return 'Em processamento';
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Acompanhar Pedido</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buscar Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-id">Código do Pedido</Label>
                  <Input 
                    id="order-id" 
                    placeholder="Ex: P0001" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Seu email cadastrado no pedido" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching} 
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar Pedido
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Pedido {orderDetails.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                      <p className="font-medium">{orderDetails.client_name}</p> {/* ✅ CORRIGIDO */}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="font-medium">{orderDetails.client_email}</p> {/* ✅ CORRIGIDO */}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Pacote</h3>
                      <p className="font-medium">{orderDetails.package_type}</p> {/* ✅ CORRIGIDO */}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data do Pedido</h3>
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(orderDetails.created_at).toLocaleDateString('pt-BR')} {/* ✅ CORRIGIDO */}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status do Pedido</h3>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-harmonia-green" />
                      <span className="font-medium">{getStatusText(orderDetails.status)}</span>
                    </div>
                  </div>
                  
                  {orderDetails.status !== 'waiting' && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => navigate(`/client-preview/${orderDetails.preview_code}`)} // ✅ CORRIGIDO
                        className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                      >
                        Ver Prévias da Música
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
