
/**
 * Servidor webhook para o chatbot harmonIA
 * Este servidor processa as requisições do Dialogflow e retorna respostas estruturadas
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatbotService = require('./chatbot-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint principal para Dialogflow
app.post('/dialogflow', (req, res) => {
  console.log('Webhook recebido:', JSON.stringify(req.body));
  
  try {
    const intentName = req.body.queryResult.intent.displayName;
    let response;
    
    // Roteamento baseado na intent
    switch (intentName) {
      case 'Default Welcome Intent':
        response = chatbotService.handleWelcomeIntent(req, res);
        break;
      case 'Informações sobre Pacotes':
        response = chatbotService.handlePackageInfoIntent(req, res);
        break;
      case 'Calcular Preço':
        response = chatbotService.handleCalculatePriceIntent(req, res);
        break;
      case 'Amostras de Músicas':
        response = chatbotService.handleMusicSamplesIntent(req, res);
        break;
      case 'Iniciar Briefing':
        response = chatbotService.handleStartBriefingIntent(req, res);
        break;
      case 'Verificar Status':
        response = chatbotService.handleCheckStatusIntent(req, res);
        break;
      case 'Falar com Atendente':
        response = chatbotService.handleTalkToAgentIntent(req, res);
        break;
      case 'Default Fallback Intent':
        response = chatbotService.handleFallbackIntent(req, res);
        break;
      default:
        response = chatbotService.handleFallbackIntent(req, res);
    }
    
    console.log('Resposta enviada:', JSON.stringify(response));
    res.json(response);
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({
      fulfillmentText: 'Desculpe, ocorreu um erro ao processar sua solicitação.'
    });
  }
});

// Rota para teste de status do servidor
app.get('/', (req, res) => {
  res.send('Webhook do Chatbot harmonIA está funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor webhook rodando na porta ${PORT}`);
});
