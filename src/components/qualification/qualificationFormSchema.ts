
import { z } from "zod";

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
