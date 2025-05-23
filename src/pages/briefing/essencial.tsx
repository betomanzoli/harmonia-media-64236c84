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
import { ArrowLeft, Clock, Heart, Upload, FileText, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface BriefingEssencialData {
  // História ou Conceito
  historia: string;
  emocoes: string[];
  
  // Preferências Musicais
  estiloMusical: string;
  artistasReferencia: string;
  andamento: string;
  
  // Elementos Específicos
  fraseEspecifica: string;
  duracao: string;
  tipoVocal: string;
  
  // Materiais de Apoio
  materiaisApoio: string;
  
  // Informações para Certificado
  nomeCompleto: string;
  cpf: string;
}

const BriefingEssencial: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const briefingId = searchParams.get('briefing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<BriefingEssencialData>({
    historia: '',
    emocoes: [],
    estiloMusical: '',
    artistasReferencia: '',
    andamento: '',
    fraseEspecifica: '',
    duracao: '',
    tipoVocal: '',
    materiaisApoio: '',
    nomeCompleto: '',
    cpf: ''
  });

  const totalSteps = 6;

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
        
        // Pré-preencher nome se disponível
        if (data.client_name) {
          setFormData(prev => ({
            ...prev,
            nomeCompleto: data.client_name
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

  // Atualizar dados do formulário
  const updateFormData = (field: keyof BriefingEssencialData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Navegar entre steps
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Finalizar briefing
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Gerar projeto automaticamente
      const projectId = `P${String(Date.now()).slice(-4)}`;

      // Criar registro do projeto
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `Projeto ${clientData.client_name} - Essencial`,
          client_email: clientData.client_email,
          client_name: clientData.client_name,
          client_phone: clientData.client_phone,
          package_type: 'essencial',
          briefing_id: briefingId,
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (projectError) throw projectError;

      // Criar prévia automaticamente
      const { error: previewError } = await supabase
        .from('previews')
        .insert({
          preview_id: projectId,
          project_id: projectId,
          title: `Prévia - ${clientData.client_name}`,
          description: 'Prévia gerada automaticamente após briefing detalhado',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
          created_at: new Date().toISOString()
        });

      if (previewError) throw previewError;

      // Atualizar briefing com dados detalhados
      const { error: updateError } = await supabase
        .from('briefings')
        .update({
          detailed_data: formData,
          briefing_type: 'essencial_detailed',
          status: 'completed',
          project_id: projectId,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (updateError) throw updateError;

      toast({
        title: "Briefing concluído com sucesso!",
        description: "Seu projeto foi criado e nossa equipe já começou a trabalhar.",
      });

      // Redirecionar para página de sucesso
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
          
          {/* Header do Briefing */}
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
                <Heart className="w-3 h-3" />
                Pacote Essencial
              </Badge>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">
                Briefing Detalhado - Pacote Essencial
              </h1>
              <p className="text-gray-600 text-lg">
                Olá {clientData?.client_name}! Agora vamos detalhar sua música personalizada.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Clock className="w-4 h-4 text-harmonia-green" />
                <span className="text-sm text-gray-600">
                  Entrega em até 72 horas úteis
                </span>
              </div>
            </div>

            {/* Progress Bar */}
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
              
              {/* STEP 1: História ou Conceito */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="w-5 h-5 text-harmonia-green" />
                      História ou Conceito
                    </CardTitle>
                    <p className="text-gray-600">
                      Conte-nos a história que você gostaria de transformar em música
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descreva detalhadamente a história ou conceito que deseja transformar em música *
                    </label>
                    <Textarea
                      value={formData.historia}
                      onChange={(e) => updateFormData('historia', e.target.value)}
                      placeholder="Conte-nos sua história... Ex: Uma música para minha esposa, falando sobre nossos 10 anos juntos, destacando momentos especiais como nossa viagem à Paris..."
                      maxLength={1000}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.historia.length}/1000 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Quais emoções principais você gostaria que a música transmitisse? (Selecione até 3)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Alegria/Celebração',
                        'Nostalgia/Saudade',
                        'Amor/Romance',
                        'Superação/Força',
                        'Reflexão/Introspecção',
                        'Amizade/Conexão'
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
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.emocoes.length}/3 emoções selecionadas
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Preferências Musicais */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Preferências Musicais</CardTitle>
                    <p className="text-gray-600">
                      Defina o estilo e características sonoras da sua música
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Estilo musical preferido *</label>
                      <Select onValueChange={(value) => updateFormData('estiloMusical', value)}>
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
                          <SelectItem value="reggae">Reggae</SelectItem>
                          <SelectItem value="blues">Blues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Velocidade/andamento preferido *</label>
                      <Select onValueChange={(value) => updateFormData('andamento', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o andamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lento">Lento e contemplativo</SelectItem>
                          <SelectItem value="medio">Médio e equilibrado</SelectItem>
                          <SelectItem value="animado">Animado e energético</SelectItem>
                          <SelectItem value="sem_preferencia">Não tenho preferência definida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Artistas de referência (mencione até 3 que representam o estilo desejado)
                    </label>
                    <Input
                      value={formData.artistasReferencia}
                      onChange={(e) => updateFormData('artistasReferencia', e.target.value)}
                      placeholder="Ex: Gilberto Gil, Caetano Veloso, Maria Bethânia"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Elementos Específicos */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Elementos Específicos</CardTitle>
                    <p className="text-gray-600">
                      Detalhes específicos sobre sua música
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      A música deve incluir alguma frase ou palavra específica?
                    </label>
                    <Input
                      value={formData.fraseEspecifica}
                      onChange={(e) => updateFormData('fraseEspecifica', e.target.value)}
                      placeholder="Ex: 'Parabéns', nome específico, frase marcante..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Duração aproximada desejada *</label>
                      <Select onValueChange={(value) => updateFormData('duracao', value)}>
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
                      <label className="block text-sm font-medium mb-2">Preferência de vocal</label>
                      <Select onValueChange={(value) => updateFormData('tipoVocal', value)}>
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
              )}

              {/* STEP 4: Materiais de Apoio */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Upload className="w-5 h-5 text-harmonia-green" />
                      Materiais de Apoio
                    </CardTitle>
                    <p className="text-gray-600">
                      Materiais opcionais que possam ajudar na inspiração
                    </p>
                  </CardHeader>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descreva ou liste qualquer material de apoio (fotos, textos, vídeos, links)
                    </label>
                    <Textarea
                      value={formData.materiaisApoio}
                      onChange={(e) => updateFormData('materiaisApoio', e.target.value)}
                      placeholder="Ex: Link para playlist do Spotify, fotos que inspiram, textos especiais, referências visuais..."
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Este campo é opcional, mas pode ajudar nossa equipe a entender melhor sua visão
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Dica</h4>
                    <p className="text-sm text-blue-700">
                      Quanto mais detalhes você fornecer, mais personalizada será sua música. 
                      Compartilhe referências, inspirações ou qualquer coisa que possa ajudar 
                      nossa equipe a capturar exatamente o que você imagina.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: Informações para Certificado */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl">Informações para Certificado Digital</CardTitle>
                    <p className="text-gray-600">
                      Dados necessários para emissão do certificado de autoria
                    </p>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome completo como deve aparecer no certificado *
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
                        CPF para emissão do certificado digital *
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
                    <h4 className="font-medium text-green-800 mb-2">🔒 Segurança e Privacidade</h4>
                    <p className="text-sm text-green-700">
                      Seus dados pessoais são protegidos conforme a LGPD e utilizados 
                      exclusivamente para emissão do certificado digital de autoria da sua música.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 6: Revisão e Finalização */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-harmonia-green" />
                      Revisão e Finalização
                    </CardTitle>
                    <p className="text-gray-600">
                      Revise suas informações antes de finalizar
                    </p>
                  </CardHeader>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">📝 Resumo do seu briefing:</h4>
                      <div className="text-sm space-y-2">
                        <p><strong>História:</strong> {formData.historia.substring(0, 100)}...</p>
                        <p><strong>Emoções:</strong> {formData.emocoes.join(', ')}</p>
                        <p><strong>Estilo:</strong> {formData.estiloMusical}</p>
                        <p><strong>Duração:</strong> {formData.duracao}</p>
                        <p><strong>Certificado:</strong> {formData.nomeCompleto}</p>
                      </div>
                    </div>

                    <div className="bg-harmonia-green/10 border border-harmonia-green/20 rounded-lg p-4">
                      <h4 className="font-medium text-harmonia-green mb-2">🎵 Próximos passos:</h4>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>✅ Nossa equipe analisará seu briefing detalhado</li>
                        <li>✅ Criaremos sua música personalizada em até 72h úteis</li>
                        <li>✅ Você receberá um email com o link para avaliação</li>
                        <li>✅ Poderá solicitar 1 revisão se necessário</li>
                        <li>✅ Receberá o certificado digital de autoria</li>
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
                      (currentStep === 1 && (!formData.historia || formData.emocoes.length === 0)) ||
                      (currentStep === 2 && (!formData.estiloMusical || !formData.andamento)) ||
                      (currentStep === 3 && !formData.duracao) ||
                      (currentStep === 5 && (!formData.nomeCompleto || !formData.cpf))
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
                      'Finalizar Briefing ✅'
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

export default BriefingEssencial;
