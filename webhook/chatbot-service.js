
/**
 * Serviço de processamento de mensagens do chatbot harmonIA
 * Este serviço gerencia a comunicação com o Dialogflow e processa as respostas
 */

const {
  handleWelcomeIntent,
  handlePackageInfoIntent,
  handleCalculatePriceIntent,
  handleMusicSamplesIntent,
  handleStartBriefingIntent,
  handleCheckStatusIntent,
  handleTalkToAgentIntent,
  handleFallbackIntent
} = require('./handlers');

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
