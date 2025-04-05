
# Guia de Implementação do Chatbot harmonIA

Este guia fornece instruções passo a passo para implementar e configurar o chatbot harmonIA para o site tunealchemy-studio.

## Estrutura de Arquivos

```
/
├── public/
│   └── widget/
│       └── chatbot.js     # Script do widget frontend
├── webhook/
│   └── server.js          # Servidor Node.js para webhook do Dialogflow
└── CHATBOT_README.md      # Esta documentação
```

## 1. Configuração do Dialogflow (Google Cloud)

### Pré-requisitos

- Uma conta no Google Cloud Platform
- Projeto criado no GCP
- API do Dialogflow ES habilitada

### Passos para Configuração

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

### Exemplo de Configuração de Intent

**Intent: Informações sobre Pacotes**

Frases de treinamento:
- Quais são os pacotes disponíveis?
- Quero conhecer os serviços
- Me fale sobre os preços
- Quais são as opções de pacotes?

Parâmetros:
- package (tipo: string, opcional)

Respostas:
- [Habilitar webhook]

## 2. Configuração do Servidor Webhook

### Pré-requisitos

- Node.js instalado
- npm ou yarn instalado
- Conta em um serviço de hospedagem (Heroku, Google Cloud Run, etc.)

### Instalação Local

1. Navegue até a pasta `webhook`
2. Instale as dependências:
   ```
   npm install express cors body-parser
   ```
3. Execute o servidor localmente:
   ```
   node server.js
   ```
4. O servidor estará disponível em `http://localhost:3000`

### Implantação no Heroku

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
   git push heroku master
   ```
7. O servidor webhook estará disponível em `https://tunealchemy-chatbot.herokuapp.com`

## 3. Integração do Widget no Site

1. Copie o arquivo `public/widget/chatbot.js` para o diretório de arquivos estáticos do seu site
2. No HTML do site, adicione os seguintes scripts:

```html
<!-- Chatbot harmonIA -->
<script src="/widget/chatbot.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.harmonIAChatbot.init({
      dialogflowProjectId: 'seu-project-id',  // ID do projeto no GCP
      primaryColor: '#00c853',
      widgetTitle: 'Assistente harmonIA'
    });
  });
</script>
```

3. Substitua `seu-project-id` pelo ID real do seu projeto no Google Cloud Platform

## 4. Conexão com Dialogflow

Para integrar completamente o widget com o Dialogflow, você precisará:

1. Obter credenciais de autenticação do GCP:
   - No console do GCP, vá para IAM & Admin > Service Accounts
   - Crie uma nova conta de serviço com permissões "Dialogflow API Client"
   - Crie e baixe uma chave JSON para esta conta

2. No arquivo `chatbot.js`, implemente a função para comunicar com o Dialogflow:

```javascript
// Exemplo de implementação (simplificado)
async function sendToDialogflow(text) {
  const response = await fetch('https://tunealchemy-chatbot.herokuapp.com/dialogflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      sessionId: sessionId
    })
  });
  
  return await response.json();
}
```

3. No servidor webhook, adicione um endpoint para processar as requisições do widget:

```javascript
app.post('/dialogflow', async (req, res) => {
  const text = req.body.text;
  const sessionId = req.body.sessionId;
  
  // Código para se comunicar com a API do Dialogflow usando o pacote dialogflow
  // ...
  
  res.json(result);
});
```

## 5. Personalização

### Cores e Estilo

Você pode personalizar a aparência do chatbot editando as variáveis CSS no início do arquivo `chatbot.js`:

```javascript
const styles = `
  .harmonia-button {
    background-color: ${config.primaryColor};
    /* outras propriedades */
  }
  /* outros estilos */
`;
```

### Mensagens e Fluxos

Para personalizar as mensagens e fluxos de conversa:

1. Edite as intents no console do Dialogflow
2. Atualize as respostas no servidor webhook
3. Teste todas as interações para garantir consistência

## 6. Testes e Validação

Antes de colocar em produção:

1. Teste todas as intents no console do Dialogflow
2. Verifique se o webhook responde corretamente
3. Teste o widget em diferentes navegadores e dispositivos
4. Verifique casos de erro e respostas de fallback

## Suporte e Manutenção

Para atualizar o chatbot no futuro:

1. Adicione novas intents no Dialogflow conforme necessário
2. Atualize o servidor webhook para processar novas intents
3. Mantenha as credenciais seguras e atualizadas
4. Monitore logs para identificar problemas ou oportunidades de melhoria

---

Para suporte adicional, consulte a [documentação oficial do Dialogflow](https://cloud.google.com/dialogflow/docs).
