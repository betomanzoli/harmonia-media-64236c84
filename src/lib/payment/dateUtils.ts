
/**
 * Utility functions for date calculations in payment processing
 */

import { PackageId } from './packageData';

/**
 * Calculate expected delivery date based on package type and payment method
 * @param packageId The selected package ID
 * @param paymentMethod The payment method used
 * @returns Formatted delivery date string
 */
export const getExpectedDeliveryDate = (packageId: PackageId, paymentMethod: string): string => {
  const today = new Date();
  let businessDays = 0;
  
  // Define base deadline in business days according to the package
  switch (packageId) {
    case 'premium':
      businessDays = 3;
      break;
    case 'profissional':
      businessDays = 5;
      break;
    case 'essencial':
    default:
      businessDays = 7;
      break;
  }
  
  // Add extra days for Pix (less than bank slip, but still has a small delay)
  if (paymentMethod === 'Pix') {
    businessDays += 1; // Add 1 business day for Pix compensation
  }
  
  // Calculate delivery date (skipping weekends)
  let deliveryDate = new Date(today);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  // Return formatted date
  return deliveryDate.toLocaleDateString('pt-BR');
};
