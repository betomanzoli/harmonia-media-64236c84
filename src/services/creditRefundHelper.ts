
/**
 * Helper service to generate support requests for credit refunds
 */

interface CreditRefundRequest {
  username: string;
  email: string;
  projectName: string;
  issueDescription: string;
  startDate: string;
  endDate: string;
  creditsUsed: number;
  failedAttempts: number;
}

interface CreditIssue {
  date: string;
  attempt: number;
  errorMessage: string;
  creditsUsed: number;
}

const creditRefundHelper = {
  /**
   * Generate a support request for credit refund
   * @param data Credit refund request data
   * @returns Formatted support request text
   */
  generateRefundRequest: ({
    username,
    email,
    projectName,
    issueDescription,
    startDate,
    endDate,
    creditsUsed,
    failedAttempts
  }: CreditRefundRequest): string => {
    return `
Assunto: Solicitação de Reembolso de Créditos - Problemas com Integração Supabase

Olá Equipe de Suporte Lovable,

Estou entrando em contato para solicitar reembolso de créditos gastos devido a problemas técnicos com a integração Supabase que não foi possível resolver mesmo após múltiplas tentativas.

Informações do usuário:
- Nome: ${username}
- Email: ${email}
- Projeto: ${projectName}

Descrição do problema:
${issueDescription}

Período em que ocorreu o problema:
- Data inicial: ${startDate}
- Data final: ${endDate}

Impacto:
- Total de créditos gastos: ${creditsUsed}
- Número de tentativas malsucedidas: ${failedAttempts}

Durante este período, tentei repetidamente configurar a integração com Supabase seguindo toda a documentação disponível, mas não consegui resolver o problema. Isso resultou em um uso excessivo de créditos sem alcançar o resultado desejado.

Verificações realizadas:
- Segui todas as etapas da documentação oficial
- Tentei diferentes abordagens sugeridas pelo assistente
- Executei vários testes para identificar o problema
- Recebi erros recorrentes que não puderam ser solucionados

Conforme a política de uso justo da plataforma, acredito que este seja um caso válido para reembolso de créditos, já que o problema estava relacionado a limitações ou bugs na integração.

Solicito gentilmente a análise deste caso e o reembolso dos ${creditsUsed} créditos utilizados durante estas tentativas infrutíferas.

Agradeço desde já pela atenção e fico à disposição para fornecer informações adicionais que possam ser necessárias.

Atenciosamente,
${username}
${email}
`;
  },
  
  /**
   * Generate a list of issue timestamps for credit refund
   * @param issues Array of credit issues
   * @returns Formatted list of issues
   */
  generateIssuesList: (issues: CreditIssue[]): string => {
    let issuesList = 'Histórico detalhado de tentativas:\n\n';
    
    issues.forEach((issue, index) => {
      issuesList += `Tentativa #${index + 1} (${issue.date}):\n`;
      issuesList += `- Problema: ${issue.errorMessage}\n`;
      issuesList += `- Créditos gastos: ${issue.creditsUsed}\n\n`;
    });
    
    return issuesList;
  },
  
  /**
   * Estimate credit usage for a time period
   * @param startDate Start date string
   * @param endDate End date string 
   * @param avgCreditsPerAttempt Average credits per attempt
   * @param attempts Number of attempts
   * @returns Estimated credit usage
   */
  estimateCreditUsage: (
    startDate: string, 
    endDate: string, 
    avgCreditsPerAttempt: number = 3, 
    attempts: number = 10
  ): number => {
    // This is a simplified estimation model
    return avgCreditsPerAttempt * attempts;
  }
};

export default creditRefundHelper;
