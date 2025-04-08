
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const CouponSection: React.FC<CouponSectionProps> = ({ 
  couponCode, 
  setCouponCode, 
  discount, 
  setDiscount 
}) => {
  const { toast } = useToast();
  const [showCouponInput, setShowCouponInput] = useState(false);
  
  const applyCoupon = () => {
    const validCoupons = {
      'PROMO10': 10,
      'HARMON15': 15,
      'SPECIAL5': 5,
      'ESSENCIAL5': 5,
      'PROFISSIONAL5': 5,
      'PREMIUM5': 5
    };
    
    type CouponKey = keyof typeof validCoupons;
    
    if (couponCode in validCoupons) {
      const discountValue = validCoupons[couponCode as CouponKey];
      setDiscount(discountValue);
      toast({
        title: "Cupom aplicado!",
        description: `Desconto de ${discountValue}% aplicado ao seu pedido.`,
      });
    } else {
      setDiscount(0);
      toast({
        title: "Cupom inválido",
        description: "O código inserido não é válido ou já expirou.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cupom de Desconto</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCouponInput(!showCouponInput)}
        >
          {showCouponInput ? "Cancelar" : "Adicionar Cupom"}
        </Button>
      </div>
      
      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700 text-sm">
          Esta calculadora é apenas informativa. Cada serviço será pago individualmente no checkout.
        </AlertDescription>
      </Alert>
      
      {showCouponInput && (
        <div className="flex gap-2">
          <input 
            type="text" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Digite seu cupom"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={applyCoupon}>Aplicar</Button>
        </div>
      )}
      
      {discount > 0 && (
        <div className="mt-4 p-3 bg-harmonia-green/10 border border-harmonia-green/30 rounded-md flex items-center gap-2">
          <Check className="h-5 w-5 text-harmonia-green flex-shrink-0" />
          <span>Cupom aplicado! Desconto de {discount}% no valor total.</span>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Cupons disponíveis para pacotes:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>ESSENCIAL5: 5% de desconto no Pacote Essencial</li>
          <li>PROFISSIONAL5: 5% de desconto no Pacote Profissional</li>
          <li>PREMIUM5: 5% de desconto no Pacote Premium</li>
        </ul>
      </div>
    </div>
  );
};

export default CouponSection;
