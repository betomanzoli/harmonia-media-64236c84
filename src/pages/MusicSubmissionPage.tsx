
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MusicSubmissionFormData {
  name: string;
  email: string;
  phone: string;
  musicTitle: string;
  musicType: string;
  comments: string;
}

const MusicSubmissionPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<MusicSubmissionFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: MusicSubmissionFormData) => {
    if (!audioFile) {
      toast({
        title: "Arquivo obrigatório",
        description: "Por favor, faça upload do seu arquivo de áudio.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload the audio file to storage
      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      // Create a custom upload handler to track progress
      const { error: uploadError, data: fileData } = await supabase.storage
        .from('music-submissions')
        .upload(filePath, audioFile);

      // Update progress after upload completes
      setUploadProgress(100);

      if (uploadError) {
        throw new Error('Erro ao fazer upload do arquivo');
      }

      // 2. Save submission data to database
      const { error: dbError } = await supabase
        .from('music_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          music_title: data.musicTitle,
          music_type: data.musicType,
          comments: data.comments,
          file_path: filePath,
          status: 'new'
        });

      if (dbError) {
        throw new Error('Erro ao salvar os dados');
      }

      setShowSuccess(true);
      
      toast({
        title: "Submissão enviada com sucesso!",
        description: "Recebemos seu material e entraremos em contato em breve."
      });

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua música. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/aac'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, envie um arquivo de áudio nos formatos MP3, WAV, OGG ou AAC.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 30MB)
      if (file.size > 30 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é de 30MB.",
          variant: "destructive"
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submissão Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Obrigado por compartilhar sua música conosco. Nossa equipe irá avaliar seu material e responderemos em breve.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Voltar ao Início
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Envie Sua Música</h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Compartilhe sua composição conosco para avaliação, feedback profissional ou possível inclusão em nosso portfólio.
          </p>
        </div>

        <Card className="p-6 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input 
                  id="name"
                  {...register("name", { required: "Nome é obrigatório" })}
                  placeholder="Seu nome"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido"
                      }
                    })}
                    placeholder="seu@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone"
                    {...register("phone")}
                    placeholder="(00) 00000-0000"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="musicTitle">Título da música *</Label>
                <Input 
                  id="musicTitle"
                  {...register("musicTitle", { required: "Título da música é obrigatório" })}
                  placeholder="Nome da sua composição"
                  disabled={isSubmitting}
                />
                {errors.musicTitle && <p className="text-red-500 text-sm mt-1">{errors.musicTitle.message}</p>}
              </div>

              <div>
                <Label className="mb-2 block">Tipo de música *</Label>
                <RadioGroup defaultValue="original">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="original" 
                        id="original" 
                        {...register("musicType")} 
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="original" className="cursor-pointer">Composição original</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="cover" 
                        id="cover" 
                        {...register("musicType")} 
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="cover" className="cursor-pointer">Cover/Versão</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="instrumental" 
                        id="instrumental" 
                        {...register("musicType")} 
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="instrumental" className="cursor-pointer">Instrumental/Beat</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="upload" className="mb-2 block">Arquivo de áudio *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Input 
                    id="upload"
                    type="file"
                    accept=".mp3,.wav,.ogg,.aac"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  
                  <label htmlFor="upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-harmonia-green">Clique para selecionar</span> ou arraste e solte
                      </div>
                      <p className="text-xs text-gray-500">
                        MP3, WAV, OGG ou AAC (max. 30MB)
                      </p>
                    </div>
                  </label>
                  
                  {audioFile && (
                    <div className="mt-4 py-2 px-3 bg-gray-50 rounded text-sm flex items-center">
                      <svg className="h-5 w-5 text-harmonia-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      {audioFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comentários adicionais</Label>
                <Textarea
                  id="comments"
                  {...register("comments")}
                  rows={4}
                  placeholder="Compartilhe mais informações sobre sua música, o conceito por trás dela, ou instruções específicas..."
                  disabled={isSubmitting}
                  className="resize-none"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadProgress > 0 ? `Enviando... ${uploadProgress}%` : 'Enviando...'}
                </span>
              ) : 'Enviar Música'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MusicSubmissionPage;
