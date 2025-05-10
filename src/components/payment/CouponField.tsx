
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CouponFieldProps {
  onApplyCoupon: (code: string) => void;
  validDiscountCode: string;
}

const CouponField: React.FC<CouponFieldProps> = ({ onApplyCoupon, validDiscountCode }) => {
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();
  
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === validDiscountCode) {
      toast({
        title: "Cupom aplicado!",
        description: `Cupom ${validDiscountCode} aplicado com sucesso!`,
      });
      onApplyCoupon(couponCode);
    } else {
      // Invalid coupon code
      toast({
        title: "Código inválido",
        description: `Código de cupom inválido. Use ${validDiscountCode} para este pacote.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="mt-2 flex items-center">
      <input 
        type="text" 
        placeholder="Digite o código do cupom"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="text-xs border border-border rounded px-2 py-1 w-40 bg-background"
      />
      <button 
        onClick={handleApplyCoupon}
        className="ml-2 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
      >
        Aplicar
      </button>
    </div>
  );
};

export default CouponField;
