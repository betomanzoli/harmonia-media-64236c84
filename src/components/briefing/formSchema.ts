
import { z } from "zod";

// Base schema with common fields
const baseSchema = {
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  contactPreference: z.string(),
};

// Schema for Pacote Essencial
export const essentialPackageSchema = z.object({
  ...baseSchema,
  storyDescription: z.string().min(10, { message: "Descreva sua história (mínimo 10 caracteres)" }),
  emotions: z.array(z.string()).min(1, { message: "Selecione pelo menos uma emoção" }).max(3),
  otherEmotion: z.string().optional(),
  musicStyle: z.string().min(1, { message: "Selecione um estilo musical" }),
  referenceArtists: z.string().optional(),
  tempo: z.string().min(1, { message: "Selecione um andamento" }),
  specificPhrases: z.string().optional(),
  duration: z.string().min(1, { message: "Selecione a duração aproximada" }),
  vocalPreference: z.string().optional(),
  certificateName: z.string().min(2, { message: "Nome para o certificado é obrigatório" }),
  certificateCPF: z.string().min(11, { message: "CPF válido é obrigatório" }),
  referenceDescription: z.string().optional(),
});

// Schema for Pacote Profissional
export const professionalPackageSchema = z.object({
  ...baseSchema,
  storyDescription: z.string().min(10, { message: "Descreva sua história (mínimo 10 caracteres)" }),
  purpose: z.string().min(1, { message: "Selecione o propósito principal" }),
  otherPurpose: z.string().optional(),
  musicStyles: z.array(z.string()).min(1, { message: "Selecione pelo menos um estilo musical" }).max(3),
  otherMusicStyle: z.string().optional(),
  bpm: z.string().optional(),
  instruments: z.string().optional(),
  structure: z.string().min(1, { message: "Selecione uma estrutura preferida" }),
  specificDuration: z.string().optional(),
  referenceLinks: z.string().optional(),
  referenceArtists: z.string().optional(),
  contentExamples: z.string().optional(),
  platforms: z.string().optional(),
  targetAudience: z.string().optional(),
  monetizationNeeds: z.string().optional(),
  callAvailability: z.boolean().optional(),
  preferredTime: z.string().optional(),
  referenceDescription: z.string().optional(),
});

// Schema for Pacote Premium
export const premiumPackageSchema = z.object({
  ...baseSchema,
  conceptDescription: z.string().min(10, { message: "Descreva o conceito (mínimo 10 caracteres)" }),
  strategicObjectives: z.string().min(10, { message: "Descreva os objetivos estratégicos" }),
  targetAudience: z.string().min(1, { message: "Descreva o público-alvo" }),
  brandIdentity: z.string().min(1, { message: "Descreva a identidade da marca" }),
  primaryEmotions: z.array(z.string()).min(1, { message: "Selecione pelo menos uma emoção primária" }).max(3),
  secondaryEmotions: z.array(z.string()).min(1, { message: "Selecione pelo menos uma emoção secundária" }).max(3),
  emotionalProgression: z.string().optional(),
  centralMessage: z.string().min(1, { message: "Mensagem central é obrigatória" }),
  musicStyles: z.array(z.string()).min(1, { message: "Selecione pelo menos um estilo musical" }).max(5),
  referenceArtists: z.string().optional(),
  soundCharacteristics: z.array(z.string()).min(1, { message: "Selecione pelo menos uma característica sonora" }),
  otherSoundCharacteristic: z.string().optional(),
  exactDuration: z.string().optional(),
  specificMarkers: z.string().optional(),
  mixingNeeds: z.string().optional(),
  vocalTypes: z.string().optional(),
  masteringNeeds: z.string().optional(),
  // Registration information
  registrationName: z.string().min(2, { message: "Nome para registro é obrigatório" }),
  registrationCPFCNPJ: z.string().min(11, { message: "CPF/CNPJ válido é obrigatório" }),
  birthDate: z.string().min(8, { message: "Data de nascimento é obrigatória" }),
  fullAddress: z.string().min(10, { message: "Endereço completo é obrigatório" }),
  authorizesRegistration: z.boolean().refine(val => val === true, {
    message: "É necessário autorizar o registro"
  }),
  referenceDescription: z.string().optional(),
});

// Export type for each package schema
export type EssentialFormValues = z.infer<typeof essentialPackageSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalPackageSchema>;
export type PremiumFormValues = z.infer<typeof premiumPackageSchema>;

// Conditional schema based on the package type
export const briefingFormSchema = z.discriminatedUnion("selectedPackage", [
  z.object({ selectedPackage: z.literal("essencial"), ...essentialPackageSchema.shape }),
  z.object({ selectedPackage: z.literal("profissional"), ...professionalPackageSchema.shape }),
  z.object({ selectedPackage: z.literal("premium"), ...premiumPackageSchema.shape }),
]);

export type BriefingFormValues = z.infer<typeof briefingFormSchema>;
