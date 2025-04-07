import React from 'react';
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const proceedToBriefing = () => {
    toast({
      title: "Configuração salva!",
      description: "Você será redirecionado para a página de briefing.",
    });
    
    navigate(siteConfig.urls.briefing || '/briefing');
  };
  
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Pacote {selectedPackage === 'essential' ? 'Essencial' : selectedPackage === 'professional' ? 'Profissional' : 'Premium'}</span>
            <span>R${basePrice.toFixed(2)}</span>
          </div>
          
          {extrasPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Extras</span>
              <span>+R${extrasPrice.toFixed(2)}</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-harmonia-green">
              <span>Desconto ({discount}%)</span>
              <span>-R${((basePrice + extrasPrice) * discount / 100).toFixed(2)}</span>
            </div>
          )}
          
          <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R${finalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white h-12"
            onClick={proceedToBriefing}
          >
            Prosseguir para Briefing
          </Button>
          
          <div className="flex items-start gap-2 text-sm text-gray-400 p-3 bg-background rounded-md">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>Os preços são em reais (BRL) e incluem todos os impostos aplicáveis.</p>
              <p className="mt-1">O pagamento será solicitado após a aprovação do briefing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
