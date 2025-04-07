
import * as z from "zod";
import { QualificationData } from "@/types/qualification";

// Define the form schema
export const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome precisa ter pelo menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido",
  }),
  phone: z.string().min(10, {
    message: "Insira um número de telefone válido",
  }),
  referralSource: z.string().min(1, {
    message: "Por favor, indique como nos conheceu",
  }),
  purpose: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um propósito",
  }),
  otherPurpose: z.string().optional(),
  timeline: z.string().min(1, {
    message: "Selecione uma linha do tempo",
  }),
  description: z.string().min(20, {
    message: "Por favor, descreva seu projeto em pelo menos 20 caracteres",
  }),
  budget: z.string().min(1, {
    message: "Selecione uma faixa de orçamento",
  }),
  features: z.array(z.string()),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos para continuar",
  }),
});

// Export the inferred type
export type FormValues = z.infer<typeof formSchema>;

// Define options for form selects and checkboxes
export const referralOptions = [
  { value: "google", label: "Google" },
  { value: "social_media", label: "Redes Sociais" },
  { value: "friend", label: "Indicação de amigo" },
  { value: "advertisement", label: "Publicidade" },
  { value: "other", label: "Outro" },
];

export const purposeOptions = [
  { value: "commercial", label: "Música para uso comercial" },
  { value: "personal", label: "Projeto pessoal" },
  { value: "streaming", label: "Lançamento em plataformas de streaming" },
  { value: "film", label: "Trilha sonora para vídeo/filme" },
  { value: "social_media", label: "Conteúdo para redes sociais" },
  { value: "game", label: "Trilha sonora para jogo" },
  { value: "other", label: "Outro" },
];

export const timelineOptions = [
  { value: "urgent", label: "Urgente (menos de 1 semana)" },
  { value: "standard", label: "Padrão (1-2 semanas)" },
  { value: "flexible", label: "Flexível (2-4 semanas)" },
  { value: "not_urgent", label: "Sem pressa (mais de 1 mês)" },
];

export const budgetOptions = [
  { value: "economy", label: "Até R$ 500" },
  { value: "standard", label: "R$ 500 - R$ 1.000" },
  { value: "premium", label: "R$ 1.000 - R$ 2.000" },
  { value: "custom", label: "Acima de R$ 2.000" },
];

export const featureOptions = [
  { value: "vocals", label: "Vocais" },
  { value: "acoustic_instruments", label: "Instrumentos acústicos" },
  { value: "electronic_elements", label: "Elementos eletrônicos" },
  { value: "orchestral", label: "Arranjo orquestral" },
  { value: "mixing", label: "Mixagem profissional" },
  { value: "mastering", label: "Masterização" },
  { value: "lyrics", label: "Composição de letra" },
  { value: "stems", label: "Stems separados" },
];
