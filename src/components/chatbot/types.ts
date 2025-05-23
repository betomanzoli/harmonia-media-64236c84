
export interface HarmonIAChatbot {
  init: (config: ChatbotConfig) => void;
  toggleChat: () => void;
  addBotMessage: (text: string, quickReplies?: string[]) => void;
  addUserMessage: (text: string) => void;
}

export interface ChatbotConfig {
  dialogflowProjectId?: string;
  primaryColor?: string;
  widgetTitle?: string;
  position?: 'left' | 'right';
  welcomeMessage?: string;
  placeholderText?: string;
  sendButtonText?: string;
  webhookUrl?: string;
}

// Extend Window interface
declare global {
  interface Window {
    harmonIAChatbot?: HarmonIAChatbot;
  }
}
