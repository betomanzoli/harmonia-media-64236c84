import { z } from 'zod';

// ✅ SCHEMA PARA BRIEFING ESSENCIAL
export const BriefingEssencialSchema = z.object({
  historia: z.string().min(10, 'História deve ter pelo menos 10 caracteres').max(1000, 'História muito longa'),
  emocoes: z.array(z.string()).min(1, 'Selecione pelo menos uma emoção').max(3, 'Máximo 3 emoções'),
  estiloMusical: z.string().min(1, 'Selecione um estilo musical'),
  artistasReferencia: z.string().optional(),
  andamento: z.string().min(1, 'Selecione um andamento'),
  fraseEspecifica: z.string().optional(),
  duracao: z.string().min(1, 'Selecione uma duração'),
  tipoVocal: z.string().optional(),
  materiaisApoio: z.string().optional(),
  nomeCompleto: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido')
});

// ✅ SCHEMA PARA BRIEFING PROFISSIONAL
export const BriefingProfissionalSchema = z.object({
  historia: z.string().min(10, 'História deve ter pelo menos 10 caracteres').max(1500, 'História muito longa'),
  propositoPrincipal: z.string().min(1, 'Selecione um propósito'),
  emocoes: z.array(z.string()).min(1, 'Selecione pelo menos uma emoção').max(3, 'Máximo 3 emoções'),
  estilosMusicais: z.array(z.string()).min(1, 'Selecione pelo menos um estilo').max(3, 'Máximo 3 estilos'),
  artistasReferencia: z.string().optional(),
  tempoAndamento: z.string().optional(),
  instrumentosDestaque: z.string().optional(),
  estruturaPreferida: z.string().optional(),
  duracaoEspecifica: z.string().min(1, 'Informe a duração'),
  bpmAproximado: z.string().optional(),
  caracteristicasSonoras: z.array(z.string()).optional(),
  linksReferencia: z.string().optional(),
  exemploConteudo: z.string().optional(),
  plataformasUso: z.array(z.string()).min(1, 'Selecione pelo menos uma plataforma'),
  publicoAlvo: z.string().optional(),
  necessidadesMonetizacao: z.string().optional(),
  desejaAgendamento: z.boolean().default(false),
  disponibilidadeHorario: z.string().optional(),
  melhorContato: z.string().optional(),
  topicosChamada: z.string().optional(),
  nomeCompleto: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido')
});

// ✅ SCHEMA PARA BRIEFING PREMIUM
export const BriefingPremiumSchema = z.object({
  conceitoEstrategico: z.string().min(20, 'Conceito deve ter pelo menos 20 caracteres').max(2000, 'Conceito muito longo'),
  objetivosEstrategicos: z.string().min(10, 'Descreva os objetivos'),
  publicoAlvo: z.string().optional(),
  contextoUtilizacao: z.string().optional(),
  identidadeMarca: z.string().optional(),
  emocoesPrimarias: z.array(z.string()).min(1, 'Selecione pelo menos uma emoção primária').max(3, 'Máximo 3 emoções primárias'),
  emocoesSecundarias: z.array(z.string()).max(3, 'Máximo 3 emoções secundárias'),
  progressaoEmocional: z.string().optional(),
  mensagemCentral: z.string().min(1, 'Defina a mensagem central'),
  estilosPrimarios: z.array(z.string()).min(1, 'Selecione pelo menos um estilo').max(5, 'Máximo 5 estilos'),
  artistasReferenciaPorEstilo: z.string().optional(),
  caracteristicasSonoras: z.array(z.string()).optional(),
  duracaoExata: z.string().min(1, 'Informe a duração exata'),
  pontosMarcacao: z.string().optional(),
  necessidadesMixagem: z.string().optional(),
  tiposVocais: z.string().optional(),
  masterizacaoPlataformas: z.array(z.string()).optional(),
  brandBook: z.string().optional(),
  videosConteudo: z.string().optional(),
  scriptsTextos: z.string().optional(),
  comunicacaoAnterior: z.string().optional(),
  nomeCompletoRegistro: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  enderecoCompleto: z.string().min(10, 'Endereço completo obrigatório'),
  cep: z.string().min(8, 'CEP inválido').regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido'),
  telefoneContato: z.string().min(10, 'Telefone inválido'),
  emailContato: z.string().email('Email inválido'),
  dataPreferida: z.string().min(1, 'Selecione uma data'),
  horarioPreferido: z.string().min(1, 'Selecione um horário'),
  participantesIncluir: z.string().optional(),
  topicosDiscutir: z.string().min(10, 'Descreva os tópicos'),
  objetivosConsultoria: z.string().optional()
});

// ✅ SCHEMA PARA FEEDBACK
export const FeedbackSchema = z.object({
  projectId: z.string().min(1, 'ID do projeto obrigatório'),
  userEmail: z.string().email('Email inválido'),
  status: z.enum(['feedback', 'approved'], 'Status inválido'),
  comments: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres'),
  selectedVersion: z.string().optional(),
  rating: z.number().min(1).max(5).optional()
});

// ✅ SCHEMA PARA CONTATO
export const ContactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Assunto obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres')
});

// ✅ TYPES EXPORT
export type BriefingEssencialData = z.infer<typeof BriefingEssencialSchema>;
export type BriefingProfissionalData = z.infer<typeof BriefingProfissionalSchema>;
export type BriefingPremiumData = z.infer<typeof BriefingPremiumSchema>;
export type FeedbackData = z.infer<typeof FeedbackSchema>;
export type ContactData = z.infer<typeof ContactSchema>;

// ✅ VALIDATION HELPERS
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
};
