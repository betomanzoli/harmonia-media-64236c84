/**
 * Format a number as currency (BRL by default)
 */
export function formatCurrency(value: number, currency: string = 'BRL', locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
}

/**
 * Format a phone number with country code
 */
export function formatPhoneWithCountryCode(countryCode: string, phoneNumber: string): string {
  // Clean phone number (keep only digits)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Format based on BR standard if it looks like a BR number
  if (countryCode === '+55' && cleanPhone.length === 11) {
    return `${countryCode} (${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
  }
  
  // Generic international format
  return `${countryCode} ${phoneNumber}`;
}

/**
 * Parse a phone number with potential country code
 */
export function parsePhoneNumber(phone: string): { countryCode: string, nationalNumber: string } {
  // Default
  const result = {
    countryCode: '+55',
    nationalNumber: phone
  };
  
  if (!phone) {
    return result;
  }
  
  // Check if the phone starts with + and has at least one digit after
  const countryCodeMatch = phone.match(/^\+(\d+)/);
  if (countryCodeMatch) {
    // Extract potential country code
    const potentialCode = `+${countryCodeMatch[1]}`;
    
    // Find the longest matching country code
    const validCodes = ['+1', '+33', '+34', '+39', '+44', '+49', '+55', '+351'];
    const matchedCode = validCodes.find(code => phone.startsWith(code)) || '+55';
    
    // Remove country code from phone
    result.countryCode = matchedCode;
    result.nationalNumber = phone.substring(matchedCode.length).trim();
  }
  
  return result;
}
