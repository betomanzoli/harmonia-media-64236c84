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
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface BriefingEssencialData {
  historia: string;
  emocoes: string[];
  estiloMusical: string;
  artistasReferencia: string;
  andamento: string;
  fraseEspecifica: string;
  duracao: string;
  tipoVocal: string;
  nomeCompleto: string;
  cpf: string;
  materiaisApoio?: File[];
}

const BriefingEssencial: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const [formData, setFormData] = useState<BriefingEssencialData>({
    historia: '',
    emocoes: [],
    estiloMusical: '',
    artistasReferencia: '',
    andamento: '',
    fraseEspecifica: '',
    duracao: '',
    tipoVocal: '',
    nomeCompleto: '',
    cpf: '',
    materiaisApoio: []
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
      // Pre-preencher nome se disponível
      if (data.client_name) {
        setFormData(prev => ({
          ...prev,
          nomeCompleto: data.client_name
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
      console.log('[DEBUG] Gerando projeto do briefing:', briefingId);
      
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
        // Cliente não existe, criar novo
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: briefing.client_name || formData.nomeCompleto,
            email: briefing.client_email,
            phone: briefing.client_phone,
            company: 'Cliente harmonIA',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        client = newClient;
      }

      // Gerar ID único para o projeto
      const projectId = `P${String(Date.now()).slice(-4)}`;

      // Criar projeto
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `${briefing.music_purpose || 'Música Personalizada'} - ${client.name}`,
          client_id: client.id,
          briefing_id: briefingId,
          package_type: briefing.selected_package || 'essencial',
          status: 'active',
          description: briefing.project_description,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Gerar prévia automaticamente
      const { data: preview, error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia - ${client.name}`,
          description: 'Prévia musical gerada automaticamente',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (previewError) throw previewError;

      console.log('[SUCCESS] Projeto e prévia criados:', { project, preview });
      return { project, preview };

    } catch (error) {
      console.error('[ERROR] Falha ao gerar projeto:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Validações
      if (!formData.historia || !formData.nomeCompleto || !formData.cpf) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (formData.emocoes.length === 0) {
        throw new Error('Selecione pelo menos uma emoção');
      }

      console.log('[DEBUG] Salvando briefing detalhado Essencial:', formData);

      // Atualizar briefing com dados detalhados
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          briefing_type: 'essencial_detailed',
          detailed_data: formData,
          status: 'detailed_completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      // Gerar projeto e prévia automaticamente
      await generateProjectFromBriefing(briefingId);

      toast({
        title: 'Briefing Finalizado!',
        description: 'Seu projeto foi criado e nossa equipe já começou a trabalhar na sua música.',
      });

      // Aguardar 2 segundos e redirecionar
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

  const updateField = (field: keyof BriefingEssencialData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Briefing Detalhado - Pacote Essencial</CardTitle>
            <CardDescription>
              Agora vamos detalhar sua música personalizada para criar algo único e especial
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* SEÇÃO 1: HISTÓRIA OU CONCEITO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                1. História ou Conceito
              </h3>
              
              <div>
                <Label className="text-base font-medium">
                  Descreva detalhadamente a história ou conceito que deseja transformar em música *
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Conte-nos sobre o momento, pessoa ou sentimento que inspirou este projeto
                </p>
                <Textarea
                  value={formData.historia}
                  onChange={(e) => updateField('historia', e.target.value)}
                  placeholder="Ex: Quero uma música para minha esposa no nosso aniversário de 10 anos. Ela sempre amou MPB e temos muitas memórias com Caetano Veloso tocando..."
                  maxLength={1000}
                  className="min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.historia.length}/1000 caracteres
                </p>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Quais emoções principais você gostaria que a música transmitisse? (Selecione até 3) *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Alegria/Celebração',
                    'Nostalgia/Saudade', 
                    'Amor/Romance',
                    'Superação/Força',
                    'Reflexão/Introspecção',
                    'Amizade/Conexão'
                  ].map((emocao) => (
                    <label key={emocao} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.emocoes.includes(emocao)}
                        onCheckedChange={(checked) => {
                          if (checked && formData.emocoes.length < 3) {
                            updateField('emocoes', [...formData.emocoes, emocao]);
                          } else if (!checked) {
                            updateField('emocoes', formData.emocoes.filter(e => e !== emocao));
                          }
                        }}
                        disabled={!formData.emocoes.includes(emocao) && formData.emocoes.length >= 3}
                      />
                      <span className="text-sm">{emocao}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formData.emocoes.length}/3 emoções selecionadas
                </p>
              </div>
            </div>

            {/* SEÇÃO 2: PREFERÊNCIAS MUSICAIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                2. Preferências Musicais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Estilo musical preferido</Label>
                  <Select onValueChange={(value) => updateField('estiloMusical', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpb">MPB</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="eletronica">Eletrônica</SelectItem>
                      <SelectItem value="folk">Folk/Acústico</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="bossa_nova">Bossa Nova</SelectItem>
                      <SelectItem value="sertanejo">Sertanejo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Velocidade/andamento preferido</Label>
                  <Select onValueChange={(value) => updateField('andamento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o andamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lento">Lento e contemplativo</SelectItem>
                      <SelectItem value="medio">Médio e equilibrado</SelectItem>
                      <SelectItem value="animado">Animado e energético</SelectItem>
                      <SelectItem value="indefinido">Não tenho preferência definida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Artistas de referência (mencione até 3 que representam o estilo desejado)
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Isso nos ajuda a entender melhor o som que você tem em mente
                </p>
                <Input
                  value={formData.artistasReferencia}
                  onChange={(e) => updateField('artistasReferencia', e.target.value)}
                  placeholder="Ex: Gilberto Gil, Caetano Veloso, Maria Bethânia"
                />
              </div>
            </div>

            {/* SEÇÃO 3: ELEMENTOS ESPECÍFICOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                3. Elementos Específicos
              </h3>
              
              <div>
                <Label className="text-base font-medium">
                  A música deve incluir alguma frase ou palavra específica?
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Nome de pessoa, frase marcante, palavra especial, etc.
                </p>
                <Input
                  value={formData.fraseEspecifica}
                  onChange={(e) => updateField('fraseEspecifica', e.target.value)}
                  placeholder="Ex: 'Parabéns Ana', 'Te amo', nome específico..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">Duração aproximada desejada</Label>
                  <Select onValueChange={(value) => updateField('duracao', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curta">Curta (1-2 minutos)</SelectItem>
                      <SelectItem value="media">Média (2-3 minutos)</SelectItem>
                      <SelectItem value="longa">Longa (3-4 minutos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Preferência de vocal</Label>
                  <Select onValueChange={(value) => updateField('tipoVocal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Vocal masculino</SelectItem>
                      <SelectItem value="feminino">Vocal feminino</SelectItem>
                      <SelectItem value="sem_preferencia">Sem preferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: CERTIFICADO DIGITAL */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">
                4. Informações para Certificado Digital
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">
                    Nome completo como deve aparecer no certificado *
                  </Label>
                  <Input
                    value={formData.nomeCompleto}
                    onChange={(e) => updateField('nomeCompleto', e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">
                    CPF para emissão do certificado digital *
                  </Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => updateField('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
            </div>

            {/* RESUMO E SUBMISSÃO */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Resumo do seu Pacote Essencial:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ 1 música personalizada baseada na sua história</li>
                <li>✅ 2 versões diferentes para você escolher</li>
                <li>✅ Certificado digital de autenticidade</li>
                <li>✅ Entrega em até 5 dias úteis</li>
                <li>✅ Suporte durante todo o processo</li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              disabled={isSubmitting || !formData.historia || !formData.nomeCompleto || !formData.cpf || formData.emocoes.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                'Finalizar Briefing Essencial'
              )}
            </Button>

            <p className="text-sm text-gray-600 text-center">
              Após finalizar, nossa equipe começará imediatamente a trabalhar na sua música personalizada.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BriefingEssencial;
