
interface HarmonIAChatbot {
  toggleChat: () => void;
  addUserMessage: (message: string) => void;
  addBotMessage: (message: string, options?: string[]) => void;
}

declare global {
  interface Window {
    harmonIAChatbot?: HarmonIAChatbot;
  }
}

export {};
