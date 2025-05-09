import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PhoneWithCountryCode } from '@/types/project.types';

// Common country codes with flags
const countryCodes = [
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+1', flag: '🇺🇸', name: 'EUA/Canadá' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+34', flag: '🇪🇸', name: 'Espanha' },
  { code: '+49', flag: '🇩🇪', name: 'Alemanha' },
  { code: '+33', flag: '🇫🇷', name: 'França' },
  { code: '+39', flag: '🇮🇹', name: 'Itália' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: PhoneWithCountryCode) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Telefone',
  placeholder = '(00) 00000-0000',
  className,
  error,
  required = false
}) => {
  const [countryCode, setCountryCode] = useState('+55');
  const [nationalNumber, setNationalNumber] = useState('');
  
  // Parse initial value
  useEffect(() => {
    if (value) {
      // Check if value has a country code
      const hasCountryCode = /^\+\d+/.test(value);
      
      if (hasCountryCode) {
        // Find the country code
        const selectedCode = countryCodes.find(c => value.startsWith(c.code)) || countryCodes[0];
        setCountryCode(selectedCode.code);
        
        // Extract the national number part
        setNationalNumber(value.substring(selectedCode.code.length).trim());
      } else {
        // No country code, use the whole value as national number
        setNationalNumber(value);
      }
    }
  }, []);
  
  // Format phone number as user types
  const formatPhoneNumber = (phone: string): string => {
    // Remove non-numeric characters
    const numericValue = phone.replace(/\D/g, '');
    
    if (numericValue.length <= 2) {
      return numericValue;
    } 
    
    if (numericValue.length <= 7) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    }
    
    if (numericValue.length <= 11) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`;
    }
    
    // Limit to standard Brazilian phone number format
    return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
  };
  
  // Handle phone number changes with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setNationalNumber(formatted);
    
    // Notify the parent with the full phone object
    onChange({
      code: countryCode,
      number: formatted,
      fullNumber: `${countryCode} ${formatted}`,
      countryCode: countryCode,  // Added for compatibility
      nationalNumber: formatted  // Added for compatibility
    });
  };
  
  // Handle country code changes
  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    
    // Notify the parent with the updated phone object
    onChange({
      code: newCode,
      number: nationalNumber,
      fullNumber: `${newCode} ${nationalNumber}`,
      countryCode: newCode,  // Added for compatibility
      nationalNumber: nationalNumber  // Added for compatibility
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor="phone-input">{label}{required && <span className="text-red-500">*</span>}</Label>}
      
      <div className="flex">
        <Select value={countryCode} onValueChange={handleCountryCodeChange}>
          <SelectTrigger className="w-[120px] rounded-r-none">
            <SelectValue placeholder="+55" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          id="phone-input"
          type="tel"
          placeholder={placeholder}
          value={nationalNumber}
          onChange={handlePhoneChange}
          className="rounded-l-none flex-1"
          required={required}
        />
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneInput;
