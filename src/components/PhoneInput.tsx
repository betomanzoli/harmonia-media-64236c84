
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
  const [selectedCountry, setSelectedCountry] = useState('BR');
  const [nationalNumber, setNationalNumber] = useState(value?.nationalNumber || '');

  useEffect(() => {
    // Update nationalNumber when value changes from outside
    if (value?.nationalNumber !== nationalNumber) {
      setNationalNumber(value?.nationalNumber || '');
    }
  }, [value?.nationalNumber]);

  // Format the phone number for display
  const formatPhoneNumber = (input: string) => {
    // This is a basic Brazil phone number formatter
    let formatted = input.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = `(${formatted.substring(0, 2)}) ${formatted.substring(2)}`;
    }
    if (formatted.length > 10) {
      formatted = `${formatted.substring(0, 10)}-${formatted.substring(10, 14)}`;
    }
    return formatted;
  };

  // Parse the input into a standardized format
  const parsePhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    
    // We're simplifying for Brazil but this should be expanded for international use
    const countryCode = '55';
    
    return {
      fullNumber: `+${countryCode}${digits}`,
      countryCode,
      nationalNumber: digits
    };
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNationalNumber = e.target.value.replace(/\D/g, '');
    setNationalNumber(newNationalNumber);
    
    onChange({
      fullNumber: `+55${newNationalNumber}`,
      countryCode: '55',
      nationalNumber: newNationalNumber
    });
  };

  const generateWhatsAppLink = (phone: PhoneWithCountryCode) => {
    return `https://wa.me/${phone.fullNumber.replace('+', '')}`;
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className="mb-2 block">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="flex items-center">
        <div className="flex items-center border rounded-l-md border-input p-2 bg-background">
          <span className="text-sm">+55</span>
        </div>
        <Input
          id={id}
          type="tel"
          placeholder={placeholder}
          value={formatPhoneNumber(nationalNumber)}
          onChange={handlePhoneChange}
          className={cn("rounded-l-none", error && "border-red-500")}
          disabled={disabled}
          required={required}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
