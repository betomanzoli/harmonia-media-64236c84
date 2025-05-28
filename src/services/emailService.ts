
// Minimal email service stub for compilation
export default {
  sendPaymentConfirmation: async (email: string, name: string, packageName: string) => {
    console.log('Email service stub - sendPaymentConfirmation:', { email, name, packageName });
    return Promise.resolve();
  }
};
