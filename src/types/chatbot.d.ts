
interface HarmonIAChatbot {
  init: (config: any) => void;
  toggleChat: () => void;
  addBotMessage: (text: string, quickReplies?: string[]) => void;
  addUserMessage: (text: string) => void;
}

interface Window {
  harmonIAChatbot?: HarmonIAChatbot;
}
