
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'O nome da versão é obrigatório' }),
  description: z.string().optional(),
  audioUrl: z.string().optional(),
  recommended: z.boolean().default(false),
  final: z.boolean().default(false),
  finalVersionUrl: z.string().optional(),
  stemsUrl: z.string().optional(),
});

// Update the interface to include projectId
export interface AddVersionFormProps {
  onSubmit: (version: VersionItem) => void;
  projectStatus?: 'waiting' | 'feedback' | 'approved';
  projectId: string; // Added projectId prop as required
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ 
  onSubmit,
  projectStatus = 'waiting',
  projectId // Added to component props
}) => {
  const isApproved = projectStatus === 'approved';
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      audioUrl: '',
      recommended: false,
      final: isApproved, // Default to true for approved projects
      finalVersionUrl: '',
      stemsUrl: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const version: VersionItem = {
      id: uuidv4(),
      name: values.name,
      description: values.description || '',
      audioUrl: values.audioUrl || '',
      createdAt: new Date().toISOString(),
      dateAdded: new Date().toLocaleDateString('pt-BR'),
      recommended: values.recommended,
      final: values.final,
      finalVersionUrl: values.finalVersionUrl,
      stemsUrl: values.stemsUrl,
    };
    
    onSubmit(version);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Versão</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Versão Acústica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva esta versão para o cliente..." 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="audioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Áudio</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://drive.google.com/file/d/..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isApproved && (
          <>
            <FormField
              control={form.control}
              name="finalVersionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Versão Final</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://drive.google.com/file/d/..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stemsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL das Stems (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://drive.google.com/file/d/..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <div className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="recommended"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Marcar como Recomendada</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="final"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Versão Final</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">
          {isApproved ? 'Adicionar Versão Final' : 'Adicionar Versão'}
        </Button>
      </form>
    </Form>
  );
};

export default AddVersionForm;
