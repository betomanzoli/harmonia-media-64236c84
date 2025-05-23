
import * as z from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .email("Email inválido")
  .min(5, "Email deve ter pelo menos 5 caracteres")
  .max(255, "Email não pode ter mais de 255 caracteres");

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .max(100, "Senha não pode ter mais de 100 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número");

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(100, "Nome não pode ter mais de 100 caracteres");

// Phone validation schema
export const phoneSchema = z
  .string()
  .min(8, "Telefone deve ter pelo menos 8 dígitos")
  .max(20, "Telefone não pode ter mais de 20 dígitos");

// Basic login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// User profile schema
export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
});

// Project schema
export const projectSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  client: z.string().min(3, "Nome do cliente deve ter pelo menos 3 caracteres"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().optional(),
});

// Briefing schema
export const briefingSchema = z.object({
  client_name: nameSchema,
  client_email: emailSchema,
  client_phone: phoneSchema.optional(),
  package_type: z.enum(["essencial", "profissional", "premium"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  created_at: z.string().optional(),
  responses: z.record(z.any()).optional(),
});

// Preview feedback schema
export const previewFeedbackSchema = z.object({
  projectId: z.string().min(1, "ID do projeto é obrigatório"),
  versionId: z.string().min(1, "ID da versão é obrigatório"),
  status: z.enum(["feedback", "approved"], {
    message: "Status inválido"
  }),
  comments: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

// System settings schema
export const systemSettingsSchema = z.object({
  siteName: z.string().min(3, "Nome do site deve ter pelo menos 3 caracteres"),
  contactEmail: emailSchema,
  enableNotifications: z.boolean(),
  defaultPackage: z.enum(["essencial", "profissional", "premium"]),
  maintenanceMode: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type BriefingFormData = z.infer<typeof briefingSchema>;
export type PreviewFeedbackData = z.infer<typeof previewFeedbackSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;
