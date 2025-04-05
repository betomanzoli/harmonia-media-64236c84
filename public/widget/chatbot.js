
// Chatbot Widget harmonIA
(function() {
  // Estilos CSS para o widget
  const styles = `
    .harmonia-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: 'Inter', sans-serif;
    }
    .harmonia-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #00c853;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    .harmonia-button:hover {
      transform: scale(1.05);
    }
    .harmonia-icon {
      width: 30px;
      height: 30px;
      fill: white;
    }
    .harmonia-chat-container {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
    .harmonia-chat-container.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    .harmonia-chat-header {
      background-color: #00c853;
      color: white;
      padding: 15px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .harmonia-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 18px;
    }
    .harmonia-chat-messages {
      flex-grow: 1;
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .harmonia-message {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 18px;
      margin-bottom: 5px;
      word-wrap: break-word;
    }
    .harmonia-bot-message {
      background-color: #f1f1f1;
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 5px;
    }
    .harmonia-user-message {
      background-color: #00c853;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 5px;
    }
    .harmonia-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    .harmonia-suggestion {
      background-color: #e9f7ef;
      color: #00c853;
      border: 1px solid #00c853;
      border-radius: 15px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .harmonia-suggestion:hover {
      background-color: #00c853;
      color: white;
    }
    .harmonia-chat-input {
      display: flex;
      padding: 10px;
      border-top: 1px solid #eaeaea;
    }
    .harmonia-input {
      flex-grow: 1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 8px 15px;
      outline: none;
    }
    .harmonia-send-btn {
      background-color: #00c853;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  // Estado do chatbot
  let isOpen = false;
  let messages = [];
  let sessionId = Math.random().toString(36).substring(2, 15);

  // Config
  let config = {
    dialogflowProjectId: '',
    primaryColor: '#00c853',
    widgetTitle: 'Assistente harmonIA'
  };

  // Inicialização do widget
  function init(userConfig) {
    // Mesclar configurações
    config = { ...config, ...userConfig };
    
    // Injetar estilos
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    
    // Criar widget
    createWidget();
    
    // Enviar mensagem de boas-vindas
    setTimeout(() => {
      addBotMessage('👋 Olá! Sou o assistente virtual da harmonIA. Posso ajudar você a conhecer nossos serviços, enviar amostras, calcular preços ou iniciar seu briefing musical. Como posso te ajudar hoje?', [
        'Conhecer pacotes',
        'Ouvir amostras',
        'Calcular preço',
        'Iniciar briefing'
      ]);
    }, 500);
  }

  // Criação do widget
  function createWidget() {
    // Container principal
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'harmonia-widget';
    
    // Botão do chat
    const chatButton = document.createElement('div');
    chatButton.className = 'harmonia-button';
    chatButton.innerHTML = `
      <svg class="harmonia-icon" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;
    chatButton.addEventListener('click', toggleChat);
    
    // Container do chat
    const chatContainer = document.createElement('div');
    chatContainer.className = 'harmonia-chat-container';
    chatContainer.id = 'harmonia-chat-container';
    
    // Cabeçalho do chat
    const chatHeader = document.createElement('div');
    chatHeader.className = 'harmonia-chat-header';
    chatHeader.innerHTML = `
      <div>${config.widgetTitle}</div>
      <button class="harmonia-close-btn">&times;</button>
    `;
    chatHeader.querySelector('.harmonia-close-btn').addEventListener('click', toggleChat);
    
    // Área de mensagens
    const chatMessages = document.createElement('div');
    chatMessages.className = 'harmonia-chat-messages';
    chatMessages.id = 'harmonia-chat-messages';
    
    // Área de entrada
    const chatInput = document.createElement('div');
    chatInput.className = 'harmonia-chat-input';
    chatInput.innerHTML = `
      <input type="text" class="harmonia-input" placeholder="Digite sua mensagem...">
      <button class="harmonia-send-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;
    
    // Event listeners
    const inputField = chatInput.querySelector('.harmonia-input');
    const sendButton = chatInput.querySelector('.harmonia-send-btn');
    
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Montar estrutura do chat
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatMessages);
    chatContainer.appendChild(chatInput);
    
    // Adicionar elementos ao DOM
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(chatButton);
    document.body.appendChild(widgetContainer);
    
    // Função para enviar mensagem
    function sendMessage() {
      const text = inputField.value.trim();
      if (text) {
        addUserMessage(text);
        inputField.value = '';
        
        // Simular resposta do webhook/Dialogflow
        // Em uma implementação real, isso seria uma chamada à API
        processMessage(text);
      }
    }
  }

  // Adicionar mensagem do usuário
  function addUserMessage(text) {
    const messagesContainer = document.getElementById('harmonia-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'harmonia-message harmonia-user-message';
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Armazenar mensagem
    messages.push({ role: 'user', content: text });
  }

  // Adicionar mensagem do bot
  function addBotMessage(text, suggestions = []) {
    const messagesContainer = document.getElementById('harmonia-chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'harmonia-message harmonia-bot-message';
    messageElement.innerHTML = text.replace(/\n/g, '<br>');
    
    // Adicionar sugestões, se houver
    if (suggestions.length > 0) {
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'harmonia-suggestions';
      
      suggestions.forEach(suggestion => {
        const suggestionButton = document.createElement('button');
        suggestionButton.className = 'harmonia-suggestion';
        suggestionButton.textContent = suggestion;
        suggestionButton.addEventListener('click', () => {
          addUserMessage(suggestion);
          processMessage(suggestion);
        });
        suggestionsContainer.appendChild(suggestionButton);
      });
      
      messageElement.appendChild(suggestionsContainer);
    }
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Armazenar mensagem
    messages.push({ role: 'bot', content: text });
  }

  // Processar mensagem do usuário (simulação)
  function processMessage(text) {
    // Simular "digitando..."
    const typingDelay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      // Lógica simplificada - em produção, use Dialogflow/webhook
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('pacote') || lowerText.includes('serviço') || lowerText.includes('conhecer')) {
        addBotMessage(`Temos 3 pacotes principais:\n\n🎵 Pacote Essencial (R$219)\n• 1 composição musical com IA + revisão humana\n• 1 revisão gratuita\n• Entrega em até 48h\n• Ideal para: presentes emocionais\n\n🎵 Pacote Profissional (R$479)\n• 3 variações em estilos diferentes\n• Masterização básica IA\n• Stems separados\n• 3 revisões gratuitas\n• Entrega em até 72h\n• Ideal para: criadores de conteúdo\n\n🎵 Pacote Premium (R$969)\n• 5 variações de composição\n• Masterização profissional\n• Registro na Biblioteca Nacional\n• Partitura em formato MusicXML\n• Revisões ilimitadas (30 dias)\n• Ideal para: empresas e projetos corporativos`, ['Detalhes Essencial', 'Detalhes Profissional', 'Detalhes Premium']);
      } 
      else if (lowerText.includes('amostra') || lowerText.includes('exemplo') || lowerText.includes('ouvir')) {
        addBotMessage(`Claro! Temos várias amostras de projetos anteriores.\n\nQue tipo de música você gostaria de ouvir?`, ['Pop/Acústico', 'Eletrônico/Corporativo', 'Orquestral/Coral', 'Clássico/Romântico']);
      }
      else if (lowerText.includes('pop/acústico') || lowerText.includes('pop') || lowerText.includes('acústico')) {
        // Simulação - idealmente links para amostras reais
        addBotMessage(`Ótima escolha! Aqui está uma amostra de Pop/Acústico:\n\n[Este seria um link para uma amostra real]\n\nO que achou? Gostaria de ouvir outro estilo?`, ['Ouvir outro estilo', 'Calcular preço', 'Iniciar briefing']);
      }
      else if (lowerText.includes('calcular') || lowerText.includes('preço') || lowerText.includes('valor') || lowerText.includes('custo')) {
        addBotMessage(`Vamos calcular o preço do seu projeto musical!\n\nPrimeiro, qual pacote básico você tem interesse?`, ['Pacote Essencial - R$219', 'Pacote Profissional - R$479', 'Pacote Premium - R$969']);
      }
      else if (lowerText.includes('briefing') || lowerText.includes('iniciar projeto')) {
        addBotMessage(`Ótimo! Vou te guiar pelo processo de briefing.\n\nPara começar, precisarei de algumas informações básicas:\n\nQual é o seu nome completo?`);
      }
      else if (lowerText.includes('atendente') || lowerText.includes('pessoa') || lowerText.includes('humano')) {
        addBotMessage(`Entendo que você prefere falar diretamente com um atendente.\n\nNosso horário de atendimento é de segunda a sexta, das 9h às 18h.\n\nGostaria de:`, ['Contato via WhatsApp', 'Contato via Email', 'Continuar conversando']);
      }
      else {
        // Resposta padrão para mensagens não reconhecidas
        addBotMessage(`Desculpe, não consegui entender completamente sua pergunta. Poderia reformular ou escolher uma das opções abaixo?`, ['Informações sobre pacotes', 'Ver amostras de músicas', 'Calcular preço', 'Iniciar briefing', 'Falar com atendente']);
      }
    }, typingDelay);
  }

  // Alternar visibilidade do chat
  function toggleChat() {
    const chatContainer = document.getElementById('harmonia-chat-container');
    isOpen = !isOpen;
    
    if (isOpen) {
      chatContainer.classList.add('active');
    } else {
      chatContainer.classList.remove('active');
    }
  }

  // Expor funções públicas
  window.harmonIAChatbot = {
    init: init,
    open: function() {
      if (!isOpen) {
        toggleChat();
      }
    },
    close: function() {
      if (isOpen) {
        toggleChat();
      }
    }
  };
})();
