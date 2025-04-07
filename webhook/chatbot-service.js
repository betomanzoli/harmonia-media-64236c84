
/**
 * Serviço de processamento de mensagens do chatbot harmonIA
 * Este serviço gerencia a comunicação com o Dialogflow e processa as respostas
 */

const handleWelcomeIntent = (req, res) => {
  const response = {
    fulfillmentText: "Olá! Sou o assistente virtual da harmonIA. Como posso ajudar com sua música personalizada hoje?",
    fulfillmentMessages: [
      {
        text: {
          text: ["Olá! Sou o assistente virtual da harmonIA. Como posso ajudar com sua música personalizada hoje?"]
        }
      },
      {
        quickReplies: {
          title: "Escolha uma opção:",
          quickReplies: [
            "Ver pacotes",
            "Ouvir amostras",
            "Iniciar briefing"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handlePackageInfoIntent = (req, res) => {
  const response = {
    fulfillmentText: "Temos 3 pacotes principais: Essencial (R$219), Profissional (R$479) e Premium (R$969). Cada um oferece diferentes níveis de personalização para sua música.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Oferecemos 3 pacotes principais para criação de músicas personalizadas:"]
        }
      },
      {
        card: {
          title: "Pacote Essencial - R$219",
          subtitle: "Ideal para presentes emocionais",
          buttons: [
            {
              text: "Mais detalhes",
              postback: "https://harmonia.media/pacotes"
            }
          ]
        }
      },
      {
        card: {
          title: "Pacote Profissional - R$479",
          subtitle: "Perfeito para criadores de conteúdo",
          buttons: [
            {
              text: "Mais detalhes",
              postback: "https://harmonia.media/pacotes"
            }
          ]
        }
      },
      {
        card: {
          title: "Pacote Premium - R$969",
          subtitle: "Melhor opção para empresas",
          buttons: [
            {
              text: "Mais detalhes",
              postback: "https://harmonia.media/pacotes"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "O que gostaria de saber agora?",
          quickReplies: [
            "Calcular preço",
            "Ver exemplos",
            "Começar briefing"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleCalculatePriceIntent = (req, res) => {
  const response = {
    fulfillmentText: "Para calcular o preço exato para sua necessidade, você pode usar nossa calculadora online ou me contar mais sobre seu projeto.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Para calcular o preço personalizado para sua necessidade específica:"]
        }
      },
      {
        card: {
          title: "Calculadora de Preços",
          subtitle: "Obtenha um orçamento personalizado",
          buttons: [
            {
              text: "Usar Calculadora",
              postback: "https://harmonia.media/calculadora"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Ou conte-me sobre seu projeto:",
          quickReplies: [
            "Para casamento",
            "Para aniversário",
            "Para empresa",
            "Outro evento"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleMusicSamplesIntent = (req, res) => {
  const response = {
    fulfillmentText: "Você pode ouvir exemplos de nossos trabalhos anteriores em nosso portfólio online.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Temos diversos exemplos de músicas que já criamos para outros clientes:"]
        }
      },
      {
        card: {
          title: "Portfólio Musical",
          subtitle: "Ouça nossas criações",
          buttons: [
            {
              text: "Explorar Portfólio",
              postback: "https://harmonia.media/portfolio"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Próximos passos:",
          quickReplies: [
            "Iniciar projeto",
            "Conhecer pacotes",
            "Falar com humano"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleStartBriefingIntent = (req, res) => {
  const response = {
    fulfillmentText: "Ótimo! Vamos começar seu briefing para criar sua música personalizada.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Ótimo! Vamos começar a criar sua música personalizada. Você pode escolher como deseja prosseguir:"]
        }
      },
      {
        card: {
          title: "Formulário de Briefing",
          subtitle: "Método completo e detalhado",
          buttons: [
            {
              text: "Iniciar Briefing",
              postback: "https://harmonia.media/briefing"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Como prefere continuar?",
          quickReplies: [
            "Briefing guiado por chat",
            "Ver exemplos primeiro",
            "Falar com consultor"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleCheckStatusIntent = (req, res) => {
  const response = {
    fulfillmentText: "Para verificar o status do seu pedido, você pode acessar nossa página de acompanhamento.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Para verificar o status atual do seu projeto musical:"]
        }
      },
      {
        card: {
          title: "Acompanhar Pedido",
          subtitle: "Verificar progresso do projeto",
          buttons: [
            {
              text: "Verificar Status",
              postback: "https://harmonia.media/acompanhar-pedido"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Precisa de ajuda?",
          quickReplies: [
            "Perdi meu código",
            "Falar com suporte"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleTalkToAgentIntent = (req, res) => {
  const response = {
    fulfillmentText: "Entendo que você prefere falar com um atendente humano. Vou transferir você para nossa equipe de atendimento.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Sem problema! Vou conectar você com nossa equipe de atendimento humano para melhor assistência."]
        }
      },
      {
        card: {
          title: "Atendimento Personalizado",
          subtitle: "Fale com nossa equipe",
          buttons: [
            {
              text: "WhatsApp",
              postback: "https://wa.me/5511999999999"
            },
            {
              text: "E-mail",
              postback: "mailto:contato@harmonia.media"
            }
          ]
        }
      }
    ]
  };
  
  return response;
};

const handleFallbackIntent = (req, res) => {
  const response = {
    fulfillmentText: "Desculpe, não entendi completamente. Como posso ajudar com sua música personalizada?",
    fulfillmentMessages: [
      {
        text: {
          text: ["Desculpe, não entendi completamente. Posso ajudar você com alguma destas opções:"]
        }
      },
      {
        quickReplies: {
          title: "Como posso ajudar?",
          quickReplies: [
            "Ver pacotes",
            "Ouvir amostras",
            "Iniciar projeto",
            "Falar com atendente"
          ]
        }
      }
    ]
  };
  
  return response;
};

// Exportar todas as funções de manipulação de intents
module.exports = {
  handleWelcomeIntent,
  handlePackageInfoIntent,
  handleCalculatePriceIntent,
  handleMusicSamplesIntent,
  handleStartBriefingIntent,
  handleCheckStatusIntent,
  handleTalkToAgentIntent,
  handleFallbackIntent
};
