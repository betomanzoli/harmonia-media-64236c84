
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { briefingStorage } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Music, FileText, Crown } from 'lucide-react';

interface BriefingPremiumForm {
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
  brandGuidelines: string;
  exclusivityRequirements: string;
  timelineFlexibility: string;
  consultationPreferences: string;
  additionalNotes: string;
  needsLiveInstruments: boolean;
  needsVocalProcessing: boolean;
  needsMastering: boolean;
}

const BriefingPremium: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BriefingPremiumForm>();

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
      navigate(`/pagamento/premium?briefing=${briefingId}`);
      return;
    }

    setBriefingData(data);

    const savedFormData = localStorage.getItem(`briefing_detailed_${briefingId}`);
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      Object.keys(formData).forEach(key => {
        setValue(key as keyof BriefingPremiumForm, formData[key]);
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

  const onSubmit = async (data: BriefingPremiumForm) => {
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
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (projectError) {
        console.error('Erro ao criar projeto:', projectError);
        throw new Error('Erro ao criar projeto');
      }

      const { error: briefingError } = await supabase
        .from('briefings')
        .insert({
          id: briefingId,
          package_type: 'premium',
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
        description: "Seu projeto premium foi criado. Nossa equipe entrará em contato em breve.",
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
            <Crown className="h-16 w-16 text-harmonia-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Briefing Detalhado - Pacote Premium
            </h1>
            <p className="text-gray-600">
              Experiência premium com consultoria dedicada e produção exclusiva
            </p>
          </div>

          <Card className="mb-8 border-2 border-harmonia-green/20 bg-gradient-to-r from-harmonia-green/5 to-harmonia-green/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações do Cliente Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Nome:</strong> {briefingData.clientName}</p>
                  <p><strong>Email:</strong> {briefingData.email}</p>
                </div>
                <div>
                  <p><strong>Pacote:</strong> Premium 👑</p>
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
                    Detalhes fundamentais sobre sua música premium
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Nome do Projeto/Música *</Label>
                    <Input
                      id="projectName"
                      {...register('projectName', { required: 'Nome do projeto é obrigatório' })}
                      placeholder="Ex: Tema Musical Corporativo Premium"
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
                          <SelectItem value="orchestral">Orquestral</SelectItem>
                          <SelectItem value="cinematic">Cinematográfico</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="acoustic">Acústico</SelectItem>
                          <SelectItem value="electronic">Eletrônico</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Clássico</SelectItem>
                          <SelectItem value="ambient">Ambient</SelectItem>
                          <SelectItem value="hybrid">Híbrido/Experimental</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
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
                          <SelectItem value="epic">Épico</SelectItem>
                          <SelectItem value="elegant">Elegante</SelectItem>
                          <SelectItem value="powerful">Poderoso</SelectItem>
                          <SelectItem value="inspiring">Inspirador</SelectItem>
                          <SelectItem value="sophisticated">Sofisticado</SelectItem>
                          <SelectItem value="emotional">Emocional</SelectItem>
                          <SelectItem value="triumphant">Triunfante</SelectItem>
                          <SelectItem value="mysterious">Misterioso</SelectItem>
                          <SelectItem value="luxurious">Luxuoso</SelectItem>
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
                          <SelectItem value="very-slow">Muito Lento (40-60 BPM)</SelectItem>
                          <SelectItem value="slow">Lento (60-80 BPM)</SelectItem>
                          <SelectItem value="medium">Médio (80-120 BPM)</SelectItem>
                          <SelectItem value="fast">Rápido (120-140 BPM)</SelectItem>
                          <SelectItem value="very-fast">Muito Rápido (140+ BPM)</SelectItem>
                          <SelectItem value="variable">Tempo Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duração Desejada</Label>
                      <Select onValueChange={(value) => setValue('duration', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duração personalizada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-4min">3-4 minutos</SelectItem>
                          <SelectItem value="4-5min">4-5 minutos</SelectItem>
                          <SelectItem value="5-7min">5-7 minutos</SelectItem>
                          <SelectItem value="7min+">Mais de 7 minutos</SelectItem>
                          <SelectItem value="custom">Duração personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conceito e Criatividade</CardTitle>
                  <CardDescription>
                    Visão artística e direção criativa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lyrics">Conceito, Tema ou Letra</Label>
                    <Textarea
                      id="lyrics"
                      {...register('lyrics')}
                      placeholder="Descreva o conceito profundo, narrativa ou letra específica..."
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="references">Referências Premium</Label>
                    <Textarea
                      id="references"
                      {...register('references')}
                      placeholder="Cite compositores, álbuns, trilhas sonoras ou obras específicas..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="brandGuidelines">Diretrizes de Marca (se aplicável)</Label>
                    <Textarea
                      id="brandGuidelines"
                      {...register('brandGuidelines')}
                      placeholder="Descreva valores da marca, tom de voz, identidade visual..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas Premium</CardTitle>
                  <CardDescription>
                    Detalhes técnicos para produção de alta qualidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specificInstruments">Instrumentos Específicos</Label>
                      <Textarea
                        id="specificInstruments"
                        {...register('specificInstruments')}
                        placeholder="Instrumentos específicos, orquestração, texturas..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="avoidElements">Elementos a Evitar</Label>
                      <Textarea
                        id="avoidElements"
                        {...register('avoidElements')}
                        placeholder="Qualquer elemento que não deve aparecer..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Serviços Adicionais Premium</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="needsLiveInstruments"
                          onCheckedChange={(checked) => setValue('needsLiveInstruments', !!checked)}
                        />
                        <Label htmlFor="needsLiveInstruments">
                          Gravação de instrumentos ao vivo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="needsVocalProcessing"
                          onCheckedChange={(checked) => setValue('needsVocalProcessing', !!checked)}
                        />
                        <Label htmlFor="needsVocalProcessing">
                          Processamento vocal profissional
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="needsMastering"
                          onCheckedChange={(checked) => setValue('needsMastering', !!checked)}
                        />
                        <Label htmlFor="needsMastering">
                          Masterização premium para múltiplas plataformas
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso Comercial e Distribuição</CardTitle>
                  <CardDescription>
                    Como e onde a música será utilizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="commercialUse">Tipo de Uso Comercial</Label>
                    <Select onValueChange={(value) => setValue('commercialUse', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o uso principal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporativo/Institucional</SelectItem>
                        <SelectItem value="advertising">Publicidade Premium</SelectItem>
                        <SelectItem value="film-tv">Cinema/TV</SelectItem>
                        <SelectItem value="streaming">Plataformas de Streaming</SelectItem>
                        <SelectItem value="events">Eventos Exclusivos</SelectItem>
                        <SelectItem value="brand">Identidade Sonora de Marca</SelectItem>
                        <SelectItem value="unlimited">Uso Irrestrito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Público-Alvo Detalhado</Label>
                    <Textarea
                      id="targetAudience"
                      {...register('targetAudience')}
                      placeholder="Descreva demograficamente seu público-alvo..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="distributionPlatforms">Plataformas de Distribuição</Label>
                    <Textarea
                      id="distributionPlatforms"
                      {...register('distributionPlatforms')}
                      placeholder="Todas as plataformas onde a música será distribuída..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="exclusivityRequirements">Requisitos de Exclusividade</Label>
                    <Textarea
                      id="exclusivityRequirements"
                      {...register('exclusivityRequirements')}
                      placeholder="Necessidades específicas de exclusividade ou direitos..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Consultoria e Processo</CardTitle>
                  <CardDescription>
                    Preferências para o processo de criação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="timelineFlexibility">Flexibilidade de Prazo</Label>
                    <Select onValueChange={(value) => setValue('timelineFlexibility', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sua flexibilidade de prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgente (3-5 dias)</SelectItem>
                        <SelectItem value="standard">Padrão (5-7 dias)</SelectItem>
                        <SelectItem value="flexible">Flexível (até 10 dias)</SelectItem>
                        <SelectItem value="perfectionist">Perfeccionista (sem pressa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="consultationPreferences">Preferências de Consultoria</Label>
                    <Textarea
                      id="consultationPreferences"
                      {...register('consultationPreferences')}
                      placeholder="Como prefere receber atualizações e dar feedback..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Observações Finais Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="additionalNotes">Informações Adicionais</Label>
                    <Textarea
                      id="additionalNotes"
                      {...register('additionalNotes')}
                      placeholder="Qualquer detalhe adicional que possa elevar ainda mais a qualidade do projeto..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate(`/pagamento/premium?briefing=${briefingId}`)}
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
                      Enviando Briefing Premium...
                    </>
                  ) : (
                    'Enviar Briefing Premium Completo'
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

export default BriefingPremium;
