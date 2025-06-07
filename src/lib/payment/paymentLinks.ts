

/**
 * Payment links for different packages and discount codes
 */

interface PaymentLinkData {
  url: string;
  preferenceId: string;
}

export interface PackagePaymentLinks {
  standard: PaymentLinkData;
  discount?: PaymentLinkData;
  discountCode?: string;
}

// Main packages payment links
export const packagePaymentLinks: Record<string, PackagePaymentLinks> = {
  'express': {
    standard: {
      url: 'https://mpago.la/23WDA5a',
      preferenceId: '178571987-5ed445de-ebe1-47d0-aaa8-1bb544bc5c88'
    }
  },
  'essencial': {
    standard: {
      url: 'https://mpago.la/2C16Zhc',
      preferenceId: '178571987-794a7995-ba7f-4793-9978-caa733834595'
    },
    discount: {
      url: 'https://mpago.la/1cimFu6',
      preferenceId: '178571987-730b5086-1925-40d1-bfae-cadf4e63c103'
    },
    discountCode: 'ESSENCIAL5'
  },
  'profissional': {
    standard: {
      url: 'https://mpago.la/1fejmqL',
      preferenceId: '178571987-96a4636b-47a4-4c91-945e-7a3ed50aeef1'
    },
    discount: {
      url: 'https://mpago.la/2E1tYaj',
      preferenceId: '178571987-a0908e11-42e9-473e-9410-5d692e13cfde'
    },
    discountCode: 'PROFISSIONAL5'
  },
  'premium': {
    standard: {
      url: 'https://mpago.li/1fDXjQp',
      preferenceId: '178571987-602f450a-1666-436f-8673-c18d83c5e494'
    },
    discount: {
      url: 'https://mpago.li/28opNmP',
      preferenceId: '178571987-e0b910a3-15cf-4f19-b7ce-c55bc188d505'
    },
    discountCode: 'PREMIUM5'
  }
};

// Extra services payment links (for future implementation)
export const extraServicePaymentLinks: Record<string, PaymentLinkData> = {
  // New Multiestilo services (updated prices and links)
  'Multiestilo': {
    url: 'https://mpago.la/2U3Nji4',
    preferenceId: '178571987-30d650b9-f635-4bd5-a0f6-faf4d16c9fff'
  },
  'Multiestilo+': {
    url: 'https://mpago.la/23WDA5a',
    preferenceId: '178571987-5ed445de-ebe1-47d0-aaa8-1bb544bc5c88'
  },
  
  // Updated Revisão Extra service
  'Revisão Extra': {
    url: 'https://mpago.la/2U3Nji4',
    preferenceId: '178571987-30d650b9-f635-4bd5-a0f6-faf4d16c9fff'
  },
  
  'Registro na BN (Letra)': {
    url: 'https://mpago.la/113Dotr',
    preferenceId: '178571987-266f5eb5-3e03-4083-82d9-690fbb1b2951'
  },
  'Registro UBC': {
    url: 'https://mpago.la/1Fyqdcw',
    preferenceId: '178571987-2bd0e019-e98c-42a6-a7fb-e8858fe13f78'
  },
  'Masterização IA': {
    url: 'https://mpago.la/21iE6Zp',
    preferenceId: '178571987-2be0a4e2-5c8e-4e64-b554-d4068d18d23a'
  },
  'Stems Separados': {
    url: 'https://mpago.la/21iE6Zp',
    preferenceId: '178571987-2be0a4e2-5c8e-4e64-b554-d4068d18d23a'
  },
  'Entrega Expressa': {
    url: 'https://mpago.la/2bJ7gs5',
    preferenceId: '178571987-a6e460f7-4f43-4010-b1ec-fe7789090467'
  },
  'Partituras MusicXML/PDF': {
    url: 'https://mpago.la/21iE6Zp',
    preferenceId: '178571987-2be0a4e2-5c8e-4e64-b554-d4068d18d23a'
  },
  'Composição sem IA (letra)': {
    url: 'https://mpago.la/2grZyHu',
    preferenceId: '178571987-d2c262a6-0251-40cb-99ed-37415eb90c1d'
  },
  'Composição sem IA (letra + melodia)': {
    url: 'https://mpago.li/1gjwJZY',
    preferenceId: '178571987-1b5c6c1a-2c8b-4c9a-b67c-07519f43382f'
  },
  'Composição sem IA (letra + melodia + gravação)': {
    url: 'https://wa.me/5511920585072?text=Olá,%20tenho%20interesse%20no%20serviço%20de%20Composição%20sem%20IA%20completa%20(letra%20+%20melodia%20+%20gravação).%20Poderia%20me%20dar%20mais%20informações?',
    preferenceId: 'whatsapp-contact'
  },
  
  // Legacy service IDs (keep unchanged for compatibility)
  'service79': {
    url: 'https://mpago.la/2U3Nji4',
    preferenceId: '178571987-30d650b9-f635-4bd5-a0f6-faf4d16c9fff'
  },
  'service99': {
    url: 'https://mpago.la/113Dotr',
    preferenceId: '178571987-266f5eb5-3e03-4083-82d9-690fbb1b2951'
  },
  'service249': {
    url: 'https://mpago.la/1Fyqdcw',
    preferenceId: '178571987-2bd0e019-e98c-42a6-a7fb-e8858fe13f78'
  },
  'service149': {
    url: 'https://mpago.la/2bJ7gs5',
    preferenceId: '178571987-a6e460f7-4f43-4010-b1ec-fe7789090467'
  },
  'service129': {
    url: 'https://mpago.la/21iE6Zp',
    preferenceId: '178571987-2be0a4e2-5c8e-4e64-b554-d4068d18d23a'
  },
  'service499': {
    url: 'https://mpago.la/2grZyHu',
    preferenceId: '178571987-d2c262a6-0251-40cb-99ed-37415eb90c1d'
  },
  'service1499': {
    url: 'https://mpago.li/1gjwJZY',
    preferenceId: '178571987-1b5c6c1a-2c8b-4c9a-b67c-07519f43382f'
  }
};
