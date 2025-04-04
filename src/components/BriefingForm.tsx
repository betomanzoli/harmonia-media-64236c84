
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, X, Upload } from "lucide-react";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const BriefingForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      contactPreference: "whatsapp",
      occasion: "",
      style: "",
      story: "",
      selectedPackage: "",
      referenceDescription: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setReferenceFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data to include files
      const formDataToSend = {
        ...data,
        referenceFilesCount: referenceFiles.length,
      };
      
      console.log("Form data to be sent:", formDataToSend);
      console.log("Reference files:", referenceFiles);
      
      // Simulate successful submission
      setTimeout(() => {
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Entraremos em contato em breve para discutir seu projeto musical.",
        });
        
        form.reset();
        setReferenceFiles([]);
        setIsSubmitting(false);
        
        // Simulate Zapier/Make.com automation flow
        console.log("Zapier automation: Creating Trello card for new project");
        console.log("Zapier automation: Initiating Suno AI music generation task");
        console.log("Zapier automation: Scheduling Moises mastering task");
        
        // If contactPreference is whatsapp, open WhatsApp
        if (data.contactPreference === "whatsapp" && data.phone) {
          const phoneNumber = data.phone.replace(/\D/g, '');
          const message = `Olá! Acabo de enviar um briefing para a harmonIA. Meu nome é ${data.name} e gostaria de criar uma música para ${data.occasion}. Aguardo contato!`;
          window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar seu briefing. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h3 className="text-xl font-semibold mb-6">Formulário de Briefing</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Dados pessoais */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu e-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="contactPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferência de contato</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma forma de contato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp (resposta em até 2h)</SelectItem>
                    <SelectItem value="email">E-mail (resposta em até 24h)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {/* Informações do projeto */}
          <FormField
            control={form.control}
            name="selectedPackage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pacote de interesse</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pacote desejado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="essencial">Pacote Essencial - R$219</SelectItem>
                    <SelectItem value="profissional">Pacote Profissional - R$479</SelectItem>
                    <SelectItem value="premium">Pacote Premium - R$969</SelectItem>
                    <SelectItem value="personalizado">Pacote Personalizado (a consultar)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Você pode ver os detalhes dos pacotes <a href="/pacotes" className="text-harmonia-green underline">aqui</a>
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual é a ocasião?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma ocasião" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                    <SelectItem value="presente">Presente</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual estilo musical você prefere?</FormLabel>
                <FormControl>
                  <Input placeholder="Ex.: MPB, pop, instrumental etc" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="story"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conte sua história ou objetivo</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o que você imagina para sua música, incluindo emoções, momentos especiais ou qualquer detalhe que considere importante." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Quanto mais detalhes você fornecer, melhor poderemos entender sua visão.
                </FormDescription>
              </FormItem>
            )}
          />
          
          {/* Referências */}
          <div className="space-y-4 border border-border p-4 rounded-md">
            <FormField
              control={form.control}
              name="referenceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referências (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explique por que as referências são importantes para a composição da sua música e como elas se relacionam com o resultado que você espera." 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                accept="audio/*,image/*,video/*,application/pdf"
              />
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={openFileDialog}
              >
                <Upload className="w-4 h-4 mr-2" /> 
                Anexar arquivos de referência
              </Button>
              
              <div className="text-xs text-gray-400 mt-2">
                Aceita imagens, áudios, vídeos e PDFs. (Tamanho máximo: 10MB por arquivo)
              </div>
              
              {referenceFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Arquivos anexados:</p>
                  <ul className="space-y-2">
                    {referenceFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                        <div className="flex items-center">
                          <File className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Briefing"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BriefingForm;
