
export type OrderProgressStatus = 'pending' | 'current' | 'completed';

export interface OrderProgressStep {
  step: number;
  status: OrderProgressStatus;
  title: string;
  description: string;
  icon: string;
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
  progress: OrderProgressStep[];
}

export interface OrderSearchProps {
  onOrderFound: (order: OrderData) => void;
}
