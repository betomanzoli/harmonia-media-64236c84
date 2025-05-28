
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface PhoneWithCountryCode {
  fullNumber: string;
  countryCode: string;
  nationalNumber: string;
}

interface PhoneInputProps {
  value: PhoneWithCountryCode;
  onChange: (value: PhoneWithCountryCode) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  id = 'phone',
  placeholder = '(11) 99999-9999',
  className,
  required = false,
  error,
  disabled = false
}) => {
  const [nationalNumber, setNationalNumber] = useState(value?.nationalNumber || '');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (value?.nationalNumber !== nationalNumber) {
      setNationalNumber(value?.nationalNumber || '');
    }
  }, [value?.nationalNumber]);

  // Formato brasileiro: (XX) XXXXX-XXXX
  const formatPhoneNumber = (input: string) => {
    let formatted = input.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = `(${formatted.substring(0, 2)}) ${formatted.substring(2)}`;
    }
    if (formatted.length > 10) {
      formatted = `${formatted.substring(0, 10)}-${formatted.substring(10, 14)}`;
    }
    return formatted;
  };

  // Validação obrigatória para formato internacional brasileiro
  const validateBrazilianPhone = (digits: string): boolean => {
    // Formato: XX XXXXX-XXXX ou XX XXXX-XXXX (11 ou 10 dígitos após código do país)
    const phoneRegex = /^[1-9][1-9][9][0-9]{8}$|^[1-9][1-9][0-9]{8}$/;
    return phoneRegex.test(digits) && digits.length >= 10 && digits.length <= 11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const truncatedDigits = digits.substring(0, 11);
    setNationalNumber(truncatedDigits);
    
    // Validação em tempo real
    if (truncatedDigits.length > 0) {
      if (!validateBrazilianPhone(truncatedDigits)) {
        if (truncatedDigits.length < 10) {
          setValidationError('Telefone deve ter pelo menos 10 dígitos');
        } else if (truncatedDigits.length === 10 && !truncatedDigits.startsWith('11')) {
          setValidationError('Telefone fixo deve começar com código de área válido');
        } else if (truncatedDigits.length === 11 && truncatedDigits.charAt(2) !== '9') {
          setValidationError('Celular deve ter 9 como terceiro dígito');
        } else {
          setValidationError('Formato de telefone inválido');
        }
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }

    // Sempre atualiza o valor para permitir digitação
    const fullNumber = `+55${truncatedDigits}`;
    onChange({
      fullNumber,
      countryCode: '55',
      nationalNumber: truncatedDigits
    });
  };

  const isValid = () => {
    return nationalNumber.length === 0 || (validateBrazilianPhone(nationalNumber) && !validationError);
  };

  const displayError = error || validationError;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="flex items-center">
        <div className="flex items-center border rounded-l-md border-input p-2 bg-background">
          <span className="text-sm font-medium">🇧🇷 +55</span>
        </div>
        <Input
          id={id}
          type="tel"
          placeholder={placeholder}
          value={formatPhoneNumber(nationalNumber)}
          onChange={handlePhoneChange}
          className={cn(
            "rounded-l-none", 
            (displayError && !isValid()) && "border-red-500"
          )}
          disabled={disabled}
          required={required}
          maxLength={15} // (XX) XXXXX-XXXX
        />
      </div>

      {displayError && !isValid() && (
        <p className="text-red-500 text-xs mt-1">{displayError}</p>
      )}
      
      {required && nationalNumber.length > 0 && isValid() && (
        <p className="text-green-600 text-xs mt-1">✓ Formato válido para WhatsApp</p>
      )}
    </div>
  );
};

export default PhoneInput;
