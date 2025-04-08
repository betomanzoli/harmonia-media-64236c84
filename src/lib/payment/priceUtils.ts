
/**
 * Utility functions for price calculations in payment processing
 */

import { extraServicesData } from '@/data/extraServices';

/**
 * Calculate the total price for selected extras
 * @param selectedExtras Array of selected extra service IDs
 * @returns Total price of all selected extras
 */
export const calculateExtrasTotal = (selectedExtras: string[] = []): number => {
  return selectedExtras.reduce((total, extraId) => {
    const extra = extraServicesData.find(e => e.id === extraId);
    if (extra && typeof extra.price === 'number') {
      return total + extra.price;
    }
    return total;
  }, 0);
};

/**
 * Convert a price string like "R$ 1500,00" to a number 1500
 * @param priceString Price string to parse
 * @returns Parsed price as a number
 */
export const parsePackagePrice = (priceString: string): number => {
  // Remove non-numeric characters except for comma/period
  const numericString = priceString.replace(/[^0-9,\.]/g, '');
  // Replace comma with period for parsing
  const formattedString = numericString.replace(',', '.');
  return parseFloat(formattedString);
};
