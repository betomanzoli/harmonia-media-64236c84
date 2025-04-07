
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
});

// Export the inferred type
export type FormValues = z.infer<typeof formSchema>;
