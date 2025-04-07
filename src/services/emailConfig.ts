
// Configurações para o serviço de email usando PrivateEmail.com (Namecheap)

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// Este é um modelo do que deve ser configurado na Edge Function do Supabase
// NÃO inclua suas credenciais reais neste arquivo, use as variáveis de ambiente do Supabase
export const emailConfigTemplate = {
  host: 'smtp.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'contato@harmonia.media', 
    pass: 'SENHA_DO_EMAIL'
  },
  from: 'harmonIA <contato@harmonia.media>'
};

// Instruções de uso:
// 1. Na função send-email do Supabase, use nodemailer com estas configurações
// 2. Substitua 'SENHA_DO_EMAIL' pela senha real do email usando variáveis de ambiente
// 3. Nomeie a variável de ambiente como SMTP_PASSWORD no painel do Supabase
