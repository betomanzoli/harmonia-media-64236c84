
import { PackageId } from './packageData';

interface PaymentLinkData {
  standard: {
    url: string;
    buttonScript?: string;
    preferenceId?: string;
  };
  discount?: {
    url: string;
    buttonScript?: string;
    preferenceId?: string;
    discountCode: string;
  };
}

export const packagePaymentLinks: Record<PackageId, PaymentLinkData> = {
  essencial: {
    standard: {
      url: 'https://mpago.la/2C16Zhc',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-794a7995-ba7f-4793-9978-caa733834595" data-source="button"></script>',
      preferenceId: '178571987-794a7995-ba7f-4793-9978-caa733834595'
    },
    discount: {
      url: 'https://mpago.la/1cimFu6',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-730b5086-1925-40d1-bfae-cadf4e63c103" data-source="button"></script>',
      preferenceId: '178571987-730b5086-1925-40d1-bfae-cadf4e63c103',
      discountCode: 'ESSENCIAL5'
    }
  },
  profissional: {
    standard: {
      url: 'https://mpago.la/1fejmqL',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-96a4636b-47a4-4c91-945e-7a3ed50aeef1" data-source="button"></script>',
      preferenceId: '178571987-96a4636b-47a4-4c91-945e-7a3ed50aeef1'
    },
    discount: {
      url: 'https://mpago.la/2E1tYaj',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-a0908e11-42e9-473e-9410-5d692e13cfde" data-source="button"></script>',
      preferenceId: '178571987-a0908e11-42e9-473e-9410-5d692e13cfde',
      discountCode: 'PROFISSIONAL5'
    }
  },
  premium: {
    standard: {
      url: 'https://mpago.li/1fDXjQp',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-602f450a-1666-436f-8673-c18d83c5e494" data-source="button"></script>',
      preferenceId: '178571987-602f450a-1666-436f-8673-c18d83c5e494'
    },
    discount: {
      url: 'https://mpago.li/28opNmP',
      buttonScript: '<script src="https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js" data-preference-id="178571987-e0b910a3-15cf-4f19-b7ce-c55bc188d505" data-source="button"></script>',
      preferenceId: '178571987-e0b910a3-15cf-4f19-b7ce-c55bc188d505',
      discountCode: 'PREMIUM5'
    }
  }
};

// Add the extraServicePaymentLinks export using data from extraServices
export const extraServicePaymentLinks: Record<string, {url: string}> = {
  "recording": { url: 'https://mpago.la/1Fyqdcw' },
  "mastering": { url: 'https://mpago.la/21iE6Zp' },
  "express": { url: 'https://mpago.la/113Dotr' },
  "video": { url: 'https://mpago.la/2bJ7gs5' },
  "copyright": { url: 'https://mpago.la/23WDA5a' },
  "musicsheet": { url: 'https://mpago.la/2grZyHu' },
  "mvp": { url: 'https://mpago.li/1gjwJZY' },
  "Revisão Extra": { url: 'https://mpago.la/1Fyqdcw' },
  "Registro na BN (Letra)": { url: 'https://mpago.la/23WDA5a' },
  "Registro UBC": { url: 'https://mpago.la/2E1tYaj' },
  "Masterização Premium": { url: 'https://mpago.la/21iE6Zp' },
  "Stems Separados": { url: 'https://mpago.la/1cimFu6' },
  "Entrega Expressa": { url: 'https://mpago.la/113Dotr' },
  "Partituras MusicXML/PDF": { url: 'https://mpago.la/2grZyHu' },
  "Composição sem IA (letra)": { url: 'https://mpago.la/2bJ7gs5' },
  "Composição sem IA (letra + melodia)": { url: 'https://mpago.la/1fejmqL' },
  "Composição sem IA (letra + melodia + gravação)": { url: 'https://mpago.li/1gjwJZY' }
};
