
import * as z from "zod";

// Define the schema for the form
export const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  referralSource: z.string().min(1, { message: "Por favor, selecione uma opção" }),
  purpose: z.array(z.string()).min(1, { message: "Selecione pelo menos uma finalidade" }),
  otherPurpose: z.string().optional(),
  timeline: z.string().min(1, { message: "Selecione um prazo" }),
  description: z.string().max(300, { message: "Descrição não pode exceder 300 caracteres" }),
  budget: z.string().min(1, { message: "Selecione uma faixa de orçamento" }),
  features: z.array(z.string()),
});

export type FormValues = z.infer<typeof formSchema>;

export const referralOptions = [
  { value: "google", label: "Google" },
  { value: "social-media", label: "Redes Sociais" },
  { value: "friend", label: "Indicação de amigo" },
  { value: "other", label: "Outro" },
];

export const purposeOptions = [
  { id: "personal-gift", label: "Presente pessoal" },
  { id: "professional-use", label: "Uso profissional" },
  { id: "corporate-use", label: "Uso corporativo" },
  { id: "other", label: "Outro" },
];

export const timelineOptions = [
  { id: "urgent", label: "Urgente (até 72h)" },
  { id: "standard", label: "Padrão (3-7 dias)" },
  { id: "flexible", label: "Flexível (mais de 7 dias)" },
];

export const budgetOptions = [
  { id: "under-200", label: "Até R$200" },
  { id: "200-500", label: "Entre R$200 e R$500" },
  { id: "above-500", label: "Acima de R$500" },
  { id: "undefined", label: "Não tenho orçamento definido" },
];

export const featureOptions = [
  { id: "simple-composition", label: "Composição musical simples" },
  { id: "multiple-versions", label: "Múltiplas versões para escolha" },
  { id: "commercial-use", label: "Possibilidade de uso comercial" },
  { id: "legal-registration", label: "Registro legal da obra" },
  { id: "full-rights", label: "Direitos totais sobre a música" },
];
