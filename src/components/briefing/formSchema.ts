
import { z } from "zod";

export const briefingFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  contactPreference: z.string(),
  occasion: z.string().min(1, { message: "Selecione uma ocasião" }),
  style: z.string().min(1, { message: "Estilo musical é obrigatório" }),
  story: z.string().min(10, { message: "Conte um pouco da sua história (mínimo 10 caracteres)" }),
  selectedPackage: z.string().min(1, { message: "Selecione um pacote" }),
  referenceDescription: z.string().optional(),
});

export type BriefingFormValues = z.infer<typeof briefingFormSchema>;
