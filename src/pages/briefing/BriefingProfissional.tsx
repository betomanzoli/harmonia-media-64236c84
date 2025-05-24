
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { briefingStorage } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Music, FileText } from 'lucide-react';

interface BriefingProfissionalForm {
  projectName: string;
  musicGenre: string;
  mood: string;
  tempo: string;
  duration: string;
  lyrics: string;
  references: string;
  specificInstruments: string;
  avoidElements: string;
  commercialUse: string;
  targetAudience: string;
  distributionPlatforms: string;
  additionalNotes: string;
}

const BriefingProfissional: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BriefingProfissionalForm>();

  useEffect(() => {
    if (!briefingId) {
      toast({
        title: "Erro",
        description: "ID do briefing não encontrado. Redirecionando...",
        variant: "destructive"
      });
      navigate('/briefing');
      return;
    }

    const data = briefingStorage.getBriefingData(briefingId);
    if (!data) {
      toast({
        title: "Dados não encontrados",
        description: "Dados do briefing não encontrados. Redirecionando...",
        variant: "destructive"
      });
      navigate('/briefing');
      return;
    }

    if (data.paymentStatus !== 'paid') {
      toast({
        title: "Pagamento pendente",
        description: "O pagamento precisa ser confirmado antes de prosseguir.",
        variant: "destructive"
      });
      navigate(`/pagamento/profissional?briefing=${briefingId}`);
      return;
    }

    setBriefingData(data);

    const savedFormData = localStorage.getItem(`briefing_detailed_${briefingId}`);
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      Object.keys(formData).forEach(key => {
        setValue(key as keyof BriefingProfissionalForm, formData[key]);
      });
    }
  }, [briefingId, navigate, toast, setValue]);

  const formData = watch();
  useEffect(() => {
    if (briefingId && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`briefing_detailed_${briefingId}`, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, briefingId]);

  const onSubmit = async (data: BriefingProfissionalForm) => {
    if (!briefingId || !briefingData) return;

    setIsLoading(true);

    try {
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `${data.projectName} - ${briefingData.clientName}`,
          description: data.additionalNotes || briefingData.projectDescription,
          status: 'active',
          client_id: null,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (projectError) {
        console.error('Erro ao criar projeto:', projectError);
        throw new Error('Erro ao criar projeto');
      }

      const { error: briefingError } = await supabase
        .from('briefings')
        .insert({
          id: briefingId,
          package_type: 'profissional',
          status: 'completed',
          data: {
            ...briefingData,
            detailedBriefing: data,
            projectId: projectId
          },
          project_id: projectId,
          completed_at: new Date().toISOString()
        });

      if (briefingError) {
        console.error('Erro ao salvar briefing:', briefingError);
      }

      localStorage.removeItem(`briefing_detailed_${briefingId}`);
      briefingStorage.clearBriefingData(briefingId);

      toast({
        title: "Briefing enviado com sucesso!",
        description: "Seu projeto foi criado e nossa equipe começará a trabalhar em breve.",
      });

      navigate('/briefing-success');

    } catch (error) {
      console.error('Erro ao enviar briefing:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar briefing. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Music className="h-16 w-16 text-harmonia-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Briefing Detalhado - Pacote Profissional
            </h1>
            <p className="text-gray-600">
              Detalhes completos para sua música com qualidade profissional
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Nome:</strong> {briefingData.clientName}</p>
                  <p><strong>Email:</strong> {briefingData.email}</p>
                </div>
                <div>
                  <p><strong>Pacote:</strong> Profissional</p>
                  <p><strong>Status:</strong> Pagamento Confirmado ✅</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Projeto</CardTitle>
                  <CardDescription>
                    Detalhes básicos sobre sua música
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Nome do Projeto/Música *</Label>
                    <Input
                      id="projectName"
                      {...register('projectName', { required: 'Nome do projeto é obrigatório' })}
                      placeholder="Ex: Música Comercial para Campanha"
                    />
                    {errors.projectName && (
                      <p className="text-sm text-red-600 mt-1">{errors.projectName.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="musicGenre">Gênero Musical *</Label>
                      <Select onValueChange={(value) => setValue('musicGenre', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="acoustic">Acústico</SelectItem>
                          <SelectItem value="electronic">Eletrônico</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Clássico</SelectItem>
                          <SelectItem value="folk">Folk</SelectItem>
                          <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                          <SelectItem value="r&b">R&B</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mood">Clima/Mood *</Label>
                      <Select onValueChange={(value) => setValue('mood', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o clima" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="happy">Alegre</SelectItem>
                          <SelectItem value="romantic">Romântico</SelectItem>
                          <SelectItem value="calm">Calmo</SelectItem>
                          <SelectItem value="energetic">Energético</SelectItem>
                          <SelectItem value="melancholic">Melancólico</SelectItem>
                          <SelectItem value="uplifting">Inspirador</SelectItem>
                          <SelectItem value="dramatic">Dramático</SelectItem>
                          <SelectItem value="mysterious">Misterioso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tempo">Tempo/BPM</Label>
                      <Select onValueChange={(value) => setValue('tempo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Lento (60-80 BPM)</SelectItem>
                          <SelectItem value="medium">Médio (80-120 BPM)</SelectItem>
                          <SelectItem value="fast">Rápido (120-140 BPM)</SelectItem>
                          <SelectItem value="very-fast">Muito Rápido (140+ BPM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duração Desejada</Label>
                      <Select onValueChange={(value) => setValue('duration', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-3min">2-3 minutos</SelectItem>
                          <SelectItem value="3-4min">3-4 minutos</SelectItem>
                          <SelectItem value="4-5min">4-5 minutos</SelectItem>
                          <SelectItem value="5min+">Mais de 5 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes Criativos</CardTitle>
                  <CardDescription>
                    Informações sobre a composição e estilo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lyrics">Letra ou Conceito</Label>
                    <Textarea
                      id="lyrics"
                      {...register('lyrics')}
                      placeholder="Descreva o conceito, tema ou letra da música..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="references">Referências Musicais</Label>
                    <Textarea
                      id="references"
                      {...register('references')}
                      placeholder="Cite músicas, artistas ou álbuns que sirvam de referência..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specificInstruments">Instrumentos Específicos</Label>
                      <Input
                        id="specificInstruments"
                        {...register('specificInstruments')}
                        placeholder="Ex: violão, sintetizador, cordas..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="avoidElements">Elementos a Evitar</Label>
                      <Input
                        id="avoidElements"
                        {...register('avoidElements')}
                        placeholder="Instrumentos ou estilos que NÃO devem estar..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso Comercial</CardTitle>
                  <CardDescription>
                    Informações sobre como a música será utilizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="commercialUse">Tipo de Uso Comercial</Label>
                    <Select onValueChange={(value) => setValue('commercialUse', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de uso" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social-media">Redes Sociais</SelectItem>
                        <SelectItem value="advertising">Publicidade</SelectItem>
                        <SelectItem value="events">Eventos</SelectItem>
                        <SelectItem value="podcast">Podcast/Vídeo</SelectItem>
                        <SelectItem value="streaming">Plataformas de Streaming</SelectItem>
                        <SelectItem value="multiple">Múltiplos Usos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Público-Alvo</Label>
                    <Input
                      id="targetAudience"
                      {...register('targetAudience')}
                      placeholder="Ex: jovens adultos, empresários, famílias..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="distributionPlatforms">Plataformas de Distribuição</Label>
                    <Input
                      id="distributionPlatforms"
                      {...register('distributionPlatforms')}
                      placeholder="Ex: Instagram, YouTube, Spotify, rádio..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="additionalNotes">Observações Especiais</Label>
                    <Textarea
                      id="additionalNotes"
                      {...register('additionalNotes')}
                      placeholder="Qualquer informação adicional relevante para o projeto..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate(`/pagamento/profissional?briefing=${briefingId}`)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando Briefing...
                    </>
                  ) : (
                    'Enviar Briefing Completo'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BriefingProfissional;
