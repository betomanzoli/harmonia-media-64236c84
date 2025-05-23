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
import { ArrowLeft, Clock, Crown, Upload, FileText, CheckCircle, Calendar, Users, Award, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BriefingPremiumData {
  // Conceito e Aplicação Estratégica
  conceitoEstrategico: string;
  objetivosEstrategicos: string;
  publicoAlvo: string;
  contextoUtilizacao: string;
  identidadeMarca: string;
  
  // Paleta Emocional
  emocoesPrimarias: string[];
  emocoesSecundarias: string[];
  progressaoEmocional: string;
  mensagemCentral: string;
  
  // Preferências Estéticas Completas
  estilosPrimarios: string[];
  artistasReferenciaPorEstilo: string;
  caracteristicasSonoras: string[];
  
  // Especificações Técnicas
  duracaoExata: string;
  pontosMarcacao: string;
  necessidadesMixagem: string;
  tiposVocais: string;
  masterizacaoPlataformas: string[];
  
  // Materiais Complementares
  brandBook: string;
  videosConteudo: string;
  scriptsTextos: string;
  comunicacaoAnterior: string;
  
  // Documentação para Registro
  nomeCompletoRegistro: string;
  cpfCnpj: string;
  dataNascimento: string;
  enderecoCompleto: string;
  cep: string;
  telefoneContato: string;
  emailContato: string;
  
  // Agendamento Consultoria Obrigatória
  dataPreferida: string;
  horarioPreferido: string;
  participantesIncluir: string;
  topicosDiscutir: string;
  objetivosConsultoria: string;
}

const BriefingPremium: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const briefingId = searchParams.get('briefing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<BriefingPremiumData>({
    conceitoEstrategico: '',
    objetivosEstrategicos: '',
    publicoAlvo: '',
    contextoUtilizacao: '',
    identidadeMarca: '',
    emocoesPrimarias: [],
    emocoesSecundarias: [],
    progressaoEmocional: '',
    mensagemCentral: '',
    estilosPrimarios: [],
    artistasReferenciaPorEstilo: '',
    caracteristicasSonoras: [],
    duracaoExata: '',
    pontosMarcacao: '',
    necessidadesMixagem: '',
    tiposVocais: '',
    masterizacaoPlataformas: [],
    brandBook: '',
    videosConteudo: '',
    scriptsTextos: '',
    comunicacaoAnterior: '',
    nomeCompletoRegistro: '',
    cpfCnpj: '',
    dataNascimento: '',
    enderecoCompleto: '',
    cep: '',
    telefoneContato: '',
    emailContato: '',
    dataPreferida: '',
    horarioPreferido: '',
    participantesIncluir: '',
    topicosDiscutir: '',
    objetivosConsultoria: ''
  });

  const totalSteps = 10;

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
            nomeCompletoRegistro: data.client_name,
            emailContato: data.client_email,
            telefoneContato: data.client_phone
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

  const updateFormData = (field: keyof BriefingPremiumData, value: string | string[]) => {
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

      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `Projeto ${clientData.client_name} - Premium`,
          client_email: clientData.client_email,
          client_name: clientData.client_name,
          client_phone: clientData.client_phone,
          package_type: 'premium',
          briefing_id: briefingId,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (projectError) throw projectError;

      const { error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia Premium - ${clientData.client_name}`,
          description: 'Prévia premium com 5 propostas e direitos completos',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        });

      if (previewError) throw previewError;

      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          detailed_data: formData,
          briefing_type: 'premium_detailed',
          status: 'completed',
          project_id: projectId,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      toast({
        title: "Briefing Premium concluído!",
        description: "Projeto criado com direitos autorais completos. Nossa equipe entrará em contato para agendar a consultoria.",
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
              <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Pacote Premium
              </Badge>
              <Badge variant="outline">Direitos Completos</Badge>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Briefing Estratégico - Pacote Premium
              </h1>
              <p className="text-gray-600 text-lg">
                Olá {clientData?.client_name}! Vamos criar 5 propostas únicas com direitos autorais completos.
              </p>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">7 dias úteis</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Registro Biblioteca Nacional</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Cessão Total de Direitos</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso do Briefing Estratégico</span>
                <span>{currentStep} de {totalSteps}</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            </div>
          </div>

          <Card className="border-border">
            <CardContent className="p-8">
              
              {/* STEP 1: Conceito e Aplicação Estratégica */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      Conceito e Aplicação Estratégica
                    </CardTitle>
                    <p className="text-gray-600">
                      Descrição estratégica completa para criação de identidade sonora única
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descrição detalhada do conceito e valores que a música deve representar *
                    </label>
                    <Textarea
                      value={formData.conceitoEstrategico}
                      onChange={(e) => updateFormData('conceitoEstrategico', e.target.value)}
                      placeholder="Descreva profundamente o conceito, missão, valores e essência que a música deve capturar..."
                      maxLength={2000}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.conceitoEstrategico.length}/2000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Objetivos estratégicos para a composição *
                    </label>
                    <Textarea
                      value={formData.objetivosEstrategicos}
                      onChange={(e) => updateFormData('objetivosEstrategicos', e.target.value)}
                      placeholder="Ex: Criar identidade sonora memorável, transmitir autoridade no mercado, conectar emocionalmente com audiência..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Público-alvo e contexto de utilização *
                    </label>
                    <Textarea
                      value={formData.contextoUtilizacao}
                      onChange={(e) => updateFormData('contextoUtilizacao', e.target.value)}
                      placeholder="Descreva detalhadamente onde, quando e como a música será utilizada..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Identidade da marca ou projeto que a música representará
                    </label>
                    <Textarea
                      value={formData.identidadeMarca}
                      onChange={(e) => updateFormData('identidadeMarca', e.target.value)}
                      placeholder="Personalidade da marca, tom de comunicação, posicionamento no mercado..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Paleta Emocional */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Paleta Emocional Avançada</CardTitle>
                    <p className="text-gray-600">
                      Mapeamento detalhado das emoções e progressão emocional desejada
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Emoções primárias (selecione até 3) *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Confiança/Autoridade',
                        'Inovação/Vanguarda',
                        'Elegância/Sofisticação',
                        'Força/Determinação',
                        'Inspiração/Elevação',
                        'Proximidade/Humanidade',
                        'Excelência/Premium',
                        'Transformação/Evolução',
                        'Segurança/Estabilidade'
                      ].map((emocao) => (
                        <label key={emocao} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.emocoesPrimarias.includes(emocao)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (formData.emocoesPrimarias.length < 3) {
                                  updateFormData('emocoesPrimarias', [...formData.emocoesPrimarias, emocao]);
                                }
                              } else {
                                updateFormData('emocoesPrimarias', formData.emocoesPrimarias.filter(e => e !== emocao));
                              }
                            }}
                          />
                          <span className="text-sm">{emocao}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Emoções secundárias (selecione até 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Nostalgia/Memórias',
                        'Alegria/Celebração',
                        'Mistério/Intriga',
                        'Calma/Serenidade',
                        'Energia/Dinamismo',
                        'Reflexão/Contemplação',
                        'Urgência/Ação',
                        'Harmonia/Equilíbrio',
                        'Aventura/Descoberta'
                      ].map((emocao) => (
                        <label key={emocao} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.emocoesSecundarias.includes(emocao)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (formData.emocoesSecundarias.length < 3) {
                                  updateFormData('emocoesSecundarias', [...formData.emocoesSecundarias, emocao]);
                                }
                              } else {
                                updateFormData('emocoesSecundarias', formData.emocoesSecundarias.filter(e => e !== emocao));
                              }
                            }}
                          />
                          <span className="text-sm">{emocao}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Progressão emocional desejada
                    </label>
                    <Textarea
                      value={formData.progressaoEmocional}
                      onChange={(e) => updateFormData('progressaoEmocional', e.target.value)}
                      placeholder="Ex: Começa contemplativa e introspectiva, evolui para confiante e determinada, termina inspiradora e elevada"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensagem central a ser transmitida *
                    </label>
                    <Input
                      value={formData.mensagemCentral}
                      onChange={(e) => updateFormData('mensagemCentral', e.target.value)}
                      placeholder="A mensagem principal que a música deve comunicar"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Preferências Estéticas Completas */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Preferências Estéticas Completas</CardTitle>
                    <p className="text-gray-600">
                      Direcionamento estético detalhado para as 5 propostas
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Estilos musicais preferidos (para as 5 propostas diferentes) - selecione até 5 *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Cinematic/Épico',
                        'Neo-classical',
                        'Ambient/Atmosférico',
                        'Corporate/Institucional',
                        'Jazz contemporâneo',
                        'Electronic/Synthwave',
                        'World Music/Étnico',
                        'Post-rock/Instrumental',
                        'Orquestral moderno',
                        'Acoustic/Orgânico',
                        'Experimental/Avant-garde',
                        'Minimalista/Drone'
                      ].map((estilo) => (
                        <label key={estilo} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.estilosPrimarios.includes(estilo)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                if (formData.estilosPrimarios.length < 5) {
                                  updateFormData('estilosPrimarios', [...formData.estilosPrimarios, estilo]);
                                }
                              } else {
                                updateFormData('estilosPrimarios', formData.estilosPrimarios.filter(e => e !== estilo));
                              }
                            }}
                          />
                          <span className="text-sm">{estilo}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.estilosPrimarios.length}/5 estilos selecionados
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Artistas de referência para cada estilo
                    </label>
                    <Textarea
                      value={formData.artistasReferenciaPorEstilo}
                      onChange={(e) => updateFormData('artistasReferenciaPorEstilo', e.target.value)}
                      placeholder="Ex: Para Cinematic: Hans Zimmer, John Williams; Para Ambient: Brian Eno, Tim Hecker..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Características sonoras específicas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Orgânico/acústico',
                        'Eletrônico/digital',
                        'Híbrido/fusão',
                        'Minimalista/clean',
                        'Orquestral/sinfônico',
                        'Textural/camadas',
                        'Rítmico/percussivo',
                        'Melódico/temático',
                        'Harmônico/complexo',
                        'Espacial/reverberante',
                        'Íntimo/close',
                        'Grandiose/épico'
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

              {/* STEP 4: Especificações Técnicas */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Especificações Técnicas Avançadas</CardTitle>
                    <p className="text-gray-600">
                      Requisitos técnicos específicos para produção profissional
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Duração exata necessária *
                      </label>
                      <Input
                        value={formData.duracaoExata}
                        onChange={(e) => updateFormData('duracaoExata', e.target.value)}
                        placeholder="Ex: 3:45 ou 2:30-3:00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tipos de vocais específicos
                      </label>
                      <Input
                        value={formData.tiposVocais}
                        onChange={(e) => updateFormData('tiposVocais', e.target.value)}
                        placeholder="Ex: Vocal feminino etéreo, coro masculino"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pontos de marcação específicos (para sincronização)
                    </label>
                    <Textarea
                      value={formData.pontosMarcacao}
                      onChange={(e) => updateFormData('pontosMarcacao', e.target.value)}
                      placeholder="Ex: Clímax em 2:15, momento reflexivo em 1:30, build-up final aos 3:00"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Necessidades de mixagem especiais
                    </label>
                    <Textarea
                      value={formData.necessidadesMixagem}
                      onChange={(e) => updateFormData('necessidadesMixagem', e.target.value)}
                      placeholder="Ex: Espacialização estéreo específica, compressão dinâmica, EQ customizada"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Masterização para plataformas específicas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Streaming (Spotify, Apple)',
                        'YouTube/Video',
                        'Rádio/Broadcast',
                        'Cinema/TV',
                        'Vinilo/Alta qualidade',
                        'Podcast/Narração',
                        'Games/Interativo',
                        'Eventos/PA',
                        'Mobile/Apps'
                      ].map((plataforma) => (
                        <label key={plataforma} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={formData.masterizacaoPlataformas.includes(plataforma)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData('masterizacaoPlataformas', [...formData.masterizacaoPlataformas, plataforma]);
                              } else {
                                updateFormData('masterizacaoPlataformas', formData.masterizacaoPlataformas.filter(p => p !== plataforma));
                              }
                            }}
                          />
                          <span className="text-sm">{plataforma}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Materiais Complementares */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Upload className="w-5 h-5 text-yellow-600" />
                      Materiais Complementares
                    </CardTitle>
                    <p className="text-gray-600">
                      Documentação adicional para compreensão estratégica completa
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brand book ou guia de marca (descreva ou forneça link)
                    </label>
                    <Textarea
                      value={formData.brandBook}
                      onChange={(e) => updateFormData('brandBook', e.target.value)}
                      placeholder="Descrição do brand book, guidelines visuais, tom de voz da marca..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vídeos ou conteúdos para sincronização
                    </label>
                    <Textarea
                      value={formData.videosConteudo}
                      onChange={(e) => updateFormData('videosConteudo', e.target.value)}
                      placeholder="Links ou descrição de conteúdos audiovisuais existentes..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scripts ou textos relacionados
                    </label>
                    <Textarea
                      value={formData.scriptsTextos}
                      onChange={(e) => updateFormData('scriptsTextos', e.target.value)}
                      placeholder="Roteiros, copy, textos institucionais relacionados ao projeto..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Histórico de comunicação sonora anterior
                    </label>
                    <Textarea
                      value={formData.comunicacaoAnterior}
                      onChange={(e) => updateFormData('comunicacaoAnterior', e.target.value)}
                      placeholder="Músicas utilizadas anteriormente, trilhas sonoras da marca, identidades sonoras existentes..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Documentação para Registro Legal */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-600" />
                      Documentação para Registro na Biblioteca Nacional
                    </CardTitle>
                    <p className="text-gray-600">
                      Informações completas para registro legal da obra
                    </p>
                  </CardHeader>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-yellow-800 mb-2">🏛️ Registro Oficial</h4>
                    <p className="text-sm text-yellow-700">
                      Providenciaremos o registro da letra da sua música na Biblioteca Nacional 
                      em seu nome, garantindo precedência legal da obra.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome completo como deve aparecer no registro *
                      </label>
                      <Input
                        value={formData.nomeCompletoRegistro}
                        onChange={(e) => updateFormData('nomeCompletoRegistro', e.target.value)}
                        placeholder="Nome completo oficial"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        CPF ou CNPJ *
                      </label>
                      <Input
                        value={formData.cpfCnpj}
                        onChange={(e) => updateFormData('cpfCnpj', e.target.value)}
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Data de nascimento *
                      </label>
                      <Input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        CEP *
                      </label>
                      <Input
                        value={formData.cep}
                        onChange={(e) => updateFormData('cep', e.target.value)}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Endereço completo *
                    </label>
                    <Input
                      value={formData.enderecoCompleto}
                      onChange={(e) => updateFormData('enderecoCompleto', e.target.value)}
                      placeholder="Rua, número, complemento, bairro, cidade, estado"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telefone de contato *
                      </label>
                      <Input
                        value={formData.telefoneContato}
                        onChange={(e) => updateFormData('telefoneContato', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email de contato *
                      </label>
                      <Input
                        type="email"
                        value={formData.emailContato}
                        onChange={(e) => updateFormData('emailContato', e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Agendamento da Consultoria Obrigatória */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      Agendamento da Consultoria de 30 Minutos
                    </CardTitle>
                    <p className="text-gray-600">
                      Sessão obrigatória de alinhamento estratégico
                    </p>
                  </CardHeader>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Consultoria Estratégica Premium
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Inclusa no seu pacote: uma consultoria de 30 minutos com nosso diretor musical 
                      para alinhar estratégia, esclarecer dúvidas e garantir que sua música atenda 
                      perfeitamente aos objetivos do projeto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Data preferencial para consultoria *
                      </label>
                      <Input
                        type="date"
                        value={formData.dataPreferida}
                        onChange={(e) => updateFormData('dataPreferida', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Horário preferido *
                      </label>
                      <Select onValueChange={(value) => updateFormData('horarioPreferido', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                          <SelectItem value="17:00">17:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Participantes que devem ser incluídos
                    </label>
                    <Input
                      value={formData.participantesIncluir}
                      onChange={(e) => updateFormData('participantesIncluir', e.target.value)}
                      placeholder="Ex: Sócio, diretor de marketing, equipe criativa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tópicos específicos a serem discutidos *
                    </label>
                    <Textarea
                      value={formData.topicosDiscutir}
                      onChange={(e) => updateFormData('topicosDiscutir', e.target.value)}
                      placeholder="Ex: Alinhamento com identidade da marca, aplicações específicas, cronograma detalhado"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Objetivos principais da consultoria
                    </label>
                    <Textarea
                      value={formData.objetivosConsultoria}
                      onChange={(e) => updateFormData('objetivosConsultoria', e.target.value)}
                      placeholder="O que você espera esclarecer ou definir durante a consultoria..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 8: Revisão Completa */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-600" />
                      Revisão Final - Pacote Premium
                    </CardTitle>
                    <p className="text-gray-600">
                      Revisão completa antes da finalização
                    </p>
                  </CardHeader>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                      <h4 className="font-medium mb-4 text-yellow-800">📋 Resumo do Briefing Premium:</h4>
                      <div className="text-sm space-y-2 text-gray-700">
                        <p><strong>Conceito estratégico:</strong> {formData.conceitoEstrategico.substring(0, 150)}...</p>
                        <p><strong>Emoções primárias:</strong> {formData.emocoesPrimarias.join(', ')}</p>
                        <p><strong>Estilos selecionados:</strong> {formData.estilosPrimarios.join(', ')}</p>
                        <p><strong>Duração:</strong> {formData.duracaoExata}</p>
                        <p><strong>Plataformas de masterização:</strong> {formData.masterizacaoPlataformas.join(', ')}</p>
                        <p><strong>Consultoria agendada:</strong> {formData.dataPreferida} às {formData.horarioPreferido}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        O que você receberá no Pacote Premium:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="text-sm space-y-1 text-green-700">
                          <li>✅ 5 propostas de conceito/estilo únicos</li>
                          <li>✅ 3 revisões completas incluídas</li>
                          <li>✅ Masterização profissional manual</li>
                          <li>✅ Stems completos separados</li>
                          <li>✅ Registro na Biblioteca Nacional</li>
                        </ul>
                        <ul className="text-sm space-y-1 text-green-700">
                          <li>✅ Consultoria estratégica de 30 min</li>
                          <li>✅ Certificado com registro blockchain</li>
                          <li>✅ Cessão total de direitos autorais</li>
                          <li>✅ Suporte prioritário</li>
                          <li>✅ Entrega em até 7 dias úteis</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">📞 Próximos Passos:</h4>
                      <ol className="text-sm space-y-1 text-blue-700">
                        <li>1. Nossa equipe entrará em contato em até 4 horas para agendar a consultoria</li>
                        <li>2. Realizaremos a consultoria estratégica conforme agendado</li>
                        <li>3. Iniciaremos a produção das 5 propostas musicais</li>
                        <li>4. Entregaremos as propostas para sua avaliação</li>
                        <li>5. Realizaremos as revisões necessárias</li>
                        <li>6. Finalizaremos com masterização profissional e registro legal</li>
                      </ol>
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
                          ? 'bg-yellow-500'
                          : i + 1 < currentStep
                          ? 'bg-yellow-400'
                          : 'bg-gray-300'
                      }`}
                      onClick={() => goToStep(i + 1)}
                    />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={() => goToStep(currentStep + 1)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                    disabled={
                      (currentStep === 1 && (!formData.conceitoEstrategico || !formData.objetivosEstrategicos)) ||
                      (currentStep === 2 && (formData.emocoesPrimarias.length === 0 || !formData.mensagemCentral)) ||
                      (currentStep === 3 && formData.estilosPrimarios.length === 0) ||
                      (currentStep === 4 && !formData.duracaoExata) ||
                      (currentStep === 6 && (!formData.nomeCompletoRegistro || !formData.cpfCnpj || !formData.enderecoCompleto)) ||
                      (currentStep === 7 && (!formData.dataPreferida || !formData.horarioPreferido || !formData.topicosDiscutir))
                    }
                  >
                    Próximo →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Finalizando...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Crown className="w-4 h-4 mr-2" />
                        Finalizar Briefing Premium ✅
                      </div>
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

export default BriefingPremium;
