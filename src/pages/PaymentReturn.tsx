
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import emailService from '@/services/emailService';
import { createOrderData } from '@/lib/payment/orderUtils';
import PaymentReturnSuccess from '@/components/payment/PaymentReturnSuccess';
import PaymentReturnError from '@/components/payment/PaymentReturnError';
import PaymentReturnLoading from '@/components/payment/PaymentReturnLoading';

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  
  // Extract parameters from URL
  const status = searchParams.get('status');
  const packageId = searchParams.get('packageId');
  const orderId = searchParams.get('orderId');
  const externalReference = searchParams.get('external_reference');
  const referrer = document.referrer;
  
  useEffect(() => {
    const processPaymentReturn = async () => {
      // Wait a moment to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored payment data
      const storedPaymentData = localStorage.getItem('paymentData');
      let parsedData;
      
      if (storedPaymentData) {
        try {
          parsedData = JSON.parse(storedPaymentData);
          setPaymentData(parsedData);
        } catch (e) {
          console.error('Error parsing stored payment data:', e);
        }
      }
      
      // Check if we're coming from biolivre.com.br
      const isFromBioLivre = referrer.includes('biolivre.com.br');
      
      // Validate the payment return
      if ((status === 'approved' || status === 'success') || isFromBioLivre) {
        // Successful payment
        setSuccess(true);
        
        // Get qualification data
        const qualificationData = localStorage.getItem('qualificationData');
        let parsedQualificationData = null;
        
        if (qualificationData) {
          try {
            parsedQualificationData = JSON.parse(qualificationData);
          } catch (e) {
            console.error('Error parsing qualification data:', e);
          }
        }
        
        // If we have payment data from localStorage or from URL params, create order data
        if (parsedData || (packageId && orderId)) {
          const paymentInfo = parsedData || {
            packageId: packageId || 'essencial',
            orderId: orderId || `HAR-${Date.now()}`,
            method: 'MercadoPago',
            extras: []
          };
          
          // Create order data
          const orderData = createOrderData(
            paymentInfo,
            parsedQualificationData?.name || 'Cliente',
            'MercadoPago',
            paymentInfo.packageId
          );
          
          // Store order data
          localStorage.setItem('orderData', JSON.stringify(orderData));
          
          // Send email confirmation if we have the email
          if (parsedQualificationData?.email) {
            try {
              await emailService.sendPaymentConfirmation(
                parsedQualificationData.email,
                parsedQualificationData.name || 'Cliente',
                paymentInfo.packageName || 'Pacote harmonIA'
              );
            } catch (e) {
              console.error('Error sending confirmation email:', e);
            }
          }
          
          // Success toast
          toast({
            title: "Pagamento confirmado!",
            description: "Seu pedido foi registrado com sucesso. Por favor, preencha o briefing para iniciarmos o projeto.",
          });
        }
      } else {
        // Failed payment
        setSuccess(false);
        
        toast({
          title: "Pagamento não confirmado",
          description: "Houve um problema com seu pagamento. Por favor, tente novamente ou entre em contato com nosso suporte.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    processPaymentReturn();
  }, [status, packageId, orderId, externalReference, toast, referrer]);
  
  const renderContent = () => {
    if (loading) {
      return <PaymentReturnLoading />;
    }
    
    if (success) {
      return <PaymentReturnSuccess paymentData={paymentData} orderId={orderId} />;
    }
    
    return <PaymentReturnError />;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            {renderContent()}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentReturn;
