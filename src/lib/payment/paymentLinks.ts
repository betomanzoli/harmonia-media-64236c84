
import { PackageId } from './packageData';

interface PaymentLinkData {
  standard: {
    url: string;
    buttonScript?: string;
  };
  discount?: {
    url: string;
    buttonScript?: string;
    discountCode: string;
  };
}

export const packagePaymentLinks: Record<PackageId, PaymentLinkData> = {
  essencial: {
    standard: {
      url: 'https://mpago.la/2C16Zhc',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-794a7995-ba7f-4793-9978-caa733834595" data-source="button"></script>'
    },
    discount: {
      url: 'https://mpago.la/1cimFu6',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-730b5086-1925-40d1-bfae-cadf4e63c103" data-source="button"></script>',
      discountCode: 'ESSENCIAL5'
    }
  },
  profissional: {
    standard: {
      url: 'https://mpago.la/1fejmqL',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-96a4636b-47a4-4c91-945e-7a3ed50aeef1" data-source="button"></script>'
    },
    discount: {
      url: 'https://mpago.la/2E1tYaj',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-a0908e11-42e9-473e-9410-5d692e13cfde" data-source="button"></script>',
      discountCode: 'PROFISSIONAL5'
    }
  },
  premium: {
    standard: {
      url: 'https://mpago.li/1fDXjQp',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-602f450a-1666-436f-8673-c18d83c5e494" data-source="button"></script>'
    },
    discount: {
      url: 'https://mpago.li/28opNmP',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-e0b910a3-15cf-4f19-b7ce-c55bc188d505" data-source="button"></script>',
      discountCode: 'PREMIUM5'
    }
  }
};
