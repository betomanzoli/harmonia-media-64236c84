
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

interface BriefingEssencialForm {
  projectName: string;
  musicGenre: string;
  mood: string;
  tempo: string;
  duration: string;
  lyrics: string;
  references: string;
  specificInstruments: string;
  avoidElements: string;
  additionalNotes: string;
}

const BriefingEssencial: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BriefingEssencialForm>();

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

    // Carregar dados do briefing
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

    // Verificar se pagamento foi confirmado
    if (data.paymentStatus !== 'paid') {
      toast({
        title: "Pagamento pendente",
        description: "O pagamento precisa ser confirmado antes de prosseguir.",
        variant: "destructive"
      });
      navigate(`/pagamento/essencial?briefing=${briefingId}`);
      return;
    }

    setBriefingData(data);

    // Recuperar dados salvos se existirem
    const savedFormData = localStorage.getItem(`briefing_detailed_${briefingId}`);
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      Object.keys(formData).forEach(key => {
        setValue(key as keyof BriefingEssencialForm, formData[key]);
      });
    }
  }, [briefingId, navigate, toast, setValue]);

  // Auto-save do formulário
  const formData = watch();
  useEffect(() => {
    if (briefingId && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`briefing_detailed_${briefingId}`, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, briefingId]);

  const onSubmit = async (data: BriefingEssencialForm) => {
    if (!briefingId || !briefingData) return;

    setIsLoading(true);

    try {
      // Criar projeto no Supabase
      const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          title: `${data.projectName} - ${briefingData.clientName}`,
          description: data.additionalNotes || briefingData.projectDescription,
          status: 'active',
          client_id: null, // Será associado posteriormente quando cliente for criado
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias
        });

      if (projectError) {
        console.error('Erro ao criar projeto:', projectError);
        throw new Error('Erro ao criar projeto');
      }

      // Salvar briefing completo no Supabase
      const { error: briefingError } = await supabase
        .from('briefings')
        .insert({
          id: briefingId,
          package_type: 'essencial',
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
        // Não bloquear o fluxo se o briefing não for salvo
      }

      // Limpar dados locais
      localStorage.removeItem(`briefing_detailed_${briefingId}`);
      briefingStorage.clearBriefingData(briefingId);

      toast({
        title: "Briefing enviado com sucesso!",
        description: "Seu projeto foi criado e nossa equipe começará a trabalhar em breve.",
      });

      // Redirecionar para página de sucesso
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
              Briefing Detalhado - Pacote Essencial
            </h1>
            <p className="text-gray-600">
              Agora vamos detalhar sua música para criarmos algo único e especial
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
                  <p><strong>Pacote:</strong> Essencial</p>
                  <p><strong>Status:</strong> Pagamento Confirmado ✅</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas da Música</CardTitle>
                  <CardDescription>
                    Conte-nos sobre o nome e estilo da sua música
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Nome do Projeto/Música *</Label>
                    <Input
                      id="projectName"
                      {...register('projectName', { required: 'Nome do projeto é obrigatório' })}
                      placeholder="Ex: Música para Casamento da Ana"
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
                          <SelectItem value="ambient">Ambient</SelectItem>
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
                          <SelectItem value="nostalgic">Nostálgico</SelectItem>
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
                          <SelectItem value="1-2min">1-2 minutos</SelectItem>
                          <SelectItem value="2-3min">2-3 minutos</SelectItem>
                          <SelectItem value="3min">Aproximadamente 3 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes Musicais</CardTitle>
                  <CardDescription>
                    Informações específicas sobre a composição
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="lyrics">Letra ou Tema da Música</Label>
                    <Textarea
                      id="lyrics"
                      {...register('lyrics')}
                      placeholder="Se você tem uma letra específica ou quer que criemos baseado em um tema, descreva aqui..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="references">Referências Musicais</Label>
                    <Textarea
                      id="references"
                      {...register('references')}
                      placeholder="Cite músicas, artistas ou estilos que você gostaria que servissem de inspiração..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="specificInstruments">Instrumentos Específicos</Label>
                    <Input
                      id="specificInstruments"
                      {...register('specificInstruments')}
                      placeholder="Ex: violão, piano, violino, bateria..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="avoidElements">Elementos a Evitar</Label>
                    <Input
                      id="avoidElements"
                      {...register('avoidElements')}
                      placeholder="Instrumentos, estilos ou elementos que NÃO devem estar na música..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Observações Finais</CardTitle>
                  <CardDescription>
                    Informações adicionais importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="additionalNotes">Observações Adicionais</Label>
                    <Textarea
                      id="additionalNotes"
                      {...register('additionalNotes')}
                      placeholder="Qualquer informação adicional que possa nos ajudar a criar a música perfeita para você..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate(`/pagamento/essencial?briefing=${briefingId}`)}
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

export default BriefingEssencial;
