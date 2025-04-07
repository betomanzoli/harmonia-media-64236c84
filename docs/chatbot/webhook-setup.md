
# Implementação do Webhook para harmonIA

Este guia detalha como implementar, configurar e hospedar o servidor webhook que processará as intents identificadas pelo Dialogflow e retornará respostas estruturadas para o chatbot do harmonIA.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta em um serviço de hospedagem (Heroku, Google Cloud Run, etc.)
- Projeto do Dialogflow configurado e funcionando

## Estrutura de Arquivos Completa

```
webhook/
├── server.js                   # Servidor Express principal
├── chatbot-service.js          # Central de processamento de mensagens
├── handlers/                   # Manipuladores de intent
│   ├── index.js                # Exporta todos os manipuladores
│   ├── welcomeHandler.js       # Manipulador de boas-vindas
│   ├── packageHandler.js       # Manipulador de informações de pacotes
│   ├── statusHandler.js        # Manipulador de status de pedidos
│   ├── portfolioHandler.js     # Manipulador de portfólio/amostras
│   ├── briefingHandler.js      # Manipulador de briefing
│   ├── supportHandler.js       # Manipulador de suporte/atendente
│   └── fallbackHandler.js      # Manipulador de fallback
├── utils/                      # Funções utilitárias
│   ├── responseBuilder.js      # Construtor de respostas
│   ├── dataFetcher.js          # Funções para buscar dados
│   └── logger.js               # Sistema de logging
└── package.json                # Dependências e configurações
```

## Instalação e Configuração Local

1. Clone o repositório ou crie uma nova pasta para o webhook
2. Navegue até a pasta `webhook`
3. Instale as dependências:
   ```bash
   npm init -y
   npm install express body-parser dotenv cors
   ```
4. Crie um arquivo `.env` para variáveis de ambiente:
   ```
   PORT=3000
   DIALOGFLOW_PROJECT_ID=seu-project-id
   SUPABASE_URL=sua-url-supabase
   SUPABASE_KEY=sua-chave-supabase
   ```
5. Implemente o arquivo `server.js` base:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const chatbotService = require('./chatbot-service');

// Configuração de ambiente
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota principal para o webhook do Dialogflow
app.post('/dialogflow', (req, res) => {
  try {
    console.log('Requisição recebida:', JSON.stringify(req.body));
    
    // Extrair a intent do Dialogflow
    const intentName = req.body.queryResult.intent.displayName;
    console.log('Intent identificada:', intentName);
    
    // Processar a intent com o serviço correspondente
    let response;
    
    switch(intentName) {
      case 'Default Welcome Intent':
        response = chatbotService.handleWelcomeIntent(req, res);
        break;
      case 'Informacoes_Pacotes':
        response = chatbotService.handlePackageInfoIntent(req, res);
        break;
      case 'Amostras_Musicas':
        response = chatbotService.handleMusicSamplesIntent(req, res);
        break;
      case 'Calcular_Preco':
        response = chatbotService.handleCalculatePriceIntent(req, res);
        break;
      case 'Iniciar_Briefing':
        response = chatbotService.handleStartBriefingIntent(req, res);
        break;
      case 'Verificar_Status':
        response = chatbotService.handleCheckStatusIntent(req, res);
        break;
      case 'Falar_Com_Atendente':
        response = chatbotService.handleTalkToAgentIntent(req, res);
        break;
      default:
        response = chatbotService.handleFallbackIntent(req, res);
    }
    
    console.log('Resposta enviada:', JSON.stringify(response));
    return res.json(response);
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return res.status(500).json({
      fulfillmentText: 'Desculpe, ocorreu um erro ao processar sua solicitação.'
    });
  }
});

// Rota de saúde para verificação
app.get('/health', (req, res) => {
  res.status(200).send('Webhook funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor webhook rodando na porta ${PORT}`);
});

module.exports = app; // Para testes e funções serverless
```

## Implementação de Manipuladores de Intent

Para cada intent identificada pelo Dialogflow, crie um arquivo manipulador dedicado na pasta `handlers/`. Exemplo para `handlers/packageHandler.js`:

```javascript
/**
 * Manipulador para a intent de informações sobre pacotes
 */
const handlePackageInfoIntent = (req, res) => {
  const parameters = req.body.queryResult.parameters;
  const tipoPacote = parameters.tipo_pacote || '';
  
  let resposta;
  
  if (tipoPacote.includes('básico') || tipoPacote.includes('simples')) {
    resposta = {
      fulfillmentText: 'Nosso Pacote Básico inclui uma composição de até 3 minutos, com até 2 rodadas de revisão, por R$ 1.500,00. É perfeito para projetos simples ou jingles curtos.',
      fulfillmentMessages: [
        {
          text: {
            text: ['Nosso Pacote Básico inclui uma composição de até 3 minutos, com até 2 rodadas de revisão, por R$ 1.500,00. É perfeito para projetos simples ou jingles curtos.']
          }
        },
        {
          payload: {
            richContent: [
              [
                {
                  type: 'button',
                  icon: {
                    type: 'chevron_right',
                    color: '#FF9800'
                  },
                  text: 'Ver todos os pacotes',
                  link: 'https://seu-site.com/pacotes'
                }
              ]
            ]
          }
        }
      ]
    };
  } else if (tipoPacote.includes('premium') || tipoPacote.includes('avançado')) {
    resposta = {
      fulfillmentText: 'Nosso Pacote Premium inclui uma composição de até 5 minutos, arranjos mais complexos, até 4 rodadas de revisão e direitos comerciais completos, por R$ 3.200,00.',
      // Adicione fulfillmentMessages semelhantes ao exemplo acima
    };
  } else {
    // Resposta genérica sobre todos os pacotes
    resposta = {
      fulfillmentText: 'Oferecemos três tipos de pacotes: Básico (R$ 1.500,00), Intermediário (R$ 2.400,00) e Premium (R$ 3.200,00). Cada um tem diferentes características de duração, complexidade e direitos de uso. Posso dar mais detalhes sobre algum pacote específico?',
      // Adicione fulfillmentMessages com rich content mostrando todos os pacotes
    };
  }
  
  return resposta;
};

module.exports = handlePackageInfoIntent;
```

## Opções de Hospedagem

### Heroku

1. Crie uma conta no [Heroku](https://heroku.com)
2. Instale a [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Na pasta `webhook`, inicialize um repositório Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. Crie um arquivo `Procfile` com o conteúdo:
   ```
   web: node server.js
   ```
5. Faça login no Heroku e crie um novo aplicativo:
   ```bash
   heroku login
   heroku create harmonia-chatbot-webhook
   ```
6. Configure as variáveis de ambiente:
   ```bash
   heroku config:set DIALOGFLOW_PROJECT_ID=seu-project-id
   heroku config:set SUPABASE_URL=sua-url-supabase
   heroku config:set SUPABASE_KEY=sua-chave-supabase
   ```
7. Implante o código:
   ```bash
   git push heroku main
   ```
8. O webhook estará disponível em `https://harmonia-chatbot-webhook.herokuapp.com`

### Google Cloud Functions

1. No [Console do GCP](https://console.cloud.google.com), navegue até Cloud Functions
2. Clique em "Criar função"
3. Configure a função:
   - **Nome**: harmoniaWebhook
   - **Tipo de gatilho**: HTTP
   - **Permissões**: Permitir acesso sem autenticação (ou configure autenticação adequada)
   - **Entrypoint**: app (que exporta a app Express)
   - **Ambiente de execução**: Node.js 14 (ou superior)
4. Para o código, você tem duas opções:
   - Selecione "Inline editor" e cole o código de `server.js`
   - Selecione "ZIP upload" e faça upload de um arquivo ZIP com todo o código do webhook
5. Configure variáveis de ambiente:
   - Adicione DIALOGFLOW_PROJECT_ID, SUPABASE_URL e SUPABASE_KEY
6. Clique em "Implantar"
7. Use a URL fornecida como endpoint do webhook no Dialogflow

## Integração com Supabase

Para conectar seu webhook ao Supabase e acessar dados em tempo real, adicione o cliente Supabase:

1. Instale o pacote:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Crie um arquivo `utils/supabaseClient.js`:
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   
   const supabaseUrl = process.env.SUPABASE_URL;
   const supabaseKey = process.env.SUPABASE_KEY;
   
   if (!supabaseUrl || !supabaseKey) {
     console.error('Variáveis de ambiente do Supabase não configuradas!');
   }
   
   const supabase = createClient(supabaseUrl, supabaseKey);
   
   module.exports = supabase;
   ```

3. Utilize o cliente nos manipuladores de intent:
   ```javascript
   const supabase = require('../utils/supabaseClient');
   
   const handleMusicSamplesIntent = async (req, res) => {
     try {
       const { data, error } = await supabase
         .from('portfolio_items')
         .select('*')
         .limit(5);
       
       if (error) throw error;
       
       // Processar dados e construir resposta
       const amostras = data.map(item => `${item.title} - ${item.style}`).join('\n');
       
       return {
         fulfillmentText: `Aqui estão algumas amostras recentes:\n${amostras}\n\nVocê pode ouvir mais exemplos em nosso site.`
       };
     } catch (error) {
       console.error('Erro ao buscar amostras:', error);
       return {
         fulfillmentText: 'Desculpe, não consegui acessar nosso portfólio no momento. Por favor, visite nosso site para ouvir exemplos.'
       };
     }
   };
   ```

## Testes e Validação

### Testes Locais

1. Execute o servidor localmente:
   ```bash
   node server.js
   ```

2. Use o [Postman](https://www.postman.com/) ou [curl](https://curl.se/) para enviar requisições de teste:
   ```bash
   curl -X POST http://localhost:3000/dialogflow \
     -H "Content-Type: application/json" \
     -d '{
       "queryResult": {
         "intent": {
           "displayName": "Default Welcome Intent"
         },
         "parameters": {}
       }
     }'
   ```

### Testes Unitários

1. Instale as dependências de teste:
   ```bash
   npm install --save-dev jest supertest
   ```

2. Crie um arquivo `__tests__/server.test.js`:
   ```javascript
   const request = require('supertest');
   const app = require('../server');
   
   describe('Webhook API', () => {
     test('Responde à rota de saúde', async () => {
       const response = await request(app).get('/health');
       expect(response.statusCode).toBe(200);
     });
     
     test('Processa intent de boas-vindas', async () => {
       const response = await request(app)
         .post('/dialogflow')
         .send({
           queryResult: {
             intent: {
               displayName: 'Default Welcome Intent'
             },
             parameters: {}
           }
         });
       
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveProperty('fulfillmentText');
     });
     
     // Adicione mais testes para outras intents
   });
   ```

3. Adicione script de teste no `package.json`:
   ```json
   "scripts": {
     "start": "node server.js",
     "test": "jest"
   }
   ```

4. Execute os testes:
   ```bash
   npm test
   ```

## Monitoramento e Logging

Para monitorar seu webhook em produção, implemente um sistema de logging robusto:

1. Instale o Winston para logging:
   ```bash
   npm install winston
   ```

2. Crie um arquivo `utils/logger.js`:
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.Console(),
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   
   module.exports = logger;
   ```

3. Use o logger em seu código:
   ```javascript
   const logger = require('./utils/logger');
   
   app.post('/dialogflow', (req, res) => {
     logger.info('Webhook chamado', { intent: req.body.queryResult.intent.displayName });
     // ...
   });
   ```

## Melhores Práticas

1. **Estruture bem seu código**: Organize em módulos e funções específicas para facilitar manutenção.
2. **Implemente tratamento de erros**: Use try/catch em todas as operações assíncronas.
3. **Cache de respostas**: Armazene em cache respostas que não mudam frequentemente.
4. **Limite o tempo de resposta**: O Dialogflow tem um limite de 5 segundos para respostas.
5. **Implemente autenticação**: Proteja seu webhook contra chamadas não autorizadas.
6. **Versione sua API**: Use controle de versão para facilitar atualizações futuras.
7. **Monitore uso e desempenho**: Implemente métricas para monitorar o uso e o tempo de resposta.

## Recursos Adicionais

- [Documentação do Dialogflow](https://cloud.google.com/dialogflow/docs)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Supabase](https://supabase.io/docs/)
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Funções do Google Cloud](https://cloud.google.com/functions/docs/writing)

Com este guia detalhado, você deve ser capaz de implementar, testar e implantar um servidor webhook robusto para seu chatbot harmonIA integrado ao Dialogflow.
