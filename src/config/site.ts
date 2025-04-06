
/**
 * Configuração central do site tunealchemy-studio
 * Este arquivo centraliza todas as configurações do site para facilitar a gestão
 */

export const siteConfig = {
  name: "harmonIA",
  url: "https://harmonia.media",
  description: "Criação de músicas personalizadas com IA e músicos profissionais",
  
  // Informações de contato
  contact: {
    email: "contato@harmonia.media",
    phone: "+55 11 99999-9999",
    whatsapp: "5511999999999",
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
    admin: {
      audioDatabase: "/admin-j28s7d1k/audio-database",
      portfolio: "/admin-j28s7d1k/portfolio",
    }
  },
  
  // Configurações de preços
  pricing: {
    basePrice: 219,
    professionalPrice: 479,
    premiumPrice: 969,
  }
};

