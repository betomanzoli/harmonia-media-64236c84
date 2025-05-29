
export interface EmailService {
  sendPaymentConfirmation: (email: string, name: string, packageName: string) => Promise<void>;
  sendNotification: (to: string, subject: string, message: string) => Promise<void>;
}

const emailService: EmailService = {
  async sendPaymentConfirmation(email: string, name: string, packageName: string) {
    // Mock implementation - será substituído na Fase 2
    console.log('Sending payment confirmation email:', { email, name, packageName });
    return Promise.resolve();
  },

  async sendNotification(to: string, subject: string, message: string) {
    // Mock implementation - será substituído na Fase 2
    console.log('Sending notification email:', { to, subject, message });
    return Promise.resolve();
  }
};

export default emailService;
