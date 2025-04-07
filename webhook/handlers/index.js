
/**
 * Index file exporting all chatbot intent handlers
 */

const handleWelcomeIntent = require('./welcomeHandler');
const { handlePackageInfoIntent, handleCalculatePriceIntent } = require('./packageHandler');
const handleMusicSamplesIntent = require('./portfolioHandler');
const handleStartBriefingIntent = require('./briefingHandler');
const handleCheckStatusIntent = require('./statusHandler');
const handleTalkToAgentIntent = require('./supportHandler');
const handleFallbackIntent = require('./fallbackHandler');

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
