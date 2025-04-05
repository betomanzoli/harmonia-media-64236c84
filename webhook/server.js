
// Servidor webhook para o chatbot harmonIA
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuração do servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Dados simulados para desenvolvimento
const audioSamples = [
  {
    id: "001",
    title: "Música Romântica",
    style: "MPB",
    mood: "Romântico",
    occasion: "Casamento",
    audio_url: "https://example.com/audio/musica-romantica.mp3"
  },
  {
    id: "002",
    title: "Celebração Familiar",
    style: "Pop",
    mood: "Alegria",
    occasion: "Aniversário",
    audio_url: "https://example.com/audio/celebracao-familiar.mp3"
  }
];

// Rota para servir o widget do chatbot
app.get('/widget.js', (req, res) => {
  res.sendFile(__dirname + '/public/widget/chatbot.js');
});

// Endpoint principal para o webhook do Dialogflow
app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult?.intent?.displayName;
  const parameters = req.body.queryResult?.parameters;
  
  let response = {};
  
  // Processar diferentes intents
  switch(intentName) {
    case 'Default Welcome Intent':
      response = getWelcomeResponse();
      break;
      
    case 'Informações sobre Pacotes':
      response = getPackagesInfo();
      break;
      
    case 'Amostras de Músicas':
      response = getMusicSamples(parameters?.style);
      break;
      
    case 'Calcular Preço':
      response = calculatePrice(parameters);
      break;
      
    case 'Iniciar Briefing':
      response = startBriefing(parameters);
      break;
      
    case 'Verificar Status':
      response = checkStatus(parameters);
      break;
      
    case 'Falar com Atendente':
      response = transferToHuman();
      break;
      
    default:
      response = getFallbackResponse();
  }
  
  res.json(response);
});

// Função para mensagem de boas-vindas
function getWelcomeResponse() {
  return {
    fulfillmentText: "👋 Olá! Sou o assistente virtual da harmonIA. Posso ajudar você a conhecer nossos serviços, enviar amostras, calcular preços ou iniciar seu briefing musical. Como posso te ajudar hoje?",
    fulfillmentMessages: [
      {
        text: {
          text: [
            "👋 Olá! Sou o assistente virtual da harmonIA. Posso ajudar você a conhecer nossos serviços, enviar amostras, calcular preços ou iniciar seu briefing musical. Como posso te ajudar hoje?"
          ]
        }
      },
      {
        quickReplies: {
          title: "Como posso te ajudar hoje?",
          quickReplies: [
            "Conhecer pacotes",
            "Ouvir amostras",
            "Calcular preço",
            "Iniciar briefing"
          ]
        }
      }
    ]
  };
}

// Função para informações sobre pacotes
function getPackagesInfo() {
  return {
    fulfillmentText: "Temos 3 pacotes principais: Essencial (R$219), Profissional (R$479), e Premium (R$969). Cada um oferece diferentes níveis de serviço.",
    fulfillmentMessages: [
      {
        text: {
          text: [
            `Temos 3 pacotes principais:

🎵 Pacote Essencial (R$219)
• 1 composição musical com IA + revisão humana
• 1 revisão gratuita
• Entrega em até 48h
• Ideal para: presentes emocionais

🎵 Pacote Profissional (R$479)
• 3 variações em estilos diferentes
• Masterização básica IA
• Stems separados
• 3 revisões gratuitas
• Entrega em até 72h
• Ideal para: criadores de conteúdo

🎵 Pacote Premium (R$969)
• 5 variações de composição
• Masterização profissional
• Registro na Biblioteca Nacional
• Partitura em formato MusicXML
• Revisões ilimitadas (30 dias)
• Ideal para: empresas e projetos corporativos`
          ]
        }
      },
      {
        quickReplies: {
          title: "Gostaria de saber mais detalhes sobre algum pacote específico?",
          quickReplies: [
            "Detalhes Essencial",
            "Detalhes Profissional",
            "Detalhes Premium"
          ]
        }
      }
    ]
  };
}

// Função para amostras de músicas
function getMusicSamples(style) {
  if (!style) {
    return {
      fulfillmentText: "Que tipo de música você gostaria de ouvir?",
      fulfillmentMessages: [
        {
          text: {
            text: [
              "Claro! Temos várias amostras de projetos anteriores. Que tipo de música você gostaria de ouvir?"
            ]
          }
        },
        {
          quickReplies: {
            title: "Que tipo de música você gostaria de ouvir?",
            quickReplies: [
              "Pop/Acústico",
              "Eletrônico/Corporativo",
              "Orquestral/Coral",
              "Clássico/Romântico"
            ]
          }
        }
      ]
    };
  }
  
  // Lógica para retornar amostra específica
  return {
    fulfillmentText: `Aqui está uma amostra de ${style}. O que achou?`,
    fulfillmentMessages: [
      {
        text: {
          text: [
            `Ótima escolha! Aqui está uma amostra de ${style}:

[Este seria um link para uma amostra real]

O que achou? Gostaria de ouvir outro estilo?`
          ]
        }
      },
      {
        quickReplies: {
          title: "O que gostaria de fazer agora?",
          quickReplies: [
            "Ouvir outro estilo",
            "Calcular preço",
            "Iniciar briefing"
          ]
        }
      }
    ]
  };
}

// Função para cálculo de preço
function calculatePrice(parameters) {
  const package = parameters?.package;
  const extras = parameters?.extras || [];
  
  if (!package) {
    return {
      fulfillmentText: "Vamos calcular o preço do seu projeto musical!",
      fulfillmentMessages: [
        {
          text: {
            text: [
              "Vamos calcular o preço do seu projeto musical!\n\nPrimeiro, qual pacote básico você tem interesse?"
            ]
          }
        },
        {
          quickReplies: {
            title: "Qual pacote básico você tem interesse?",
            quickReplies: [
              "Pacote Essencial - R$219",
              "Pacote Profissional - R$479",
              "Pacote Premium - R$969"
            ]
          }
        }
      ]
    };
  }
  
  // Lógica para cálculo de preço com pacote e extras
  let basePrice = 0;
  switch(package) {
    case "Essencial":
      basePrice = 219;
      break;
    case "Profissional":
      basePrice = 479;
      break;
    case "Premium":
      basePrice = 969;
      break;
  }
  
  // Calcular extras
  let extrasTotal = 0;
  let extrasList = "";
  
  extras.forEach(extra => {
    let extraPrice = 0;
    switch(extra) {
      case "Revisão Extra":
        extraPrice = 99;
        break;
      case "Registro BN":
        extraPrice = 99;
        break;
      case "Registro UBC":
        extraPrice = 299;
        break;
      case "Masterização Premium":
        extraPrice = 149;
        break;
      case "Stems":
        extraPrice = 99;
        break;
      case "Entrega Expressa":
        extraPrice = 199;
        break;
      case "Partituras":
        extraPrice = 149;
        break;
    }
    
    extrasTotal += extraPrice;
    extrasList += `• ${extra} - R$${extraPrice}\n`;
  });
  
  const total = basePrice + extrasTotal;
  
  return {
    fulfillmentText: `Resumo do seu projeto: Pacote ${package} (R$${basePrice}) + Extras (R$${extrasTotal}) = Total R$${total}`,
    fulfillmentMessages: [
      {
        text: {
          text: [
            `Resumo do seu projeto:
• Pacote ${package} - R$${basePrice}
${extrasList.length > 0 ? extrasList : "• Sem extras adicionados\n"}
Total: R$${total}

Gostaria de prosseguir para o briefing ou tem mais alguma dúvida?`
          ]
        }
      },
      {
        quickReplies: {
          title: "O que gostaria de fazer agora?",
          quickReplies: [
            "Iniciar briefing",
            "Ouvir amostras",
            "Falar com atendente"
          ]
        }
      }
    ]
  };
}

// Função para iniciar briefing
function startBriefing(parameters) {
  // Verificar em qual etapa do briefing o usuário está
  const step = parameters?.briefing_step || "start";
  
  switch(step) {
    case "start":
      return {
        fulfillmentText: "Qual é o seu nome completo?",
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Ótimo! Vou te guiar pelo processo de briefing.\n\nPara começar, precisarei de algumas informações básicas:\n\nQual é o seu nome completo?"
              ]
            }
          }
        ]
      };
      
    case "name":
      return {
        fulfillmentText: "Qual é o melhor e-mail para contato?",
        fulfillmentMessages: [
          {
            text: {
              text: [
                `Obrigado, ${parameters?.name || ""}! \n\nQual é o melhor e-mail para contato?`
              ]
            }
          }
        ]
      };
      
    // Adicionar mais etapas do briefing conforme necessário
      
    default:
      return {
        fulfillmentText: "Vamos iniciar seu briefing.",
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Ótimo! Vou te guiar pelo processo de briefing.\n\nPara começar, precisarei de algumas informações básicas:\n\nQual é o seu nome completo?"
              ]
            }
          }
        ]
      };
  }
}

// Função para verificar status
function checkStatus(parameters) {
  const email = parameters?.email;
  const orderId = parameters?.order_id;
  
  if (!email && !orderId) {
    return {
      fulfillmentText: "Para verificar o status do seu projeto, preciso do seu e-mail ou número do pedido.",
      fulfillmentMessages: [
        {
          text: {
            text: [
              "Para verificar o status do seu projeto, preciso do seu e-mail ou número do pedido. Qual você prefere informar?"
            ]
          }
        },
        {
          quickReplies: {
            title: "Como deseja verificar?",
            quickReplies: [
              "Verificar por e-mail",
              "Verificar por número de pedido"
            ]
          }
        }
      ]
    };
  }
  
  // Simulação de resposta - em produção, consultar banco de dados
  return {
    fulfillmentText: "Seu projeto está na fase de composição e tem previsão de entrega para 15/04/2025.",
    fulfillmentMessages: [
      {
        text: {
          text: [
            `Encontrei seu projeto!

📊 Status atual: Em fase de composição
📅 Data de início: 10/04/2025
🎵 Pacote: Profissional
⏱️ Previsão de entrega: 15/04/2025
✅ Próximas etapas: Composição > Revisão > Masterização > Entrega

Gostaria de receber notificações sobre atualizações deste projeto?`
          ]
        }
      },
      {
        quickReplies: {
          title: "Gostaria de receber notificações?",
          quickReplies: [
            "Sim, ativar notificações",
            "Não, obrigado"
          ]
        }
      }
    ]
  };
}

// Função para transferir para atendimento humano
function transferToHuman() {
  return {
    fulfillmentText: "Entendo que você prefere falar com um atendente. Como prefere ser contatado?",
    fulfillmentMessages: [
      {
        text: {
          text: [
            "Entendo que você prefere falar diretamente com um atendente.\n\nNosso horário de atendimento é de segunda a sexta, das 9h às 18h.\n\nGostaria de:"
          ]
        }
      },
      {
        quickReplies: {
          title: "Como prefere ser contatado?",
          quickReplies: [
            "Contato via WhatsApp",
            "Contato via Email",
            "Continuar conversando"
          ]
        }
      }
    ]
  };
}

// Função para respostas de fallback
function getFallbackResponse() {
  return {
    fulfillmentText: "Desculpe, não consegui entender. Como posso ajudar?",
    fulfillmentMessages: [
      {
        text: {
          text: [
            "Desculpe, não consegui entender completamente sua pergunta. Poderia reformular ou escolher uma das opções abaixo?"
          ]
        }
      },
      {
        quickReplies: {
          title: "Como posso ajudar?",
          quickReplies: [
            "Informações sobre pacotes",
            "Ver amostras de músicas",
            "Calcular preço",
            "Iniciar briefing",
            "Falar com atendente"
          ]
        }
      }
    ]
  };
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor webhook para harmonIA rodando na porta ${PORT}`);
});
