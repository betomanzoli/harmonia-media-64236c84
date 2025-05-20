
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.object({
    fullNumber: z.string(),
    countryCode: z.string(),
    nationalNumber: z.string().min(10, { message: "Telefone deve ter pelo menos 10 caracteres" })
  }),
  packageType: z.string(),
  description: z.string().optional(),
});

export type BriefingFormValues = z.infer<typeof formSchema>;

interface UseCreateBriefingFormProps {
  onSubmit: (data: BriefingFormValues) => void;
  initialData?: any;
}

export const useCreateBriefingForm = ({ onSubmit, initialData }: UseCreateBriefingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BriefingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: {
        fullNumber: '+55',
        countryCode: '55',
        nationalNumber: initialData?.phone?.nationalNumber || ''
      },
      packageType: 'essencial',
      description: initialData?.description || initialData?.inspiration || '',
    },
  });

  const handleSubmit = async (data: BriefingFormValues, submitCallback?: (data: BriefingFormValues) => Promise<void>) => {
    setIsSubmitting(true);
    
    try {
      // Garantir que o telefone esteja formatado corretamente
      const formattedData = {
        ...data,
        phone: {
          ...data.phone,
          // Garantir que fullNumber tenha o formato internacional
          fullNumber: data.phone.fullNumber.startsWith('+') 
            ? data.phone.fullNumber 
            : `+${data.phone.countryCode}${data.phone.nationalNumber}`
        }
      };
      
      if (submitCallback) {
        await submitCallback(formattedData);
      } else {
        await onSubmit(formattedData);
      }
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit
  };
};
