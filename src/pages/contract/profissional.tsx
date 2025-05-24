import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CheckCircle, Briefcase } from 'lucide-react';

const ContractProfissional: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  useEffect(() => {
    if (briefingId) {
      loadBriefingData();
    } else {
      navigate('/');
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
        description: 'Briefing não encontrado.',
        variant: 'destructive'
      });
      navigate('/');
    }
  };

  const handleAcceptContract = async () => {
    if (!isAccepted) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('briefings')
        .update({
          contract_accepted: true,
          contract_accepted_at: new Date().toISOString(),
          status: 'contract_accepted'
        })
        .eq('id', briefingId);

      if (error) throw error;

      toast({
        title: 'Contrato Aceito!',
        description: 'Redirecionando para pagamento...'
      });

      const paymentUrl = `/payment?briefing=${briefingId}&package=profissional`;
      navigate(paymentUrl);

    } catch (error) {
      console.error('Erro ao aceitar contrato:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aceitar o contrato. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando contrato...</p>
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
          Voltar ao Início
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Contrato de Prestação de Serviços - Pacote Profissional</CardTitle>
            <p className="text-gray-600 mt-2">
              Contrato para uso comercial com múltiplas versões e consulta estratégica
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Resumo do Pacote */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Resumo do Pacote Profissional - R$ 479,00
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✅ 1 música personalizada com identidade profissional</li>
                <li>✅ 5 versões diferentes para máxima flexibilidade</li>
                <li>✅ Uso comercial 100% liberado (redes sociais, monetização)</li>
                <li>✅ Consulta estratégica de 15 minutos com especialista</li>
                <li>✅ Entrega em até 7 dias úteis</li>
                <li>✅ Arquivos em MP3 e WAV de alta qualidade</li>
                <li>✅ Suporte especializado durante todo processo</li>
              </ul>
            </div>

            {/* Termos do Contrato */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TERMOS E CONDIÇÕES - PACOTE PROFISSIONAL</h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900">1. DO OBJETO</h4>
                  <p>Prestação de serviços especializados de criação musical para uso profissional e comercial, incluindo composição, produção, consulta estratégica e licenciamento comercial.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">2. DAS ESPECIFICAÇÕES DO SERVIÇO</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Criação de 1 (uma) música original profissional</li>
                    <li>Produção de 5 (cinco) versões completas e distintas</li>
                    <li>Consulta estratégica de 15 minutos via videochamada</li>
                    <li>Duração personalizada conforme briefing (2-5 minutos)</li>
                    <li>Entrega em MP3 (320kbps) e WAV (24-bit/48kHz)</li>
                    <li>Mixagem e masterização profissionais</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">3. DO LICENCIAMENTO COMERCIAL</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>USO COMERCIAL LIBERADO:</strong> YouTube, Instagram, TikTok, Spotify</li>
                    <li>Monetização em todas as plataformas digitais permitida</li>
                    <li>Uso em anúncios pagos e campanhas de marketing</li>
                    <li>Uso em podcasts, vídeos corporativos e apresentações</li>
                    <li>Sincronização com vídeos para fins comerciais</li>
                    <li>Venda de produtos/serviços com a música de fundo</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">4. DO PRAZO DE ENTREGA</h4>
                  <p>Entrega em até 7 (sete) dias úteis após conclusão do briefing detalhado, confirmação do pagamento e realização da consulta estratégica.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">5. DA CONSULTA ESTRATÉGICA</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sessão de 15 minutos via Google Meet ou WhatsApp</li>
                    <li>Alinhamento estratégico do projeto musical</li>
                    <li>Definição de diretrizes criativas específicas</li>
                    <li>Orientações sobre uso comercial da música</li>
                    <li>Agendamento flexível conforme disponibilidade</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">6. DO VALOR E FORMA DE PAGAMENTO</h4>
                  <p>Valor total: R$ 479,00 (quatrocentos e setenta e nove reais), pagamento integral via PIX ou cartão através do MercadoPago.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">7. DOS DIREITOS DE USO COMERCIAL</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cliente recebe licença comercial não-exclusiva perpétua</li>
                    <li>Direito de usar comercialmente em qualquer mídia digital</li>
                    <li>Direito de monetizar em todas as plataformas</li>
                    <li>harmonIA mantém propriedade intelectual da obra</li>
                    <li>Atribuição não obrigatória mas apreciada</li>
                    <li>Proibida revenda ou sublicenciamento da música</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">8. DAS REVISÕES E AJUSTES</h4>
                  <p>Incluídas até 2 (duas) rodadas de revisões por versão, abrangendo ajustes de mixagem, arranjo e elementos melódicos conforme feedback do cliente.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">9. DAS GARANTIAS PROFISSIONAIS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Originalidade total certificada via fingerprinting</li>
                    <li>Qualidade técnica profissional garantida</li>
                    <li>Cumprimento de briefing aprovado na consulta</li>
                    <li>Suporte técnico por 60 dias pós-entrega</li>
                    <li>Reentrega gratuita em caso de falhas técnicas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">10. DO CANCELAMENTO E REEMBOLSO</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cancelamento até 48h após pagamento: reembolso integral</li>
                    <li>Após consulta estratégica: reembolso de 70%</li>
                    <li>Após início da produção: reembolso de 30%</li>
                    <li>Após entrega da primeira versão: sem reembolso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">11. DAS OBRIGAÇÕES DAS PARTES</h4>
                  <p><strong>Cliente:</strong> Fornecer briefing completo, participar da consulta, dar feedback dentro de 5 dias úteis.</p>
                  <p><strong>harmonIA:</strong> Entregar serviço conforme especificado, cumprir prazos, prestar suporte adequado.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">12. DAS DISPOSIÇÕES GERAIS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Contrato regido pelas leis brasileiras</li>
                    <li>Foro competente: São Paulo/SP</li>
                    <li>harmonIA pode usar música em portfolio comercial</li>
                    <li>Cliente autoriza uso de nome/marca como referência</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Aceite do Contrato */}
            <div className="border-t pt-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Aceite dos Termos Profissionais</h4>
                
                <div className="flex items-start space-x-3 mb-4">
                  <Checkbox
                    id="accept-contract"
                    checked={isAccepted}
                    onCheckedChange={setIsAccepted}
                  />
                  <label 
                    htmlFor="accept-contract" 
                    className="text-sm text-gray-700 cursor-pointer leading-5"
                  >
                    Declaro que li, compreendi e aceito integralmente todos os termos deste contrato profissional. 
                    Confirmo que tenho autoridade para firmar este acordo e que as informações fornecidas são 
                    verdadeiras. Entendo os direitos de uso comercial concedidos e as limitações estabelecidas.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptContract}
                    disabled={!isAccepted || isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Aceitar Contrato Profissional e Pagar
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>harmonIA - Soluções Musicais Profissionais</p>
              <p>contato@harmonia.media | +55 11 92058-5072</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractProfissional;
