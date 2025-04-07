
import { z } from "zod";
import { QualificationFormData } from "@/types/qualification";

export const qualificationFormSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  referralSource: z.string().min(1, "Por favor, indique como nos conheceu"),
  purpose: z.array(z.string()).nonempty("Selecione pelo menos uma finalidade"),
  otherPurpose: z.string().optional(),
  timeline: z.string().min(1, "Selecione um prazo"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  budget: z.string().min(1, "Selecione uma faixa de orçamento"),
  features: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para prosseguir",
  }),
});

export type FormValues = z.infer<typeof qualificationFormSchema>;

// Form options for select and radio inputs
export const referralOptions = [
  { value: "google", label: "Pesquisa no Google" },
  { value: "social_media", label: "Redes Sociais" },
  { value: "recommendation", label: "Recomendação" },
  { value: "advertisement", label: "Anúncio" },
  { value: "other", label: "Outro" }
];

export const purposeOptions = [
  { value: "commercial", label: "Uso Comercial (Jingle, Vinheta, etc)" },
  { value: "personal", label: "Música Personalizada (Presente, Aniversário)" },
  { value: "soundtrack", label: "Trilha Sonora (Filme, Vídeo)" },
  { value: "other", label: "Outro" }
];

export const timelineOptions = [
  { value: "urgent", label: "Urgente (menos de 7 dias)" },
  { value: "normal", label: "Normal (2-3 semanas)" },
  { value: "flexible", label: "Flexível (1-2 meses)" }
];

export const budgetOptions = [
  { value: "under_500", label: "Menos de R$ 500" },
  { value: "500_1000", label: "R$ 500 - R$ 1.000" },
  { value: "1000_2000", label: "R$ 1.000 - R$ 2.000" },
  { value: "2000_5000", label: "R$ 2.000 - R$ 5.000" },
  { value: "above_5000", label: "Acima de R$ 5.000" }
];

export const featureOptions = [
  { value: "vocals", label: "Vocais profissionais" },
  { value: "lyrics", label: "Letras personalizadas" },
  { value: "orchestra", label: "Arranjo orquestral" },
  { value: "multiple_revisions", label: "Múltiplas revisões" },
  { value: "express_delivery", label: "Entrega expressa" }
];

export const formSchema = qualificationFormSchema;
