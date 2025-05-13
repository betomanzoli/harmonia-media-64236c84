
const webhookService = {
  getWebhookUrl: async (): Promise<string> => {
    return localStorage.getItem('webhook_url') || '';
  },

  saveWebhookUrl: async (url: string): Promise<void> => {
    localStorage.setItem('webhook_url', url);
  }
};

export default webhookService;
