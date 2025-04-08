
/**
 * Type definitions for payment handling
 */

export interface PaymentData {
  method: string;
  packageId: string;
  packageName: string;
  price: string;
  extras: string[];
  extrasTotal: number;
  total: string;
  date: string;
  orderId: string;
}
