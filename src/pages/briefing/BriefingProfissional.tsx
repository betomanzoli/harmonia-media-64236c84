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
import { ArrowLeft, CheckCircle, Calendar, Phone } from 'lucide-react';

interface BriefingProfissionalData {
  historia: string;
  proposito: string;
  estilosDesejados: string[];
  detalhamentoTecnico: {
    tempo: string;
    instrumentos: string;
    estrutura: string;
    duracao: string;
  };
  referencias: {
    links: string[];
    artistas: string;
    exemplosConteudo: string;
  };
  usoComercial: {
    plataformas: string;
    publicoAlvo: string;
    monetizacao: string;
  };
  agendamento: {
    disponibilidade: string;
    melhorHorario: string;
  };
}

const BriefingProfissional: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const [formData, setFormData] = useState<BriefingProfissionalData>({
    historia: '',
    proposito: '',
    estilosDesejados: [],
    detalhamentoTecnico: {
      tempo: '',
      instrumentos: '',
      estrutura: '',
      duracao: ''
    },
    referencias: {
      links: ['', '', ''],
      artistas: '',
      exemplosConteudo: ''
    },
    usoComercial: {
      plataformas: '',
      publicoAlvo: '',
      monetizacao: ''
    },
    agendamento: {
      disponibilidade: '',
      melhorHorario: ''
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
      console.log('[DEBUG] Gerando projeto profissional do briefing:', briefingId);
      
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
            name: briefing.client_name,
            email: briefing.client_email,
            phone: briefing.client_phone,
            company: 'Cliente harmonIA Pro',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        client = newClient;
      }

      // Gerar ID único para o projeto
      const projectId = `P${String(Date.now()).slice(-4)}`;

      // Criar projeto profissional
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `${briefing.music_purpose || 'Projeto Profissional'} - ${client.name}`,
          client_id: client.id,
          briefing_id: briefingId,
          package_type: 'profissional',
          status: 'active',
          description: briefing.project_description,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Gerar prévia com mais versões
      const { data: preview, error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia Profissional - ${client.name}`,
          description: 'Prévia com 5 versões para escolha - Pacote Profissional',
          is_active: true,
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (previewError) throw previewError;

      console.log('[SUCCESS] Projeto profissional criado:', { project, preview });
      return { project, preview };

    } catch (error) {
      console.error('[ERROR] Falha ao gerar projeto profissional:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.historia || !formData.proposito) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (formData.estilosDesejados.length === 0) {
        throw new Error('Selecione pelo menos um estilo musical');
      }

      console.log('[DEBUG] Salvando briefing profissional:', formData);

      // Atualizar briefing com dados detalhados
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          briefing_type: 'profissional_detailed',
          detailed_data: formData,
          status: 'detailed_completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      // Gerar projeto e prévia automaticamente
      await generateProjectFromBriefing(briefingId);

      toast({
        title: 'Briefing Profissional Finalizado!',
        description: 'Seu projeto foi criado. Nossa equipe entrará em contato para agendar a chamada de alinhamento.',
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

  const updateArrayField = (field: string, index: number, value: string) => {
    const [parent, child] = field.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: prev[parent][child].map((item, i) => i === index ? value : item)
      }
    }));
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Briefing Detalhado - Pacote Profissional</CardTitle>
            <CardDescription>
              Vamos criar sua identidade sonora profissional com múltiplas versões e uso comercial liberado
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* SEÇÃO 1: HISTÓRIA E CONCEITO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                1. História e Conceito
              </h3>
              
              <div>
                <Label className="text-base font-medium">
                  Descreva detalhadamente a história, marca ou conceito que deseja transformar em música *
                </Label>
                <Textarea
                  value={formData.historia}
                  onChange={(e) => updateField('historia', e.target.value)}
                  placeholder="Descreva seu projeto, marca, conteúdo ou conceito que será representado pela música..."
                  maxLength={1500}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.historia.length}/1500 caracteres
                </p>
              </div>

              <div>
                <Label className="text-base font-medium">Qual o propósito principal desta música? *</Label>
                <Select onValueChange={(value) => updateField('proposito', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o propósito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identidade">Identidade sonora para marca/conteúdo</SelectItem>
                    <SelectItem value="trilha">Trilha para vídeo/podcast</SelectItem>
                    <SelectItem value="monetizacao">Conteúdo para monetização</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SEÇÃO 2: PREFERÊNCIAS ESTILÍSTICAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                2. Preferências Estilísticas
              </h3>
              
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Estilos musicais desejados (selecione até 3 para criarmos diferentes versões) *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Pop contemporâneo',
                    'Rock alternativo',
                    'MPB/Bossa Nova',
                    'Eletrônica/Lo-fi',
                    'Hip Hop/Trap',
                    'Folk/Acústico',
                    'Jazz/Blues',
                    'Sertanejo Moderno',
                    'Funk/Soul'
                  ].map((estilo) => (
                    <label key={estilo} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.estilosDesejados.includes(estilo)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.estilosDesejados.length < 3) {
                            updateField('estilosDesejados', [...formData.estilosDesejados, estilo]);
                          } else if (!checked) {
                            updateField('estilosDesejados', formData.estilosDesejados.filter(e => e !== estilo));
                          }
                        }}
                        disabled={!formData.estilosDesejados.includes(estilo) && formData.estilosDesejados.length >= 3}
                      />
                      <span className="text-sm">{estilo}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.estilosDesejados.length}/3 estilos selecionados
                </p>
              </div>
            </div>

            {/* SEÇÃO 3: DETALHAMENTO TÉCNICO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                3. Detalhamento Técnico
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Tempo/BPM aproximado (se tiver preferência)</Label>
                  <Input
                    value={formData.detalhamentoTecnico.tempo}
                    onChange={(e) => updateField('detalhamentoTecnico.tempo', e.target.value)}
                    placeholder="Ex: 120 BPM, moderado, rápido..."
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Duração específica necessária</Label>
                  <Input
                    value={formData.detalhamentoTecnico.duracao}
                    onChange={(e) => updateField('detalhamentoTecnico.duracao', e.target.value)}
                    placeholder="Ex: 2:30 minutos, 3 minutos..."
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Instrumentos que você gostaria de destacar</Label>
                <Input
                  value={formData.detalhamentoTecnico.instrumentos}
                  onChange={(e) => updateField('detalhamentoTecnico.instrumentos', e.target.value)}
                  placeholder="Ex: Piano, guitarra, violão, bateria, cordas..."
                />
              </div>

              <div>
                <Label className="text-base font-medium">Estrutura preferida</Label>
                <Select onValueChange={(value) => updateField('detalhamentoTecnico.estrutura', value)}>
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
            </div>

            {/* SEÇÃO 4: REFERÊNCIAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                4. Referências
              </h3>
              
              <div>
                <Label className="text-base font-medium">Links para músicas de referência (até 3)</Label>
                <p className="text-sm text-gray-600 mb-2">Cole os links do YouTube, Spotify ou outras plataformas</p>
                {formData.referencias.links.map((link, index) => (
                  <Input
                    key={index}
                    value={link}
                    onChange={(e) => updateArrayField('referencias.links', index, e.target.value)}
                    placeholder={`Link de referência ${index + 1}`}
                    className="mb-2"
                  />
                ))}
              </div>

              <div>
                <Label className="text-base font-medium">Artistas que considera importantes como inspiração</Label>
                <Input
                  value={formData.referencias.artistas}
                  onChange={(e) => updateField('referencias.artistas', e.target.value)}
                  placeholder="Ex: Coldplay, Marisa Monte, John Mayer..."
                />
              </div>

              <div>
                <Label className="text-base font-medium">Exemplos de conteúdo onde a música será aplicada</Label>
                <Textarea
                  value={formData.referencias.exemplosConteudo}
                  onChange={(e) => updateField('referencias.exemplosConteudo', e.target.value)}
                  placeholder="Descreva ou cole links de vídeos, podcasts, posts onde a música será usada..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* SEÇÃO 5: REQUISITOS PARA USO COMERCIAL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                5. Requisitos para Uso Comercial
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Plataformas onde a música será utilizada</Label>
                  <Input
                    value={formData.usoComercial.plataformas}
                    onChange={(e) => updateField('usoComercial.plataformas', e.target.value)}
                    placeholder="YouTube, Instagram, TikTok, Spotify..."
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Público-alvo do seu conteúdo</Label>
                  <Input
                    value={formData.usoComercial.publicoAlvo}
                    onChange={(e) => updateField('usoComercial.publicoAlvo', e.target.value)}
                    placeholder="Ex: Jovens 18-30, empresários, mães..."
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Necessidades específicas para monetização</Label>
                <Textarea
                  value={formData.usoComercial.monetizacao}
                  onChange={(e) => updateField('usoComercial.monetizacao', e.target.value)}
                  placeholder="Ex: Precisa ser copyright-free, será usada em anúncios pagos, vendas de produtos..."
                  className="min-h-[60px]"
                />
              </div>
            </div>

            {/* SEÇÃO 6: AGENDAMENTO DE CHAMADA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
                6. Agendamento de Chamada (Opcional)
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Chamada de Alinhamento - 15 minutos</span>
                </div>
                <p className="text-sm text-blue-700">
                  Nossa equipe pode agendar uma chamada rápida para alinhar detalhes e tirar dúvidas sobre seu projeto.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Disponibilidade para chamada</Label>
                  <Select onValueChange={(value) => updateField('agendamento.disponibilidade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã (8h-12h)</SelectItem>
                      <SelectItem value="tarde">Tarde (12h-18h)</SelectItem>
                      <SelectItem value="noite">Noite (18h-22h)</SelectItem>
                      <SelectItem value="flexivel">Horário flexível</SelectItem>
                      <SelectItem value="nao_desejo">Não desejo chamada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Melhor horário para contato</Label>
                  <Input
                    value={formData.agendamento.melhorHorario}
                    onChange={(e) => updateField('agendamento.melhorHorario', e.target.value)}
                    placeholder="Ex: Segunda às 14h, qualquer dia de manhã..."
                  />
                </div>
              </div>
            </div>

            {/* RESUMO E SUBMISSÃO */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Resumo do seu Pacote Profissional:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ 1 música personalizada com identidade profissional</li>
                <li>✅ 5 versões diferentes para escolha</li>
                <li>✅ Uso comercial 100% liberado</li>
                <li>✅ Chamada de alinhamento de 15 minutos</li>
                <li>✅ Entrega em até 7 dias úteis</li>
                <li>✅ Suporte especializado durante todo o processo</li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              disabled={isSubmitting || !formData.historia || !formData.proposito || formData.estilosDesejados.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                'Finalizar Briefing Profissional'
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Nossa equipe entrará em contato em até 24h para agendar a chamada de alinhamento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BriefingProfissional;
