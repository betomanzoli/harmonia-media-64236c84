
/**
 * Utility functions for creating order data
 */

import { PackageId } from './packageData';
import { getExpectedDeliveryDate } from './dateUtils';
import { PaymentData } from '@/hooks/payment/types';

/**
 * Create order tracking data based on payment information
 * @param paymentData Payment data object
 * @param clientName Client name
 * @param method Payment method
 * @returns Order tracking data object
 */
export const createOrderData = (
  paymentData: PaymentData,
  clientName: string,
  method: string,
  packageId: PackageId
) => {
  return {
    orderId: paymentData.orderId,
    clientName: clientName || 'Cliente',
    packageType: packageId,
    status: 'Em Análise',
    currentStep: 1,
    orderDate: new Date().toLocaleDateString('pt-BR'),
    expectedDelivery: getExpectedDeliveryDate(packageId, method),
    previewLink: null,
    progress: [
      {
        step: 1,
        title: "Pagamento Confirmado",
        description: method === 'Pix' 
          ? "Seu pagamento via Pix foi registrado. O projeto será iniciado após a confirmação do pagamento."
          : "Seu pagamento foi confirmado e seu projeto foi iniciado.",
        date: new Date().toLocaleDateString('pt-BR'),
        status: "completed",
        icon: "CreditCard"
      },
      {
        step: 2,
        title: "Análise Inicial",
        description: "Nossa equipe está analisando seu briefing e definindo a abordagem criativa.",
        date: null,
        status: "current",
        icon: "FileText"
      },
      {
        step: 3,
        title: "Composição",
        description: "Nossos compositores estão trabalhando na sua música personalizada.",
        date: null,
        status: "pending",
        icon: "Music"
      },
      {
        step: 4,
        title: "Produção",
        description: "Fase de arranjo e produção musical da sua composição.",
        date: null,
        status: "pending",
        icon: "Settings"
      },
      {
        step: 5,
        title: "Apresentação",
        description: "Prévias da sua música estão prontas para sua avaliação.",
        date: null,
        status: "pending",
        icon: "Headphones"
      }
    ]
  };
};
