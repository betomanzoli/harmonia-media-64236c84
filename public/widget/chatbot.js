
/**
 * Widget do Chatbot harmonIA
 * Este script implementa a interface do usuário do chatbot no site
 */

// Namespace para o chatbot
window.harmonIAChatbot = (function() {
  // Configurações padrão
  let config = {
    dialogflowProjectId: '',
    primaryColor: '#00c853',
    widgetTitle: 'Assistente harmonIA',
    position: 'right',
    welcomeMessage: 'Olá! Sou o assistente virtual da harmonIA. Como posso ajudar hoje?',
    placeholderText: 'Digite sua mensagem...',
    sendButtonText: 'Enviar'
  };
  
  // Estado do chatbot
  let state = {
    isOpen: false,
    messages: [],
    sessionId: generateSessionId()
  };
  
  // Elementos do DOM
  let elements = {
    container: null,
    button: null,
    chatWindow: null,
    messageList: null,
    inputForm: null,
    inputField: null
  };
  
  // Gera ID único de sessão
  function generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Inicializa o chatbot
  function init(userConfig) {
    // Mescla configurações do usuário com padrões
    config = { ...config, ...userConfig };
    
    // Cria os elementos da UI
    createElements();
    
    // Adiciona listeners de eventos
    attachEventListeners();
    
    // Adiciona estilos
    injectStyles();
    
    // Adiciona mensagem de boas-vindas
    addBotMessage(config.welcomeMessage);
    
    console.log('harmonIA Chatbot inicializado com sucesso!');
  }
  
  // Cria os elementos HTML do chatbot
  function createElements() {
    // Container principal
    elements.container = document.createElement('div');
    elements.container.className = 'harmonia-chatbot-container';
    document.body.appendChild(elements.container);
    
    // Botão de toggle
    elements.button = document.createElement('button');
    elements.button.className = 'harmonia-button';
    elements.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    elements.container.appendChild(elements.button);
    
    // Janela do chat
    elements.chatWindow = document.createElement('div');
    elements.chatWindow.className = 'harmonia-chat-window';
    elements.chatWindow.style.display = 'none';
    elements.container.appendChild(elements.chatWindow);
    
    // Cabeçalho
    const header = document.createElement('div');
    header.className = 'harmonia-chat-header';
    header.innerHTML = `
      <span>${config.widgetTitle}</span>
      <button class="harmonia-close-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    elements.chatWindow.appendChild(header);
    
    // Lista de mensagens
    elements.messageList = document.createElement('div');
    elements.messageList.className = 'harmonia-message-list';
    elements.chatWindow.appendChild(elements.messageList);
    
    // Formulário de input
    elements.inputForm = document.createElement('form');
    elements.inputForm.className = 'harmonia-input-form';
    elements.chatWindow.appendChild(elements.inputForm);
    
    // Campo de texto
    elements.inputField = document.createElement('input');
    elements.inputField.type = 'text';
    elements.inputField.className = 'harmonia-input-field';
    elements.inputField.placeholder = config.placeholderText;
    elements.inputForm.appendChild(elements.inputField);
    
    // Botão de enviar
    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.className = 'harmonia-send-button';
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    `;
    elements.inputForm.appendChild(sendButton);
  }
  
  // Adiciona listeners de eventos
  function attachEventListeners() {
    // Toggle do chatbot
    elements.button.addEventListener('click', toggleChat);
    
    // Fechar chat
    const closeButton = elements.chatWindow.querySelector('.harmonia-close-button');
    closeButton.addEventListener('click', toggleChat);
    
    // Enviar mensagem
    elements.inputForm.addEventListener('submit', handleSubmit);
  }
  
  // Injeta estilos CSS
  function injectStyles() {
    const styles = `
      .harmonia-chatbot-container {
        position: fixed;
        bottom: 20px;
        ${config.position === 'right' ? 'right: 20px;' : 'left: 20px;'}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .harmonia-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${config.primaryColor};
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s ease;
      }
      
      .harmonia-button:hover {
        transform: scale(1.05);
      }
      
      .harmonia-chat-window {
        position: absolute;
        bottom: 80px;
        ${config.position === 'right' ? 'right: 0;' : 'left: 0;'}
        width: 350px;
        height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .harmonia-chat-header {
        padding: 15px;
        background-color: ${config.primaryColor};
        color: white;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .harmonia-close-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
      }
      
      .harmonia-message-list {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .harmonia-message {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        margin-bottom: 5px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .harmonia-bot-message {
        background-color: #f1f1f1;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 5px;
      }
      
      .harmonia-user-message {
        background-color: ${config.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 5px;
      }
      
      .harmonia-input-form {
        display: flex;
        padding: 10px;
        border-top: 1px solid #eee;
      }
      
      .harmonia-input-field {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
      }
      
      .harmonia-send-button {
        background: none;
        border: none;
        color: ${config.primaryColor};
        cursor: pointer;
        padding: 0 10px;
      }
      
      .harmonia-quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
      }
      
      .harmonia-quick-reply {
        background-color: #f1f1f1;
        border: 1px solid #ddd;
        border-radius: 15px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .harmonia-quick-reply:hover {
        background-color: #e0e0e0;
      }
      
      @media (max-width: 480px) {
        .harmonia-chat-window {
          width: 300px;
          height: 450px;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
  }
  
  // Toggle a visibilidade do chat
  function toggleChat() {
    state.isOpen = !state.isOpen;
    elements.chatWindow.style.display = state.isOpen ? 'flex' : 'none';
    
    if (state.isOpen) {
      elements.inputField.focus();
    }
  }
  
  // Manipula o envio de mensagem
  function handleSubmit(e) {
    e.preventDefault();
    const userMessage = elements.inputField.value.trim();
    
    if (userMessage) {
      // Adiciona mensagem do usuário à UI
      addUserMessage(userMessage);
      
      // Limpa o campo de input
      elements.inputField.value = '';
      
      // Simula o processamento da mensagem
      // Em produção, substitua por uma chamada real para o Dialogflow
      simulateProcessing(userMessage);
    }
  }
  
  // Adiciona uma mensagem do bot à UI
  function addBotMessage(text, quickReplies = []) {
    const messageElement = document.createElement('div');
    messageElement.className = 'harmonia-message harmonia-bot-message';
    messageElement.textContent = text;
    
    elements.messageList.appendChild(messageElement);
    
    // Adiciona quick replies se houver
    if (quickReplies.length > 0) {
      const quickRepliesContainer = document.createElement('div');
      quickRepliesContainer.className = 'harmonia-quick-replies';
      
      quickReplies.forEach(reply => {
        const quickReplyElement = document.createElement('div');
        quickReplyElement.className = 'harmonia-quick-reply';
        quickReplyElement.textContent = reply;
        
        quickReplyElement.addEventListener('click', () => {
          addUserMessage(reply);
          simulateProcessing(reply);
        });
        
        quickRepliesContainer.appendChild(quickReplyElement);
      });
      
      elements.messageList.appendChild(quickRepliesContainer);
    }
    
    // Rola para a última mensagem
    scrollToBottom();
    
    // Armazena a mensagem no estado
    state.messages.push({
      sender: 'bot',
      text: text,
      quickReplies: quickReplies
    });
  }
  
  // Adiciona uma mensagem do usuário à UI
  function addUserMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.className = 'harmonia-message harmonia-user-message';
    messageElement.textContent = text;
    
    elements.messageList.appendChild(messageElement);
    
    // Rola para a última mensagem
    scrollToBottom();
    
    // Armazena a mensagem no estado
    state.messages.push({
      sender: 'user',
      text: text
    });
  }
  
  // Rola a lista de mensagens para o final
  function scrollToBottom() {
    elements.messageList.scrollTop = elements.messageList.scrollHeight;
  }
  
  // Simula o processamento de mensagem (para desenvolvimento)
  // Em produção, substitua por uma chamada real para o Dialogflow
  function simulateProcessing(userMessage) {
    // Adiciona indicador de digitação
    const typingElement = document.createElement('div');
    typingElement.className = 'harmonia-message harmonia-bot-message';
    typingElement.textContent = '...';
    elements.messageList.appendChild(typingElement);
    scrollToBottom();
    
    // Simula o tempo de resposta do bot
    setTimeout(() => {
      // Remove o indicador de digitação
      elements.messageList.removeChild(typingElement);
      
      // Lógica de resposta simulada
      let response;
      let quickReplies = [];
      
      // Respostas baseadas em palavras-chave simples
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
        response = 'Olá! Sou o assistente virtual da harmonIA. Como posso ajudar com sua música personalizada hoje?';
        quickReplies = ['Informações sobre pacotes', 'Ver amostras', 'Iniciar briefing', 'Falar com atendente'];
      } 
      else if (lowerMessage.includes('pacote') || lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('plano')) {
        response = 'Oferecemos 3 pacotes principais: Essencial (R$219), Profissional (R$479) e Premium (R$969). Cada um tem características específicas para diferentes necessidades.';
        quickReplies = ['Detalhes do Essencial', 'Detalhes do Profissional', 'Detalhes do Premium', 'Calcular preço'];
      }
      else if (lowerMessage.includes('amostra') || lowerMessage.includes('exemplo') || lowerMessage.includes('portfólio') || lowerMessage.includes('portfolio')) {
        response = 'Você pode conferir nosso portfólio completo em nosso site ou posso te mostrar algumas amostras populares.';
        quickReplies = ['Ver portfólio completo', 'Amostras de casamento', 'Amostras corporativas', 'Iniciar briefing'];
      }
      else if (lowerMessage.includes('briefing') || lowerMessage.includes('começar') || lowerMessage.includes('iniciar') || lowerMessage.includes('criar')) {
        response = 'Ótimo! Para iniciar seu projeto musical, você pode preencher nosso formulário de briefing ou posso te guiar com algumas perguntas para entender melhor o que você precisa.';
        quickReplies = ['Preencher formulário', 'Iniciar briefing guiado', 'Ver exemplos primeiro'];
      }
      else if (lowerMessage.includes('status') || lowerMessage.includes('acompanhar') || lowerMessage.includes('pedido')) {
        response = 'Para verificar o status do seu pedido, acesse nossa página de acompanhamento com seu código de pedido ou me informe o código aqui.';
        quickReplies = ['Acessar acompanhamento', 'Informar código', 'Falar com atendente'];
      }
      else if (lowerMessage.includes('atendente') || lowerMessage.includes('pessoa') || lowerMessage.includes('humano') || lowerMessage.includes('whatsapp')) {
        response = 'Entendo que você prefere falar com um atendente humano. Posso transferir você para nossa equipe de atendimento via WhatsApp ou e-mail.';
        quickReplies = ['WhatsApp', 'E-mail', 'Continuar com o bot'];
      }
      else {
        response = 'Desculpe, não entendi completamente. Posso ajudar com informações sobre nossos pacotes, amostras de música, processo de briefing ou colocar você em contato com nossa equipe.';
        quickReplies = ['Informações sobre pacotes', 'Ver amostras', 'Iniciar briefing', 'Falar com atendente'];
      }
      
      // Adiciona a resposta do bot
      addBotMessage(response, quickReplies);
    }, 1500);
  }
  
  // Função para enviar mensagem ao Dialogflow (implementação futura)
  function sendToDialogflow(text) {
    // Esta é apenas uma estrutura para implementação futura
    // Em um ambiente de produção, você precisará implementar a
    // comunicação real com a API do Dialogflow ou com seu servidor webhook
    
    console.log('Enviando para Dialogflow:', text);
    
    // Exemplo de como a implementação pode ser:
    /*
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
    */
  }
  
  // Interface pública
  return {
    init,
    toggleChat,
    addBotMessage,
    addUserMessage
  };
})();

// Implementação futura para comunicação com backend/Dialogflow
// document.addEventListener('DOMContentLoaded', function() {
//   // Inicialização com configurações específicas do site
//   window.harmonIAChatbot.init({
//     dialogflowProjectId: 'seu-project-id',
//     primaryColor: '#00c853',
//     widgetTitle: 'Assistente harmonIA'
//   });
// });
