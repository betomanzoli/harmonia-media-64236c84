
import { useState } from 'react';
import { PhoneWithCountryCode } from '@/components/PhoneInput';

interface UsePhoneInputOptions {
  initialValue?: PhoneWithCountryCode;
}

const defaultPhoneValue: PhoneWithCountryCode = {
  fullNumber: '',
  countryCode: '55', // Brazil
  nationalNumber: ''
};

export const usePhoneInput = (options: UsePhoneInputOptions = {}) => {
  const [phone, setPhone] = useState<PhoneWithCountryCode>(
    options.initialValue || defaultPhoneValue
  );
  
  const resetPhone = () => {
    setPhone(defaultPhoneValue);
  };
  
  const isValidPhone = (minLength: number = 10): boolean => {
    return phone.nationalNumber.length >= minLength;
  };
  
  const getWhatsAppLink = (): string => {
    if (!phone.fullNumber) return '';
    return `https://wa.me/${phone.fullNumber.replace('+', '')}`;
  };

  return {
    phone,
    setPhone,
    resetPhone,
    isValidPhone,
    getWhatsAppLink
  };
};

export default usePhoneInput;
