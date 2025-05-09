
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TermsDialog from '@/components/service-card/TermsDialog';

interface OrderSummaryProps {
  basePrice: number;
  extrasPrice: number;
  finalPrice: number;
  discount: number;
  selectedPackage: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  basePrice, 
  extrasPrice, 
  finalPrice, 
  discount,
  selectedPackage 
}) => {
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };
  
  // Map the selected package to the payment route
  const getPaymentRoute = () => {
    switch(selectedPackage) {
      case 'professional':
        return '/pagamento/profissional';
      case 'premium':
        return '/pagamento/premium';
      case 'essential':
      default:
        return '/pagamento/essencial';
    }
  };

  const handleProceedToPayment = () => {
    const route = getPaymentRoute();
    setRedirectPath(route);
    setIsTermsDialogOpen(true);
  };

  const handleAcceptTerms = () => {
    // Close the dialog - the Link component will handle the navigation
    setIsTermsDialogOpen(false);
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span>Pacote base:</span>
          <span className="font-medium">{formatCurrency(basePrice)}</span>
        </div>
        
        {extrasPrice > 0 && (
          <div className="flex justify-between">
            <span>Serviços extras:</span>
            <span className="font-medium">{formatCurrency(extrasPrice)}</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="flex justify-between text-green-500">
            <span>Desconto ({discount}%):</span>
            <span className="font-medium">-{formatCurrency((basePrice + extrasPrice) * discount / 100)}</span>
          </div>
        )}
        
        <div className="pt-4 border-t border-border flex justify-between">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-xl">{formatCurrency(finalPrice)}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
          onClick={handleProceedToPayment}
        >
          Prosseguir para pagamento
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Pagamento seguro processado pelo MercadoPago
        </p>
      </div>

      {/* Contract Terms Dialog */}
      <TermsDialog
        open={isTermsDialogOpen}
        onOpenChange={setIsTermsDialogOpen}
        title={selectedPackage === 'professional' ? 'Pacote Profissional' : 
               selectedPackage === 'premium' ? 'Pacote Premium' : 'Pacote Essencial'}
        acceptedTerms={acceptedTerms}
        onAcceptedTermsChange={setAcceptedTerms}
        onAccept={handleAcceptTerms}
      />

      {/* This Link is invisible but will be clicked programmatically after accepting terms */}
      {acceptedTerms && redirectPath && (
        <Link 
          to={redirectPath} 
          id="redirectLink" 
          className="hidden"
          onClick={() => document.getElementById('redirectLink')?.click()}
        />
      )}
    </div>
  );
};

export default OrderSummary;
