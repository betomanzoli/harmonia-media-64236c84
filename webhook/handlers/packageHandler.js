
/**
 * Package information intent handler for the chatbot
 */

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

module.exports = {
  handlePackageInfoIntent,
  handleCalculatePriceIntent
};
