
import { z } from 'zod';

// Define the invoice form schema
export const invoiceFormSchema = z.object({
  client_id: z.string().min(1, { message: "Cliente é obrigatório" }),
  project_id: z.string().optional(),
  description: z.string().min(3, { message: "Descrição é obrigatória" }),
  amount: z.string().min(1, { message: "Valor é obrigatório" }),
  due_date: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
});

// Export the type derived from the schema
export type FormValues = z.infer<typeof invoiceFormSchema>;
