
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CouponFieldProps {
  onApplyCoupon: (code: string) => void;
  validDiscountCode: string;
}

const CouponField: React.FC<CouponFieldProps> = ({ onApplyCoupon, validDiscountCode }) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleApplyCoupon = () => {
    if (!couponCode) {
      setError('Por favor, insira o código do cupom');
      return;
    }
    
    if (couponCode.toUpperCase() === validDiscountCode) {
      setError(null);
      setSuccess(true);
      toast({
        title: "Cupom aplicado!",
        description: "O desconto será aplicado ao seu pagamento.",
      });
      onApplyCoupon(couponCode);
    } else {
      setError('Código de cupom inválido');
      setSuccess(false);
    }
  };
  
  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-md">
      <div className="flex gap-2">
        <Input
          placeholder="Insira o código do cupom"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          className="flex-1"
        />
        <Button 
          variant="outline" 
          onClick={handleApplyCoupon}
        >
          Aplicar
        </Button>
      </div>
      
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-1.5 mt-2 text-green-500 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Cupom aplicado com sucesso!</span>
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-2">
        *Cupons promocionais oferecem 5% de desconto no valor total do pacote
      </p>
    </div>
  );
};

export default CouponField;
