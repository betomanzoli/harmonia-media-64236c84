
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentProcessing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract parameters from URL
  const packageId = searchParams.get('packageId') || 'essencial';
  const orderId = searchParams.get('orderId') || '';
  
  // Construct the iframe URL
  const returnUrl = `${window.location.origin}/pagamento-retorno?packageId=${packageId}&orderId=${orderId}`;
  const iframeUrl = `https://biolivre.com.br/harmoniam?package=${packageId}&price=0&returnUrl=${encodeURIComponent(returnUrl)}&embed=true`;
  
  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from biolivre.com.br
      if (event.origin !== 'https://biolivre.com.br') return;
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === 'success' || data.status === 'approved') {
          // Payment successful, redirect to return page
          navigate(`/pagamento-retorno?status=approved&packageId=${packageId}&orderId=${orderId}`);
        } else if (data.status === 'error' || data.status === 'rejected') {
          // Payment failed
          navigate(`/pagamento-retorno?status=rejected&packageId=${packageId}&orderId=${orderId}`);
        }
      } catch (error) {
        console.error('Error processing message from iframe:', error);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, packageId, orderId]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/pagamento/${packageId}`)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h2 className="text-xl font-semibold">Processando Pagamento</h2>
            </div>
            
            <div className="rounded-lg border border-border p-4 mb-4">
              <iframe 
                src={iframeUrl}
                width="100%" 
                height="700" 
                frameBorder="0"
                title="MercadoPago Checkout"
                className="w-full rounded-md"
              />
            </div>
            
            <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              <p className="text-sm">Aguarde enquanto processamos o seu pagamento...</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentProcessing;
