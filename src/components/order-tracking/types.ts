
import { ReactNode } from 'react';

export interface OrderProgress {
  step: number;
  status: 'completed' | 'current' | 'pending';
  title: string;
  description: string;
  icon: ReactNode;
  date?: string;
}

export interface OrderData {
  orderId: string;
  clientName: string;
  packageType: string;
  orderDate: string;
  currentStep: number;
  status: string;
  expectedDelivery: string;
  previewLink?: string;
  progress: OrderProgress[];
}

export interface OrderSearchProps {
  onSearch: (orderData: OrderData) => void;
}
