
# Configurações Avançadas

Este documento descreve as configurações avançadas e extensões possíveis para o chatbot harmonIA.

## Personalização Visual

Você pode personalizar extensivamente a aparência do chatbot editando o arquivo `chatbot.js`. A função `injectStyles()` contém todas as definições CSS do widget.

### Temas Personalizados

Para criar temas personalizados:

1. Modifique a função `init` para aceitar um parâmetro de tema:

```javascript
function init(userConfig) {
  // Mescla configurações do usuário com padrões
  config = { ...config, ...userConfig };
  
  // Aplica o tema selecionado
  if (config.theme === 'dark') {
    applyDarkTheme();
  } else if (config.theme === 'custom' && config.customTheme) {
    applyCustomTheme(config.customTheme);
  }
  
  // ... resto do código
}

function applyDarkTheme() {
  // Sobrescreve estilos para tema escuro
}

function applyCustomTheme(customTheme) {
  // Aplica configurações personalizadas de tema
}
```

## Integração com Sistemas Externos

### Integração com CRM

Para integrar o chatbot com sistemas CRM (como HubSpot, Salesforce, etc.):

1. Adicione as funções de integração no arquivo `webhook/chatbot-service.js`:

```javascript
async function registerLeadInCRM(name, email, phone, interest) {
  try {
    const response = await fetch('https://seu-crm.com/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        interest,
        source: 'chatbot'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar lead no CRM:', error);
    return null;
  }
}

// Exporte a função
module.exports.registerLeadInCRM = registerLeadInCRM;
```

2. Chame a função quando necessário nos manipuladores de intent.

### Integração com Plataforma de E-mail

Para enviar notificações por e-mail:

```javascript
async function sendEmailNotification(to, subject, message) {
  // Implementação usando serviço de e-mail como SendGrid, Mailgun, etc.
}
```

### Integração com Sistema de Analytics

```javascript
function logChatbotInteraction(sessionId, intent, query, response) {
  // Lógica para registrar interações em sistema de analytics
}
```

## Funcionalidades Avançadas

### Coleta de Dados de Contato

Para coletar informações de contato do usuário:

1. Crie uma nova intent "Capturar Contato" no Dialogflow
2. Adicione entidades para name, email e phone
3. Implemente o manipulador de intent no webhook:

```javascript
const handleCaptureContactIntent = (req, res) => {
  const parameters = req.body.queryResult.parameters;
  const name = parameters.name;
  const email = parameters.email;
  const phone = parameters.phone;
  
  // Registra o contato no CRM
  registerLeadInCRM(name, email, phone, "chatbot lead");
  
  const response = {
    fulfillmentText: `Obrigado, ${name}! Recebemos seus dados e entraremos em contato em breve.`,
    // ... resto da resposta
  };
  
  return response;
};
```

### Persistência de Sessão

Para manter o contexto da conversa entre sessões:

1. Implemente o armazenamento de sessão no webhook
2. Use banco de dados como Redis ou MongoDB para armazenar os dados de sessão
3. Recupere a sessão anterior com base em cookies ou identificação do usuário

### Análise de Sentimento

Utilize a API de Análise de Sentimento do Google Cloud para identificar o sentimento do usuário:

```javascript
async function analyzeSentiment(text) {
  // Implemente a chamada para a API de Análise de Sentimento
  // E retorne o resultado
}
```

## Escalabilidade

### Cache de Respostas

Para melhorar o desempenho:

```javascript
const responseCache = new Map();

function getCachedResponse(intent, parameters) {
  const cacheKey = `${intent}_${JSON.stringify(parameters)}`;
  return responseCache.get(cacheKey);
}

function setCachedResponse(intent, parameters, response) {
  const cacheKey = `${intent}_${JSON.stringify(parameters)}`;
  responseCache.set(cacheKey, response);
}
```

### Balanceamento de Carga

Se você espera alto volume de tráfego:

1. Configure múltiplas instâncias do webhook
2. Use um balanceador de carga (como NGINX, AWS ELB, etc.)
3. Considere uma arquitetura sem servidor (serverless) para escalar automaticamente
