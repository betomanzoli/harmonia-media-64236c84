
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
          title: "Posso ajudar com:",
          quickReplies: [
            "Informações sobre pacotes",
            "Ver amostras de músicas",
            "Iniciar um briefing",
            "Calcular preço",
            "Falar com atendente"
          ]
        }
      }
    ]
  };
  
  return response;
};

const handlePackageInfoIntent = (req, res) => {
  const response = {
    fulfillmentText: "Oferecemos 3 pacotes principais: Essencial (R$219), Profissional (R$479) e Premium (R$969). Cada um tem características específicas para diferentes necessidades.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Oferecemos 3 pacotes principais:"]
        }
      },
      {
        card: {
          title: "Pacote Essencial - R$219",
          subtitle: "Ideal para presentes emocionais rápidos",
          buttons: [
            {
              text: "Ver detalhes",
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
              text: "Ver detalhes",
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
              text: "Ver detalhes",
              postback: "https://harmonia.media/pacotes"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Deseja:",
          quickReplies: [
            "Calcular preço personalizado",
            "Ver amostras",
            "Iniciar briefing"
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
          text: ["Para calcular o preço exato para sua necessidade, você pode usar nossa calculadora online ou me contar mais sobre seu projeto."]
        }
      },
      {
        card: {
          title: "Calculadora de Preços",
          subtitle: "Calcule o valor para sua música personalizada",
          buttons: [
            {
              text: "Abrir Calculadora",
              postback: "https://harmonia.media/calculadora"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Ou me conte:",
          quickReplies: [
            "É para casamento",
            "É para aniversário",
            "É para empresa",
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
    fulfillmentText: "Você pode ouvir amostras de nossos trabalhos anteriores em nosso portfólio online.",
    fulfillmentMessages: [
      {
        text: {
          text: ["Você pode ouvir amostras de nossos trabalhos anteriores em nosso portfólio online."]
        }
      },
      {
        card: {
          title: "Portfólio de Músicas",
          subtitle: "Ouça exemplos de nossos trabalhos",
          buttons: [
            {
              text: "Ver Portfólio",
              postback: "https://harmonia.media/portfolio"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Gostaria de:",
          quickReplies: [
            "Iniciar briefing",
            "Ver pacotes",
            "Falar com atendente"
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
          text: ["Ótimo! Vamos começar seu briefing para criar sua música personalizada. Você pode preencher nosso formulário online ou, se preferir, posso te guiar por algumas perguntas básicas para entender melhor o que você precisa."]
        }
      },
      {
        card: {
          title: "Formulário de Briefing",
          subtitle: "Preencha online para iniciar seu projeto",
          buttons: [
            {
              text: "Preencher Briefing",
              postback: "https://harmonia.media/briefing"
            }
          ]
        }
      },
      {
        quickReplies: {
          title: "Prefere:",
          quickReplies: [
            "Contar mais sobre meu projeto",
            "Ver exemplos primeiro",
            "Falar com atendente"
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
          text: ["Para verificar o status do seu pedido, você pode acessar nossa página de acompanhamento. Você precisará do seu código de pedido."]
        }
      },
      {
        card: {
          title: "Acompanhar Pedido",
          subtitle: "Verifique o status do seu projeto",
          buttons: [
            {
              text: "Verificar Status",
              postback: "https://harmonia.media/acompanhar-pedido"
            }
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
          text: ["Entendo que você prefere falar com um atendente humano. Vou transferir você para nossa equipe de atendimento via WhatsApp."]
        }
      },
      {
        card: {
          title: "Atendimento Personalizado",
          subtitle: "Fale diretamente com nossa equipe",
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
    fulfillmentText: "Desculpe, não entendi. Pode reformular sua pergunta?",
    fulfillmentMessages: [
      {
        text: {
          text: ["Desculpe, não entendi completamente sua pergunta. Posso ajudar com informações sobre nossos pacotes, amostras de música, processo de briefing ou colocar você em contato com nossa equipe."]
        }
      },
      {
        quickReplies: {
          title: "Posso ajudar com:",
          quickReplies: [
            "Informações sobre pacotes",
            "Ver amostras",
            "Iniciar briefing",
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
