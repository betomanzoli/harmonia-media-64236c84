
# Guia de Implementação do Chatbot harmonIA

Este guia fornece instruções passo a passo para implementar e configurar o chatbot harmonIA para o site tunealchemy-studio.

## Estrutura de Arquivos

```
/
├── public/
│   └── widget/
│       └── chatbot.js     # Script do widget frontend
├── webhook/
│   ├── server.js          # Servidor Node.js para webhook do Dialogflow
│   └── chatbot-service.js # Serviço de processamento de mensagens do chatbot
└── CHATBOT_README.md      # Esta documentação
```

## 1. Configuração do Dialogflow (Google Cloud)

### Pré-requisitos

- Uma conta no Google Cloud Platform
- Projeto criado no GCP
- API do Dialogflow ES habilitada

### Passo a Passo para Configuração

1. Acesse o [Console do Dialogflow](https://dialogflow.cloud.google.com/)
2. Crie um novo agente chamado "harmonIA"
3. Configure o idioma principal como "Português (Brasil)"
4. Crie as seguintes intents:
   - Default Welcome Intent
   - Informações sobre Pacotes
   - Amostras de Músicas
   - Calcular Preço
   - Iniciar Briefing
   - Verificar Status
   - Falar com Atendente
   - Default Fallback Intent
5. Para cada intent, adicione frases de treinamento relevantes
6. Configure o webhook para todas as intents (exceto Fallback)

### Exemplos de Frases de Treinamento por Intent

**Intent: Informações sobre Pacotes**
- Quais são os pacotes disponíveis?
- Quero conhecer os serviços
- Me fale sobre os preços
- Quais são as opções de pacotes?

**Intent: Amostras de Músicas**
- Quero ouvir exemplos
- Tem alguma amostra?
- Posso escutar alguma música?
- Mostre exemplos do seu trabalho

**Intent: Calcular Preço**
- Quanto custa uma música?
- Quero calcular o preço
- Como funciona o orçamento?
- Qual o valor para uma composição?

**Intent: Iniciar Briefing**
- Quero criar uma música
- Como faço para começar?
- Desejo iniciar um projeto
- Como é o processo de criação?

**Intent: Verificar Status**
- Como está meu pedido?
- Quero acompanhar meu projeto
- Status do meu pedido
- Quando fica pronto?

**Intent: Falar com Atendente**
- Quero falar com uma pessoa
- Preciso de atendimento humano
- Transferir para atendente
- Contato com suporte

## 2. Configuração do Webhook

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta em um serviço de hospedagem (Heroku, Google Cloud Run, etc.)

### Instalação e Execução Local

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

### Deploy no Heroku

1. Crie uma conta no [Heroku](https://heroku.com) (se ainda não tiver)
2. Instale o [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Faça login via terminal:
   ```
   heroku login
   ```
4. Na pasta `webhook`, inicialize um repositório Git:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
5. Crie um aplicativo Heroku:
   ```
   heroku create tunealchemy-chatbot
   ```
6. Implante o código:
   ```
   git push heroku main
   ```
7. O servidor webhook estará disponível em `https://tunealchemy-chatbot.herokuapp.com`

### Deploy no Google Cloud Functions (alternativa)

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

## 3. Integração do Widget no Site

O widget do chatbot já está incluído no site. Você só precisa garantir que:

1. O arquivo `public/widget/chatbot.js` esteja disponível no servidor web
2. O código de integração esteja no HTML do site (já incluído no index.html)

```html
<!-- Chatbot harmonIA -->
<script src="/widget/chatbot.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.harmonIAChatbot.init({
      dialogflowProjectId: 'seu-project-id',  // Substituir pelo ID real
      primaryColor: '#00c853',
      widgetTitle: 'Assistente harmonIA'
    });
  });
</script>
```

3. Substitua `'seu-project-id'` pelo ID real do seu projeto no Google Cloud Platform

## 4. Configurações Avançadas

### Personalização Visual

Você pode personalizar a aparência do chatbot editando o arquivo `chatbot.js`. Procure pela função `injectStyles()` e modifique as propriedades CSS conforme desejado.

### Integração com Sistemas Externos

Para integrar o chatbot com sistemas externos (como CRM, plataformas de e-mail, etc.):

1. Adicione as funções de integração no arquivo `webhook/chatbot-service.js`
2. Configure webhooks adicionais para enviar dados para APIs externas
3. Implemente funções de callback para processar respostas

Exemplo de integração com um sistema CRM:

```javascript
// Em chatbot-service.js
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

## 5. Testes e Validação

### Testando o Webhook

1. Use uma ferramenta como Postman para enviar requisições POST para seu endpoint
2. Simule requisições do Dialogflow com um corpo JSON que inclua:
   ```json
   {
     "queryResult": {
       "intent": {
         "displayName": "Informações sobre Pacotes"
       },
       "parameters": {
         // parâmetros da intent
       }
     }
   }
   ```
3. Verifique se as respostas estão formatadas corretamente

### Testando o Widget

1. Acesse o site onde o widget está integrado
2. Abra o chatbot e teste todas as interações principais
3. Verifique se os estilos estão corretos em diferentes tamanhos de tela
4. Teste a funcionalidade em diferentes navegadores

## 6. Monitoramento e Manutenção

### Logs e Monitoramento

1. Configure logs detalhados no servidor webhook
2. Use o Google Cloud Monitoring para acompanhar o desempenho do agente Dialogflow
3. Implemente métricas de uso do chatbot para avaliar a eficácia

### Atualizações e Melhorias

1. Analise regularmente as conversas para identificar novos padrões de perguntas
2. Atualize as intents do Dialogflow com novas frases de treinamento
3. Melhore as respostas com base no feedback dos usuários
4. Considere implementar funcionalidades avançadas como análise de sentimento ou personalização por usuário

## 7. Resolução de Problemas Comuns

### O chatbot não aparece no site

- Verifique se o arquivo chatbot.js está sendo carregado corretamente (veja o Console do navegador)
- Confirme que a função init() está sendo chamada após o carregamento da página
- Verifique se há conflitos de CSS que possam estar ocultando o widget

### Respostas incorretas ou não relacionadas

- Revise as frases de treinamento da intent no Dialogflow
- Verifique se há intents muito similares que possam estar confundindo o agente
- Adicione mais exemplos de frases para melhorar o reconhecimento

### Problemas com o webhook

- Verifique se a URL do webhook está correta no Dialogflow
- Confirme que o servidor webhook está rodando e acessível
- Analise os logs do servidor para identificar erros específicos

---

Para suporte adicional, consulte a [documentação oficial do Dialogflow](https://cloud.google.com/dialogflow/docs).
