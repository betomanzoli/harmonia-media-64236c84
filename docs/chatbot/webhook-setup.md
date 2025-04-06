
# Implementação do Webhook

O webhook é um servidor Node.js que processa as intents identificadas pelo Dialogflow e retorna respostas estruturadas.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta em um serviço de hospedagem (Heroku, Google Cloud Run, etc.)

## Estrutura de Arquivos

```
webhook/
├── server.js          # Servidor Express principal
├── chatbot-service.js # Serviço de processamento de mensagens
└── package.json       # Dependências e configurações
```

## Instalação e Execução Local

1. Navegue até a pasta `webhook`
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o servidor localmente:
   ```
   npm start
   ```
4. O servidor estará disponível em `http://localhost:3000`

## Implementação no Heroku

### Pré-requisitos
- Conta no [Heroku](https://heroku.com)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado

### Passos para Deploy
1. Faça login via terminal:
   ```
   heroku login
   ```
2. Na pasta `webhook`, inicialize um repositório Git:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Crie um aplicativo Heroku:
   ```
   heroku create tunealchemy-chatbot
   ```
4. Implante o código:
   ```
   git push heroku main
   ```
5. O servidor webhook estará disponível em `https://tunealchemy-chatbot.herokuapp.com`

## Implementação no Google Cloud Functions

1. No console do GCP, vá para Cloud Functions
2. Clique em "Criar função"
3. Configure a função:
   - Nome: harmonIAWebhook
   - Tipo de acionador: HTTP
   - Permissões: Permitir acesso sem autenticação
4. Para o código, selecione Node.js 14 ou superior
5. Carregue os arquivos do diretório webhook (server.js, chatbot-service.js, package.json)
6. Defina o ponto de entrada como "app" (que exporta a app Express)
7. Clique em "Implantar"
8. Use a URL fornecida como seu endpoint de webhook no Dialogflow

## Extensão do Webhook

Para adicionar novas funcionalidades ao webhook:

1. Crie uma nova função de manipulação no arquivo `chatbot-service.js`:

```javascript
const handleNewIntent = (req, res) => {
  // Lógica para processar a nova intent
  const response = {
    fulfillmentText: "Resposta para a nova intent",
    fulfillmentMessages: [
      {
        text: {
          text: ["Resposta para a nova intent"]
        }
      }
    ]
  };
  
  return response;
};

// Exporte a função
module.exports.handleNewIntent = handleNewIntent;
```

2. Adicione a nova intent ao roteamento no arquivo `server.js`:

```javascript
case 'Nova Intent':
  response = chatbotService.handleNewIntent(req, res);
  break;
```

## Variáveis de Ambiente

Para maior segurança, use variáveis de ambiente para armazenar informações sensíveis:

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione suas variáveis:
   ```
   DIALOGFLOW_PROJECT_ID=seu-project-id
   DIALOGFLOW_API_KEY=sua-api-key
   ```
3. Instale o pacote dotenv: `npm install dotenv`
4. No topo do arquivo server.js, adicione: `require('dotenv').config()`
5. No Heroku, defina as variáveis de ambiente pelo Dashboard ou via CLI:
   ```
   heroku config:set DIALOGFLOW_PROJECT_ID=seu-project-id
   ```
