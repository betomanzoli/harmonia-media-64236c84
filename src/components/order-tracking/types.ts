
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
  status: string;
  currentStep: number;
  orderDate: string;
  expectedDelivery: string;
  previewLink: string | null;
  progress: OrderProgressStep[];
  hasPreview?: boolean;
  pendingAction?: 'feedback' | null;
}

export interface OrderSearchProps {
  onSearch: (searchId: string) => void;
}

export interface OrderDetailsProps {
  order: OrderData;
}

// Adicionando OrderNotificationProps
export interface OrderNotificationProps {
  orderId: string;
  hasPreview?: boolean;
  previewLink: string | null;
  pendingAction: 'feedback' | null;
}

// Adicionando OrderNotFoundProps
export interface OrderNotFoundProps {
  onChatAssistant: () => void;
}
