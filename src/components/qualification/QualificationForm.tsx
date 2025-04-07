
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the schema for the form
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const referralOptions = [
  { value: "google", label: "Google" },
  { value: "social-media", label: "Redes Sociais" },
  { value: "friend", label: "Indicação de amigo" },
  { value: "other", label: "Outro" },
];

const purposeOptions = [
  { id: "personal-gift", label: "Presente pessoal" },
  { id: "professional-use", label: "Uso profissional" },
  { id: "corporate-use", label: "Uso corporativo" },
  { id: "other", label: "Outro" },
];

const timelineOptions = [
  { id: "urgent", label: "Urgente (até 72h)" },
  { id: "standard", label: "Padrão (3-7 dias)" },
  { id: "flexible", label: "Flexível (mais de 7 dias)" },
];

const budgetOptions = [
  { id: "under-200", label: "Até R$200" },
  { id: "200-500", label: "Entre R$200 e R$500" },
  { id: "above-500", label: "Acima de R$500" },
  { id: "undefined", label: "Não tenho orçamento definido" },
];

const featureOptions = [
  { id: "simple-composition", label: "Composição musical simples" },
  { id: "multiple-versions", label: "Múltiplas versões para escolha" },
  { id: "commercial-use", label: "Possibilidade de uso comercial" },
  { id: "legal-registration", label: "Registro legal da obra" },
  { id: "full-rights", label: "Direitos totais sobre a música" },
];

export function QualificationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      referralSource: "",
      purpose: [],
      otherPurpose: "",
      timeline: "",
      description: "",
      budget: "",
      features: [],
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Form data:", data);
    
    // Store form data in localStorage to use it on the thank you page
    localStorage.setItem("qualificationData", JSON.stringify(data));
    
    // Show success toast
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Obrigado pelo seu interesse. Estamos redirecionando você para a página de recomendações.",
    });
    
    // Redirect to thank you page
    setTimeout(() => {
      navigate("/agradecimento");
    }, 1500);
  }

  const showOtherPurpose = form.watch("purpose").includes("other");

  return (
    <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Qualificação Inicial</h2>
      <p className="text-gray-400 mb-8 text-center">
        Preencha este formulário para que possamos entender melhor sua necessidade musical.
        Após o envio, entraremos em contato para discutir os próximos passos.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome completo */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo*</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone/WhatsApp*</FormLabel>
                <FormControl>
                  <Input placeholder="(XX) XXXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Como conheceu */}
          <FormField
            control={form.control}
            name="referralSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como conheceu a harmonIA?*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {referralOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Finalidade da música */}
          <FormField
            control={form.control}
            name="purpose"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Finalidade da música*</FormLabel>
                  <FormDescription>Pode selecionar mais de uma opção</FormDescription>
                </div>
                {purposeOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="purpose"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Outro propósito (condicional) */}
          {showOtherPurpose && (
            <FormField
              control={form.control}
              name="otherPurpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especifique a finalidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva a finalidade da música" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Prazo necessário */}
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Prazo necessário*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {timelineOptions.map((option) => (
                      <FormItem
                        key={option.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Breve descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breve descrição do projeto*</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva brevemente o que você imagina para sua música..."
                    className="resize-none"
                    maxLength={300}
                    {...field}
                  />
                </FormControl>
                <div className="text-xs text-right text-gray-400">
                  {field.value.length}/300 caracteres
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Orçamento */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Orçamento aproximado*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {budgetOptions.map((option) => (
                      <FormItem
                        key={option.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Funcionalidades desejadas */}
          <FormField
            control={form.control}
            name="features"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Funcionalidades desejadas</FormLabel>
                  <FormDescription>Pode selecionar mais de uma opção</FormDescription>
                </div>
                {featureOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
}
