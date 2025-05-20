
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Client, Project } from '../types';

const formSchema = z.object({
  client_id: z.string().min(1, { message: "Selecione um cliente" }),
  project_id: z.string().min(1, { message: "Selecione um projeto" }),
  description: z.string().optional(),
  amount: z.string().min(1, { message: "Informe o valor" }),
  due_date: z.string().min(1, { message: "Selecione a data de vencimento" }),
});

export type FormValues = z.infer<typeof formSchema>;

interface CreateInvoiceFormProps {
  clients: Client[];
  projects: Project[];
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({
  clients,
  projects,
  onSubmit,
  onCancel
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      project_id: "",
      description: "",
      amount: "",
      due_date: new Date().toISOString().split('T')[0],
    },
  });

  const [filteredProjects, setFilteredProjects] = React.useState<Project[]>([]);

  // Filter projects when client changes
  useEffect(() => {
    const clientId = form.watch("client_id");
    if (clientId) {
      const clientProjects = projects.filter(p => p.client_id === clientId);
      setFilteredProjects(clientProjects);
      
      // Reset project selection if the current selection is not for this client
      const currentProjectId = form.watch("project_id");
      const projectBelongsToClient = clientProjects.some(p => p.id === currentProjectId);
      if (currentProjectId && !projectBelongsToClient) {
        form.setValue("project_id", "");
      }
    } else {
      setFilteredProjects([]);
      form.setValue("project_id", "");
    }
  }, [form.watch("client_id"), projects, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projeto</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!form.watch("client_id")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={form.watch("client_id") ? "Selecione um projeto" : "Primeiro selecione o cliente"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_projects" disabled>
                      {form.watch("client_id") ? "Cliente sem projetos" : "Selecione um cliente primeiro"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
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
                  placeholder="Descrição da fatura"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input placeholder="0,00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input type="date" {...field} />
                  <Calendar className="ml-2 h-4 w-4 text-gray-500" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit">Criar Fatura</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateInvoiceForm;
