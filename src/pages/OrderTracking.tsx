
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be implemented with actual order tracking functionality
    // For now, just show a message
    alert("Funcionalidade de acompanhamento de pedido em implementação");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Acompanhar Pedido</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Digite o número do seu pedido para acompanhar o status do seu projeto musical.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Consultar pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Digite o número do pedido" 
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  Consultar
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Não encontrou seu pedido ou precisa de ajuda?
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/contato')}
            >
              Entre em contato conosco
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
