
/**
 * Portfolio and music samples intent handler for the chatbot
 */

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

module.exports = handleMusicSamplesIntent;
