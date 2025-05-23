import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Music, Upload, FileText, CheckCircle, Calendar, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BriefingProfissionalData {
  // História e Conceito
  historia: string;
  propositoPrincipal: string;
  emocoes: string[];
  
  // Preferências Estilísticas
  estilosMusicais: string[];
  artistasReferencia: string;
  tempoAndamento: string;
  instrumentosDestaque: string;
  estruturaPreferida: string;
  duracaoEspecifica: string;
  
  // Detalhamento Técnico
  bpmAproximado: string;
  caracteristicasSonoras: string[];
  
  // Referências
  linksReferencia: string;
  exemploConteudo: string;
  
  // Requisitos Comerciais
  plataformasUso: string[];
  publicoAlvo: string;
  necessidadesMonetizacao: string;
  
  // Agendamento de Chamada
  desejaAgendamento: boolean;
  disponibilidadeHorario: string;
  melhorContato: string;
  topicosChamada: string;
  
  // Informações para Certificado
  nomeCompleto: string;
  cpf: string;
}

const BriefingProfissional: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const briefingId = searchParams.get('briefing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<BriefingProfissionalData>({
    historia: '',
    propositoPrincipal: '',
    emocoes: [],
    estilosMusicais: [],
    artistasReferencia: '',
    tempoAndamento: '',
    instrumentosDestaque: '',
    estruturaPreferida: '',
    duracaoEspecifica: '',
    bpmAproximado: '',
    caracteristicasSonoras: [],
    linksReferencia: '',
    exemploConteudo: '',
    plataformasUso: [],
    publicoAlvo: '',
    necessidadesMonetizacao: '',
    desejaAgendamento: false,
    disponibilidadeHorario: '',
    melhorContato: '',
    topicosChamada: '',
    nomeCompleto: '',
    cpf: ''
  });

  const totalSteps = 9;

  // Carregar dados do briefing inicial
  useEffect(() => {
    const loadBriefingData = async () => {
      if (!briefingId) {
        navigate('/briefing');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('briefings')
          .select('*')
          .eq('id', briefingId)
          .single();

        if (error) throw error;

        if (data.payment_status !== 'confirmed') {
          toast({
            title: "Pagamento não confirmado",
            description: "Você precisa confirmar o pagamento antes de continuar.",
            variant: "destructive"
          });
          navigate('/briefing');
          return;
        }

        setClientData(data);
        
        if (data.client_name) {
          setFormData(prev => ({
            ...prev,
            nomeCompleto: data.client_name,
            melhorContato: data.client_phone || data.client_email
          }));
        }

      } catch (error) {
        console.error('Erro ao carregar briefing:', error);
        navigate('/briefing');
      } finally {
        setIsLoading(false);
      }
    };

    loadBriefingData();
  }, [briefingId, navigate, toast]);

  const updateFormData = (field: keyof BriefingProfissionalData, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const projectId = `P${String(Date.now()).slice(-4)}`;

      // Criar projeto
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `Projeto ${clientData.client_name} - Profissional`,
          client_email: clientData.client_email,
          client_name: clientData.client_name,
          client_phone: clientData.client_phone,
          package_type: 'profissional',
          briefing_id: briefingId,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (projectError) throw projectError;

      // Criar prévia
      const { error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia Profissional - ${clientData.client_name}`,
          description: 'Prévia profissional com múltiplas versões',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        });

      if (previewError) throw previewError;

      // Atualizar briefing
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          detailed_data: formData,
          briefing_type: 'profissional_detailed',
          status: 'completed',
          project_id: projectId,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      toast({
        title: "Briefing Profissional concluído!",
        description: "Seu projeto foi criado com 3 propostas de estilo diferentes.",
      });

      navigate('/briefing-success');

    } catch (error) {
      console.error('Erro ao finalizar briefing:', error);
      toast({
        title: "Erro ao finalizar briefing",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p>Carregando briefing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 text-gray-400 hover:text-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Badge className="bg-harmonia-green text-white flex items-center gap-1">
                <Music className="w-3 h-3" />
                Pacote Profissional
              </Badge>
              <Badge variant="outline">Mais Popular</Badge>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                Briefing Detalhado - Pacote Profissional
              </h1>
              <p className="text-gray-600 text-lg">
                Olá {clientData?.client_name}! Vamos criar 3 propostas musicais diferentes para você.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Clock className="w-4 h-4 text-harmonia-green" />
                <span className="text-sm text-gray-600">
                  Entrega em até 5 dias úteis | Uso comercial liberado
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso do Briefing</span>
                <span>{currentStep} de {totalSteps}</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            </div>
          </div>

          <Card className="border-border">
            <CardContent className="p-8">
              
              {/* STEP 1: História e Conceito */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">História e Conceito</CardTitle>
                    <p className="text-gray-600">
                      Descreva detalhadamente sua visão musical e aplicação comercial
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descreva detalhadamente a história, marca ou conceito que deseja transformar em música *
                    </label>
                    <Textarea
                      value={formData.historia}
                      onChange={(e) => updateFormData('historia', e.target.value)}
                      placeholder="Descreva sua marca, história pessoal, propósito do conteúdo..."
                      maxLength={1500}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.historia.length}/1500 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Qual o propósito principal desta música? *
                    </label>
                    <Select onValueChange={(value) => updateFormData('propositoPrincipal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o propósito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="identidade_sonora">Identidade sonora para marca/conteúdo</SelectItem>
                        <SelectItem value="trilha_video">Trilha para vídeo/podcast</SelectItem>
                        <SelectItem value="monetizacao">Conteúdo para monetização</SelectItem>
                        <SelectItem value="marketing">Material de marketing</SelectItem>
                        <SelectItem value="apresentacao">Música para apresentações</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Emoções que a música deve transmitir (selecione até 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Confiança/Autoridade',
                        'Inovação/Modernidade',
                        'Alegria/Celebração',
                        'Nostalgia/Saudade',
                        'Motivação/Energia',
                        'Elegância/Sofisticação',
                        'Proximidade/Humanidade',
                        'Força/Determinação'
                      ].map((emocao) => (
                        <label key={emocao} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.emocoes.includes(emocao)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (formData.emocoes.length < 3) {
                                  updateFormData('emocoes', [...formData.emocoes, emocao]);
                                }
                              } else {
                                updateFormData('emocoes', formData.emocoes.filter(e => e !== emocao));
                              }
                            }}
                          />
                          <span className="text-sm">{emocao}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Preferências Estilísticas */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Preferências Estilísticas</CardTitle>
                    <p className="text-gray-600">
                      Selecione até 3 estilos para criarmos versões diferentes
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Estilos musicais desejados (selecione até 3 para diferentes versões) *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Pop contemporâneo',
                        'Rock alternativo',
                        'MPB/Bossa Nova',
                        'Eletrônica/Lo-fi',
                        'Hip Hop/Trap',
                        'Folk/Acústico',
                        'Jazz/Blues',
                        'Corporate/Institucional',
                        'Cinematic/Épico'
                      ].map((estilo) => (
                        <label key={estilo} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.estilosMusicais.includes(estilo)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (formData.estilosMusicais.length < 3) {
                                  updateFormData('estilosMusicais', [...formData.estilosMusicais, estilo]);
                                }
                              } else {
                                updateFormData('estilosMusicais', formData.estilosMusicais.filter(e => e !== estilo));
                              }
                            }}
                          />
                          <span className="text-sm">{estilo}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.estilosMusicais.length}/3 estilos selecionados
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Artistas que considera importantes como inspiração
                    </label>
                    <Input
                      value={formData.artistasReferencia}
                      onChange={(e) => updateFormData('artistasReferencia', e.target.value)}
                      placeholder="Ex: Coldplay, Ludovico Einaudi, Hans Zimmer"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Detalhamento Técnico */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Detalhamento Técnico</CardTitle>
                    <p className="text-gray-600">
                      Especificações técnicas para a produção
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tempo/BPM aproximado</label>
                      <Input
                        value={formData.bpmAproximado}
                        onChange={(e) => updateFormData('bpmAproximado', e.target.value)}
                        placeholder="Ex: 120 BPM, ou 'médio', 'lento'"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Duração específica necessária *</label>
                      <Input
                        value={formData.duracaoEspecifica}
                        onChange={(e) => updateFormData('duracaoEspecifica', e.target.value)}
                        placeholder="Ex: 2:30 minutos"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Instrumentos que você gostaria de destacar
                    </label>
                    <Input
                      value={formData.instrumentosDestaque}
                      onChange={(e) => updateFormData('instrumentosDestaque', e.target.value)}
                      placeholder="Ex: Piano, guitarra, cordas, sintetizadores"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Estrutura preferida</label>
                    <Select onValueChange={(value) => updateFormData('estruturaPreferida', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a estrutura" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tradicional">Tradicional (intro, verso, refrão, verso, refrão, bridge, refrão)</SelectItem>
                        <SelectItem value="narrativa">Narrativa (desenvolvimento contínuo)</SelectItem>
                        <SelectItem value="minimalista">Minimalista (loops com pequenas variações)</SelectItem>
                        <SelectItem value="sem_preferencia">Não tenho preferência definida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Características sonoras
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Orgânico/acústico',
                        'Eletrônico/processado',
                        'Híbrido',
                        'Minimalista',
                        'Orquestral',
                        'Ambiente/atmosférico'
                      ].map((caracteristica) => (
                        <label key={caracteristica} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.caracteristicasSonoras.includes(caracteristica)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData('caracteristicasSonoras', [...formData.caracteristicasSonoras, caracteristica]);
                              } else {
                                updateFormData('caracteristicasSonoras', formData.caracteristicasSonoras.filter(c => c !== caracteristica));
                              }
                            }}
                          />
                          <span className="text-sm">{caracteristica}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Referências */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Referências</CardTitle>
                    <p className="text-gray-600">
                      Compartilhe referências que ajudem a entender sua visão
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Links para músicas de referência (até 3)
                    </label>
                    <Textarea
                      value={formData.linksReferencia}
                      onChange={(e) => updateFormData('linksReferencia', e.target.value)}
                      placeholder="Cole aqui links do YouTube, Spotify ou outras plataformas"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Exemplos de conteúdo onde a música será aplicada
                    </label>
                    <Textarea
                      value={formData.exemploConteudo}
                      onChange={(e) => updateFormData('exemploConteudo', e.target.value)}
                      placeholder="Descreva o tipo de vídeo, podcast, apresentação onde será usada"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Requisitos para Uso Comercial */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Requisitos para Uso Comercial</CardTitle>
                    <p className="text-gray-600">
                      Informações sobre onde e como a música será utilizada
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Plataformas onde a música será utilizada *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'YouTube',
                        'Instagram',
                        'TikTok',
                        'Podcast',
                        'Site/Blog',
                        'Facebook',
                        'LinkedIn',
                        'Apresentações',
                        'Eventos corporativos'
                      ].map((plataforma) => (
                        <label key={plataforma} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.plataformasUso.includes(plataforma)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData('plataformasUso', [...formData.plataformasUso, plataforma]);
                              } else {
                                updateFormData('plataformasUso', formData.plataformasUso.filter(p => p !== plataforma));
                              }
                            }}
                          />
                          <span className="text-sm">{plataforma}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Público-alvo do seu conteúdo
                    </label>
                    <Input
                      value={formData.publicoAlvo}
                      onChange={(e) => updateFormData('publicoAlvo', e.target.value)}
                      placeholder="Ex: Empreendedores de 25-45 anos, Mães jovens, Profissionais de tecnologia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Necessidades específicas para monetização
                    </label>
                    <Textarea
                      value={formData.necessidadesMonetizacao}
                      onChange={(e) => updateFormData('necessidadesMonetizacao', e.target.value)}
                      placeholder="Explique como pretende monetizar o conteúdo que usará esta música"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Agendamento de Chamada */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-harmonia-green" />
                      Agendamento de Chamada (Opcional)
                    </CardTitle>
                    <p className="text-gray-600">
                      Disponibilidade para chamada de 15 minutos para detalhamento
                    </p>
                  </CardHeader>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">📞 Chamada de Alinhamento</h4>
                    <p className="text-sm text-blue-700">
                      Como cliente do Pacote Profissional, você tem direito a uma chamada opcional 
                      de 15 minutos para alinhar detalhes e esclarecer dúvidas sobre seu projeto.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={formData.desejaAgendamento}
                        onCheckedChange={(checked) => updateFormData('desejaAgendamento', !!checked)}
                      />
                      <span className="text-sm font-medium">
                        Sim, gostaria de agendar uma chamada de alinhamento
                      </span>
                    </label>
                  </div>

                  {formData.desejaAgendamento && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Melhor horário para contato
                        </label>
                        <Select onValueChange={(value) => updateFormData('disponibilidadeHorario', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário preferido" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manha">Manhã (8h às 12h)</SelectItem>
                            <SelectItem value="tarde">Tarde (13h às 17h)</SelectItem>
                            <SelectItem value="noite">Noite (18h às 20h)</SelectItem>
                            <SelectItem value="flexivel">Horário flexível</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Melhor forma de contato
                        </label>
                        <Input
                          value={formData.melhorContato}
                          onChange={(e) => updateFormData('melhorContato', e.target.value)}
                          placeholder="WhatsApp, telefone ou outro"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Tópicos específicos a serem discutidos
                        </label>
                        <Textarea
                          value={formData.topicosChamada}
                          onChange={(e) => updateFormData('topicosChamada', e.target.value)}
                          placeholder="Ex: Dúvidas sobre estilo, aplicação comercial, timing de entrega"
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: Certificado Digital */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Informações para Certificado Digital</CardTitle>
                    <p className="text-gray-600">
                      Dados para certificado com verificação via hash criptográfico
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome completo para o certificado *
                      </label>
                      <Input
                        value={formData.nomeCompleto}
                        onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                        placeholder="Nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        CPF para verificação *
                      </label>
                      <Input
                        value={formData.cpf}
                        onChange={(e) => updateFormData('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">🔐 Certificado Premium</h4>
                    <p className="text-sm text-green-700">
                      Seu certificado incluirá verificação via hash criptográfico, 
                      oferecendo maior segurança e autenticidade para uso comercial.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 8: Revisão e Finalização */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-harmonia-green" />
                      Revisão Final
                    </CardTitle>
                    <p className="text-gray-600">
                      Revise suas informações antes de finalizar
                    </p>
                  </CardHeader>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">📋 Resumo do seu briefing:</h4>
                      <div className="text-sm space-y-2">
                        <p><strong>Propósito:</strong> {formData.propositoPrincipal}</p>
                        <p><strong>Estilos:</strong> {formData.estilosMusicais.join(', ')}</p>
                        <p><strong>Duração:</strong> {formData.duracaoEspecifica}</p>
                        <p><strong>Plataformas:</strong> {formData.plataformasUso.join(', ')}</p>
                        <p><strong>Chamada agendada:</strong> {formData.desejaAgendamento ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>

                    <div className="bg-harmonia-green/10 border border-harmonia-green/20 rounded-lg p-4">
                      <h4 className="font-medium text-harmonia-green mb-2">🎵 O que você receberá:</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✅ 3 propostas musicais em estilos diferentes</li>
                        <li>✅ Masterização básica</li>
                        <li>✅ Stems básicos separados (voz + instrumentação)</li>
                        <li>✅ 2 revisões incluídas</li>
                        <li>✅ Certificado digital com hash criptográfico</li>
                        <li>✅ Direitos para uso comercial em plataformas digitais</li>
                        {formData.desejaAgendamento && <li>✅ Chamada de alinhamento de 15 minutos</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => goToStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  ← Anterior
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                        i + 1 === currentStep
                          ? 'bg-harmonia-green'
                          : i + 1 < currentStep
                          ? 'bg-harmonia-green/60'
                          : 'bg-gray-300'
                      }`}
                      onClick={() => goToStep(i + 1)}
                    />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={() => goToStep(currentStep + 1)}
                    className="bg-harmonia-green hover:bg-harmonia-green/90"
                    disabled={
                      (currentStep === 1 && (!formData.historia || !formData.propositoPrincipal)) ||
                      (currentStep === 2 && formData.estilosMusicais.length === 0) ||
                      (currentStep === 3 && !formData.duracaoEspecifica) ||
                      (currentStep === 5 && formData.plataformasUso.length === 0) ||
                      (currentStep === 7 && (!formData.nomeCompleto || !formData.cpf))
                    }
                  >
                    Próximo →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.nomeCompleto || !formData.cpf}
                    className="bg-harmonia-green hover:bg-harmonia-green/90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Finalizando...
                      </div>
                    ) : (
                      'Finalizar Briefing Profissional ✅'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BriefingProfissional;
