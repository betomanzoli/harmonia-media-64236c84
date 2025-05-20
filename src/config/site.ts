
/**
 * Configuração central do site harmonIA
 * Este arquivo centraliza todas as configurações do site para facilitar a gestão
 */

export const siteConfig = {
  name: "harmonIA",
  url: "https://harmonia.media",
  description: "Música feita por humanos + IA perfeita para você.",
  
  // Informações de contato
  contact: {
    email: "contato@harmonia.media",
    phone: "+55 11 92058-5072",
    whatsapp: "5511920585072",
    address: "São Paulo, SP - Brasil",
  },
  
  // Links de redes sociais
  social: {
    instagram: "https://instagram.com/harmonia.media",
    youtube: "https://youtube.com/harmoniamusica",
    facebook: "https://facebook.com/harmonia.media",
  },
  
  // Configurações do chatbot
  chatbot: {
    enabled: true,
    title: "Assistente harmonIA",
    primaryColor: "#00c853",
    responseTime: "Resposta em até 2 minutos",
    dialogflowProjectId: "harmonia-chatbot", // Substituir pelo ID real quando configurado
  },
  
  // URLs do sistema
  urls: {
    briefing: "/briefing",
    calculator: "/calculadora",
    portfolio: "/portfolio",
    packages: "/pacotes",
    orderTracking: "/acompanhar-pedido",
    previews: "/previews",
    admin: {
      audioDatabase: "/admin-j28s7d1k/audio-database",
      portfolio: "/admin-j28s7d1k/portfolio",
      dashboard: "/admin-j28s7d1k/dashboard",
    }
  },
  
  // Configurações de preços
  pricing: {
    basePrice: 997,
    professionalPrice: 1997,
    premiumPrice: 2997,
  }
};
