
# Integração do Widget no Site

O widget do chatbot harmonIA é o componente de frontend que permite a interação dos usuários com o assistente virtual.

## Arquivos do Widget

```
public/
└── widget/
    └── chatbot.js     # Script do widget frontend
```

## Integração Básica

O widget já está incluído no site. Você só precisa garantir que:

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

## Opções de Configuração

O widget aceita as seguintes opções de configuração:

| Opção | Tipo | Descrição | Padrão |
|-------|------|-----------|--------|
| dialogflowProjectId | string | ID do projeto no GCP | '' |
| primaryColor | string | Cor principal do widget | '#00c853' |
| widgetTitle | string | Título exibido no cabeçalho | 'Assistente harmonIA' |
| position | string | Posição do widget ('left' ou 'right') | 'right' |
| welcomeMessage | string | Mensagem inicial | 'Olá! Sou o assistente virtual...' |
| placeholderText | string | Placeholder do campo de texto | 'Digite sua mensagem...' |
| sendButtonText | string | Texto do botão de envio | 'Enviar' |

## Personalização Avançada

### Modificação de Estilos

Você pode personalizar a aparência do chatbot editando o arquivo `chatbot.js`:

1. Localize a função `injectStyles()`
2. Modifique as propriedades CSS conforme desejado

Por exemplo, para modificar a aparência do botão do chatbot:

```css
.harmonia-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${config.primaryColor};
  /* Outras propriedades CSS */
}
```

### Personalização de Ícones

Para alterar os ícones do widget:

1. Localize as tags SVG no arquivo `chatbot.js`
2. Substitua pelo seu próprio SVG ou use uma biblioteca de ícones

### Integração com Google Analytics

Para rastrear eventos do chatbot no Google Analytics:

1. No arquivo `chatbot.js`, adicione a função de rastreamento:

```javascript
function trackEvent(category, action, label) {
  if (window.gtag) {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
}
```

2. Chame esta função nos eventos relevantes:

```javascript
// Exemplo: rastrear quando uma mensagem é enviada
function handleSubmit(e) {
  e.preventDefault();
  const userMessage = elements.inputField.value.trim();
  
  if (userMessage) {
    // Rastreia o evento
    trackEvent('Chatbot', 'message_sent', userMessage);
    
    // ... resto do código
  }
}
```

## Comunicação com o Backend

No ambiente de produção, você precisará substituir a função `simulateProcessing` por uma comunicação real com o backend:

```javascript
function sendToDialogflow(text) {
  fetch('/api/dialogflow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      sessionId: state.sessionId
    })
  })
  .then(response => response.json())
  .then(data => {
    // Processar a resposta do Dialogflow
    addBotMessage(data.fulfillmentText, data.quickReplies);
  })
  .catch(error => {
    console.error('Erro ao comunicar com Dialogflow:', error);
    addBotMessage('Desculpe, tive um problema de comunicação. Pode tentar novamente?');
  });
}
```

## Responsividade

O widget é responsivo por padrão, mas você pode ajustar os estilos para diferentes tamanhos de tela:

```css
@media (max-width: 480px) {
  .harmonia-chat-window {
    width: 300px;
    height: 450px;
  }
}

@media (max-width: 320px) {
  .harmonia-chat-window {
    width: 250px;
    height: 400px;
  }
}
```
