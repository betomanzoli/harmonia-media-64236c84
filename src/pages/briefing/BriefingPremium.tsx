import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Crown, Upload, Calendar, FileText } from 'lucide-react';

interface BriefingPremiumData {
  conceito: string;
  objetivosEstrategicos: string;
  publicoAlvo: string;
  identidadeMarca: string;
  paletaEmocional: {
    primarias: string[];
    secundarias: string[];
    progressao: string;
    mensagemCentral: string;
  };
  preferenciasEsteticas: {
    estilos: string[];
    artistasReferencia: string[];
    caracteristicasSonoras: string[];
  };
  especificacoesTecnicas: {
    duracaoExata: string;
    pontosMarco: string;
    mixagemEspecial: string;
    tiposVocais: string;
    masterizacao: string;
  };
  materiaisComplementares: {
    brandBook: File | null;
    videos: string;
    scripts: string;
    historicoSonoro: string;
  };
  documentacaoRegistro: {
    nomeCompleto: string;
    cpfCnpj: string;
    dataNascimento: string;
    endereco: string;
    cep: string;
    documentos: File[];
  };
  consultoria: {
    preferenciasData: string;
    participantes: string;
    topicosDiscutir: string;
  };
}

const BriefingPremium: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefingData, setBriefingData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<BriefingPremiumData>({
    conceito: '',
    objetivosEstrategicos: '',
    publicoAlvo: '',
    identidadeMarca: '',
    paletaEmocional: {
      primarias: [],
      secundarias: [],
      progressao: '',
      mensagemCentral: ''
    },
    preferenciasEsteticas: {
      estilos: [],
      artistasReferencia: [],
      caracteristicasSonoras: []
    },
    especificacoesTecnicas: {
      duracaoExata: '',
      pontosMarco: '',
      mixagemEspecial: '',
      tiposVocais: '',
      masterizacao: ''
    },
    materiaisComplementares: {
      brandBook: null,
      videos: '',
      scripts: '',
      historicoSonoro: ''
    },
    documentacaoRegistro: {
      nomeCompleto: '',
      cpfCnpj: '',
      dataNascimento: '',
      endereco: '',
      cep: '',
      documentos: []
    },
    consultoria: {
      preferenciasData: '',
      participantes: '',
      topicosDiscutir: ''
    }
  });

  // Verificar se briefing existe e carregar dados básicos
  useEffect(() => {
    if (briefingId) {
      loadBriefingData();
    }
  }, [briefingId]);

  const loadBriefingData = async () => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .eq('id', briefingId)
        .single();

      if (error) throw error;
      setBriefingData(data);
      
      // Pre-preencher dados básicos
      if (data.client_name) {
        setFormData(prev => ({
          ...prev,
          documentacaoRegistro: {
            ...prev.documentacaoRegistro,
            nomeCompleto: data.client_name
          }
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar briefing:', error);
      toast({
        title: 'Erro',
        description: 'Briefing não encontrado ou inválido.',
        variant: 'destructive'
      });
      navigate('/');
    }
  };

  const generateProjectFromBriefing = async (briefingId: string) => {
    try {
      console.log('[DEBUG] Gerando projeto premium do briefing:', briefingId);
      
      // Buscar dados do briefing
      const { data: briefing, error: briefingError } = await supabase
        .from('briefings')
        .select('*')
        .eq('id', briefingId)
        .single();

      if (briefingError) throw briefingError;

      // Buscar ou criar cliente
      let { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', briefing.client_email)
        .single();

      if (clientError && clientError.code === 'PGRST116') {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: briefing.client_name || formData.documentacaoRegistro.nomeCompleto,
            email: briefing.client_email,
            phone: briefing.client_phone,
            company: 'Cliente harmonIA Premium',
            address: formData.documentacaoRegistro.endereco,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        client = newClient;
      }

      // Gerar ID único para o projeto
      const projectId = `P${String(Date.now()).slice(-4)}`;

      // Criar projeto premium
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `${briefing.music_purpose || 'Projeto Premium'} - ${client.name}`,
          client_id: client.id,
          briefing_id: briefingId,
          package_type: 'premium',
          status: 'active',
          description: briefing.project_description,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Gerar prévia premium com máximo de versões
      const { data: preview, error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia Premium - ${client.name}`,
          description: 'Prévia com 8 versões completas - Pacote Premium com registro na Biblioteca Nacional',
          is_active: true,
          expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 dias
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (previewError) throw previewError;

      console.log('[SUCCESS] Projeto premium criado:', { project, preview });
      return { project, preview };

    } catch (error) {
      console.error('[ERROR] Falha ao gerar projeto premium:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.conceito || !formData.documentacaoRegistro.nomeCompleto || !formData.documentacaoRegistro.cpfCnpj) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (formData.paletaEmocional.primarias.length === 0) {
        throw new Error('Selecione pelo menos uma emoção primária');
      }

      console.log('[DEBUG] Salvando briefing premium:', formData);

      // Atualizar briefing com dados detalhados
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          briefing_type: 'premium_detailed',
          detailed_data: formData,
          status: 'detailed_completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      // Gerar projeto e prévia automaticamente
      await generateProjectFromBriefing(briefingId);

      toast({
        title: 'Briefing Premium Finalizado!',
        description: 'Seu projeto premium foi criado. Nossa equipe entrará em contato para agendar a consultoria de 30 minutos.',
      });

      setTimeout(() => {
        navigate('/briefing-success');
      }, 2000);

    } catch (error) {
      console.error('[ERROR] Erro ao finalizar briefing:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível finalizar o briefing. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      updateField(field, file);
      setUploadedFiles(prev => [...prev, file]);
    }
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando briefing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Briefing Premium - Registro na Biblioteca Nacional</CardTitle>
            <CardDescription>
              O briefing mais completo com consultoria estratégica e registro legal da obra
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* SEÇÃO 1: CONCEITO E APLICAÇÃO ESTRATÉGICA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                1. Conceito e Aplicação Estratégica
              </h3>
              
              <div>
                <Label className="text-base font-medium">
                  Descrição detalhada do conceito e valores que a música deve representar *
                </Label>
                <Textarea
                  value={formData.conceito}
                  onChange={(e) => updateField('conceito', e.target.value)}
                  placeholder="Descreva profundamente o conceito, valores, missão e visão que sua música deve transmitir..."
                  maxLength={2000}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.conceito.length}/2000 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Objetivos estratégicos para a composição</Label>
                  <Textarea
                    value={formData.objetivosEstrategicos}
                    onChange={(e) => updateField('objetivosEstrategicos', e.target.value)}
                    placeholder="Ex: Criar identidade sonora memorável, aumentar reconhecimento da marca..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Público-alvo e contexto de utilização</Label>
                  <Textarea
                    value={formData.publicoAlvo}
                    onChange={(e) => updateField('publicoAlvo', e.target.value)}
                    placeholder="Descreva detalhadamente seu público e onde a música será aplicada..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Identidade da marca ou projeto que a música representará</Label>
                <Textarea
                  value={formData.identidadeMarca}
                  onChange={(e) => updateField('identidadeMarca', e.target.value)}
                  placeholder="Descreva a personalidade, valores e características da sua marca..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* SEÇÃO 2: PALETA EMOCIONAL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                2. Paleta Emocional
              </h3>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Emoções primárias (selecione até 3) *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Alegria/Euforia',
                    'Nostalgia/Melancolia',
                    'Amor/Paixão',
                    'Força/Determinação',
                    'Serenidade/Paz',
                    'Mistério/Intriga',
                    'Inovação/Modernidade',
                    'Tradição/Clássico',
                    'Luxo/Sofisticação'
                  ].map((emocao) => (
                    <label key={emocao} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.paletaEmocional.primarias.includes(emocao)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.paletaEmocional.primarias.length < 3) {
                            updateField('paletaEmocional.primarias', [...formData.paletaEmocional.primarias, emocao]);
                          } else if (!checked) {
                            updateField('paletaEmocional.primarias', formData.paletaEmocional.primarias.filter(e => e !== emocao));
                          }
                        }}
                        disabled={!formData.paletaEmocional.primarias.includes(emocao) && formData.paletaEmocional.primarias.length >= 3}
                      />
                      <span className="text-sm">{emocao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Emoções secundárias (selecione até 3)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Esperança/Otimismo',
                    'Curiosidade/Descoberta',
                    'Confiança/Segurança',
                    'Liberdade/Aventura',
                    'Intimidade/Proximidade',
                    'Grandiosidade/Épico'
                  ].map((emocao) => (
                    <label key={emocao} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.paletaEmocional.secundarias.includes(emocao)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.paletaEmocional.secundarias.length < 3) {
                            updateField('paletaEmocional.secundarias', [...formData.paletaEmocional.secundarias, emocao]);
                          } else if (!checked) {
                            updateField('paletaEmocional.secundarias', formData.paletaEmocional.secundarias.filter(e => e !== emocao));
                          }
                        }}
                        disabled={!formData.paletaEmocional.secundarias.includes(emocao) && formData.paletaEmocional.secundarias.length >= 3}
                      />
                      <span className="text-sm">{emocao}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Progressão emocional desejada</Label>
                  <Input
                    value={formData.paletaEmocional.progressao}
                    onChange={(e) => updateField('paletaEmocional.progressao', e.target.value)}
                    placeholder="Ex: Começa contemplativa e termina energética"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Mensagem central a ser transmitida</Label>
                  <Input
                    value={formData.paletaEmocional.mensagemCentral}
                    onChange={(e) => updateField('paletaEmocional.mensagemCentral', e.target.value)}
                    placeholder="Ex: Inovação com tradição"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: PREFERÊNCIAS ESTÉTICAS COMPLETAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                3. Preferências Estéticas Completas
              </h3>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Estilos musicais preferidos (para as 8 propostas diferentes)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Pop contemporâneo',
                    'Rock progressivo',
                    'MPB sofisticada',
                    'Eletrônica ambient',
                    'Jazz fusion',
                    'Orquestral/Sinfônico',
                    'World music',
                    'Hip hop instrumental',
                    'Bossa nova moderna'
                  ].map((estilo) => (
                    <label key={estilo} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.preferenciasEsteticas.estilos.includes(estilo)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateField('preferenciasEsteticas.estilos', [...formData.preferenciasEsteticas.estilos, estilo]);
                          } else {
                            updateField('preferenciasEsteticas.estilos', formData.preferenciasEsteticas.estilos.filter(e => e !== estilo));
                          }
                        }}
                      />
                      <span className="text-sm">{estilo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Características sonoras específicas
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Orgânico/acústico',
                    'Eletrônico/processado',
                    'Híbrido',
                    'Minimalista',
                    'Orquestral',
                    'Experimental'
                  ].map((caracteristica) => (
                    <label key={caracteristica} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.preferenciasEsteticas.caracteristicasSonoras.includes(caracteristica)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateField('preferenciasEsteticas.caracteristicasSonoras', [...formData.preferenciasEsteticas.caracteristicasSonoras, caracteristica]);
                          } else {
                            updateField('preferenciasEsteticas.caracteristicasSonoras', formData.preferenciasEsteticas.caracteristicasSonoras.filter(e => e !== caracteristica));
                          }
                        }}
                      />
                      <span className="text-sm">{caracteristica}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: ESPECIFICAÇÕES TÉCNICAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                4. Especificações Técnicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Duração exata necessária</Label>
                  <Input
                    value={formData.especificacoesTecnicas.duracaoExata}
                    onChange={(e) => updateField('especificacoesTecnicas.duracaoExata', e.target.value)}
                    placeholder="Ex: 3:42 minutos"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Pontos de marcação específicos</Label>
                  <Input
                    value={formData.especificacoesTecnicas.pontosMarco}
                    onChange={(e) => updateField('especificacoesTecnicas.pontosMarco', e.target.value)}
                    placeholder="Ex: Crescendo aos 1:30, mudança aos 2:15"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Necessidades de mixagem especiais</Label>
                <Textarea
                  value={formData.especificacoesTecnicas.mixagemEspecial}
                  onChange={(e) => updateField('especificacoesTecnicas.mixagemEspecial', e.target.value)}
                  placeholder="Descreva necessidades específicas de mixagem, equalização, efeitos..."
                  className="min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Tipos de vocais específicos</Label>
                  <Input
                    value={formData.especificacoesTecnicas.tiposVocais}
                    onChange={(e) => updateField('especificacoesTecnicas.tiposVocais', e.target.value)}
                    placeholder="Ex: Coral, solo feminino, vocoder"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Masterização para plataformas específicas</Label>
                  <Input
                    value={formData.especificacoesTecnicas.masterizacao}
                    onChange={(e) => updateField('especificacoesTecnicas.masterizacao', e.target.value)}
                    placeholder="Ex: Spotify, cinema, broadcast"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 5: MATERIAIS COMPLEMENTARES */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                5. Materiais Complementares
              </h3>
              
              <div>
                <Label className="text-base font-medium">Brand book ou guia de marca (upload)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="text-sm text-gray-600">Clique para fazer upload do brand book</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'materiaisComplementares.brandBook')}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Vídeos ou conteúdos para sincronização</Label>
                  <Textarea
                    value={formData.materiaisComplementares.videos}
                    onChange={(e) => updateField('materiaisComplementares.videos', e.target.value)}
                    placeholder="Cole links ou descreva vídeos onde a música será sincronizada..."
                    className="min-h-[60px]"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Scripts ou textos relacionados</Label>
                  <Textarea
                    value={formData.materiaisComplementares.scripts}
                    onChange={(e) => updateField('materiaisComplementares.scripts', e.target.value)}
                    placeholder="Scripts, roteiros ou textos que podem inspirar a composição..."
                    className="min-h-[60px]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Histórico de comunicação sonora anterior</Label>
                <Textarea
                  value={formData.materiaisComplementares.historicoSonoro}
                  onChange={(e) => updateField('materiaisComplementares.historicoSonoro', e.target.value)}
                  placeholder="Descreva músicas ou sons que já foram usados na marca/projeto..."
                  className="min-h-[60px]"
                />
              </div>
            </div>

            {/* SEÇÃO 6: DOCUMENTAÇÃO PARA REGISTRO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                6. Documentação para Registro na Biblioteca Nacional
              </h3>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Registro Legal da Obra</span>
                </div>
                <p className="text-sm text-purple-700">
                  Sua música será registrada oficialmente na Biblioteca Nacional, garantindo seus direitos autorais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Nome completo como deve aparecer no registro *</Label>
                  <Input
                    value={formData.documentacaoRegistro.nomeCompleto}
                    onChange={(e) => updateField('documentacaoRegistro.nomeCompleto', e.target.value)}
                    placeholder="Nome completo do autor"
                    required
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">CPF/CNPJ *</Label>
                  <Input
                    value={formData.documentacaoRegistro.cpfCnpj}
                    onChange={(e) => updateField('documentacaoRegistro.cpfCnpj', e.target.value)}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-base font-medium">Data de nascimento</Label>
                  <Input
                    type="date"
                    value={formData.documentacaoRegistro.dataNascimento}
                    onChange={(e) => updateField('documentacaoRegistro.dataNascimento', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">CEP</Label>
                  <Input
                    value={formData.documentacaoRegistro.cep}
                    onChange={(e) => updateField('documentacaoRegistro.cep', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Endereço completo</Label>
                  <Input
                    value={formData.documentacaoRegistro.endereco}
                    onChange={(e) => updateField('documentacaoRegistro.endereco', e.target.value)}
                    placeholder="Rua, número, bairro, cidade, estado"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 7: AGENDAMENTO DA CONSULTORIA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">
                7. Agendamento da Consultoria de 30 Minutos
              </h3>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Consultoria Estratégica Exclusiva</span>
                </div>
                <p className="text-sm text-purple-700">
                  Sessão personalizada para alinhar todos os detalhes estratégicos da sua composição.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Preferências de data e horário</Label>
                  <Textarea
                    value={formData.consultoria.preferenciasData}
                    onChange={(e) => updateField('consultoria.preferenciasData', e.target.value)}
                    placeholder="Ex: Terças e quintas pela manhã, qualquer dia após 14h..."
                    className="min-h-[60px]"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Participantes que devem ser incluídos</Label>
                  <Input
                    value={formData.consultoria.participantes}
                    onChange={(e) => updateField('consultoria.participantes', e.target.value)}
                    placeholder="Ex: Diretor de marketing, sócio..."
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Tópicos específicos a serem discutidos</Label>
                <Textarea
                  value={formData.consultoria.topicosDiscutir}
                  onChange={(e) => updateField('consultoria.topicosDiscutir', e.target.value)}
                  placeholder="Temas ou questões específicas que gostaria de abordar na consultoria..."
                  className="min-h-[60px]"
                />
              </div>
            </div>

            {/* RESUMO PREMIUM */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Resumo do seu Pacote Premium:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✅ 1 música personalizada estratégica</li>
                  <li>✅ 8 versões completas (5 principais + 3 extras)</li>
                  <li>✅ Registro oficial na Biblioteca Nacional</li>
                  <li>✅ Consultoria estratégica de 30 minutos</li>
                </ul>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✅ Direitos totais e exclusivos da obra</li>
                  <li>✅ Masterização profissional premium</li>
                  <li>✅ Entrega em até 10 dias úteis</li>
                  <li>✅ Suporte VIP durante todo o processo</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg"
              disabled={isSubmitting || !formData.conceito || !formData.documentacaoRegistro.nomeCompleto || !formData.documentacaoRegistro.cpfCnpj || formData.paletaEmocional.primarias.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Finalizar Briefing Premium
                </>
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Nossa equipe VIP entrará em contato em até 12h para agendar sua consultoria estratégica.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BriefingPremium;
