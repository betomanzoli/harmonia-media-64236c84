import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CheckCircle, Crown, Award } from 'lucide-react';

const ContractPremium: React.FC = () => {
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
        title: 'Contrato Premium Aceito!',
        description: 'Redirecionando para pagamento exclusivo...'
      });

      const paymentUrl = `/payment?briefing=${briefingId}&package=premium`;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Carregando contrato premium...</p>
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
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Contrato Premium - Registro na Biblioteca Nacional</CardTitle>
            <p className="text-gray-600 mt-2">
              Contrato exclusivo com registro legal e propriedade intelectual completa
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Resumo do Pacote */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Resumo do Pacote Premium - R$ 969,00
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✅ 1 música personalizada de nível premium</li>
                  <li>✅ 8 versões completas + 3 versões extras</li>
                  <li>✅ Registro oficial na Biblioteca Nacional</li>
                  <li>✅ Propriedade intelectual 100% do cliente</li>
                  <li>✅ Consultoria estratégica de 30 minutos</li>
                  <li>✅ Entrega em até 10 dias úteis</li>
                </ul>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✅ Masterização premium para todas as plataformas</li>
                  <li>✅ Formatos profissionais (MP3, WAV, FLAC)</li>
                  <li>✅ Certificado de registro legal incluso</li>
                  <li>✅ Direitos exclusivos perpétuos</li>
                  <li>✅ Suporte VIP prioritário</li>
                  <li>✅ Garantia de satisfação estendida</li>
                </ul>
              </div>
            </div>

            {/* Destaque do Registro */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Registro na Biblioteca Nacional - Proteção Legal Total
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>🏛️ Registro oficial como obra musical inédita</li>
                <li>📜 Certificado de autoria com validade jurídica</li>
                <li>⚖️ Proteção legal contra pirataria e uso indevido</li>
                <li>🔒 Prova irrefutável de propriedade intelectual</li>
                <li>🌎 Reconhecimento internacional via tratados</li>
              </ul>
            </div>

            {/* Termos do Contrato */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CONTRATO PREMIUM - TERMOS E CONDIÇÕES ESPECIAIS</h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900">1. DO OBJETO PREMIUM</h4>
                  <p>Prestação de serviços especializados de criação musical premium com registro legal na Biblioteca Nacional, transferência completa de propriedade intelectual e consultoria estratégica exclusiva.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">2. DO REGISTRO NA BIBLIOTECA NACIONAL</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Registro oficial da obra como composição musical inédita</li>
                    <li>Documentação legal completa em nome do cliente</li>
                    <li>Certificado de registro com validade jurídica nacional e internacional</li>
                    <li>Proteção legal contra plágio e uso não autorizado</li>
                    <li>Processo de registro gerenciado integralmente pela harmonIA</li>
                    <li>Prazo de registro: até 30 dias após entrega da obra</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">3. DA TRANSFERÊNCIA DE PROPRIEDADE INTELECTUAL</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>PROPRIEDADE EXCLUSIVA:</strong> Cliente recebe 100% dos direitos autorais</li>
                    <li>Transferência total e perpétua da propriedade intelectual</li>
                    <li>Direito exclusivo de exploração comercial sem limitações</li>
                    <li>Direito de sublicenciar, vender ou transferir a terceiros</li>
                    <li>Direito de criar obras derivadas baseadas na composição</li>
                    <li>harmonIA renuncia a qualquer participação futura nos direitos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">4. DAS ESPECIFICAÇÕES TÉCNICAS PREMIUM</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Criação de 1 (uma) obra musical de alta complexidade</li>
                    <li>8 versões principais completas + 3 versões extras</li>
                    <li>Masterização premium para múltiplas plataformas</li>
                    <li>Entrega em MP3 (320kbps), WAV (24-bit/96kHz), FLAC</li>
                    <li>Stems individuais para remixagem (opcional)</li>
                    <li>Partitura completa em formato digital (MusicXML/PDF)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">5. DA CONSULTORIA ESTRATÉGICA EXCLUSIVA</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sessão de 30 minutos com especialista sênior</li>
                    <li>Análise estratégica do projeto musical</li>
                    <li>Orientação sobre exploração comercial da obra</li>
                    <li>Consultoria sobre registro de marca musical (se aplicável)</li>
                    <li>Estratégias de monetização e licenciamento</li>
                    <li>Agendamento prioritário e flexível</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">6. DO VALOR E FORMA DE PAGAMENTO</h4>
                  <p>Valor total: R$ 969,00 (novecentos e sessenta e nove reais), incluindo todas as taxas de registro, consultoria e transferência de direitos. Pagamento integral via PIX ou parcelamento no cartão.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">7. DOS PRAZOS PREMIUM</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Produção musical: até 10 dias úteis</li>
                    <li>Registro na Biblioteca Nacional: até 30 dias</li>
                    <li>Entrega do certificado: até 45 dias</li>
                    <li>Consultoria: agendada em até 24 horas</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">8. DAS GARANTIAS PREMIUM</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Garantia de satisfação total ou reembolso integral</li>
                    <li>Garantia de originalidade com verificação forense</li>
                    <li>Garantia de registro legal bem-sucedido</li>
                    <li>Garantia de qualidade técnica premium</li>
                    <li>Suporte VIP por 12 meses pós-entrega</li>
                    <li>Revisões ilimitadas durante o processo criativo</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">9. DAS OBRIGAÇÕES ESPECIAIS</h4>
                  <p><strong>harmonIA:</strong> Executar registro legal, transferir propriedade, entregar certificação, prestar consultoria especializada.</p>
                  <p><strong>Cliente:</strong> Fornecer documentação para registro, participar da consultoria, validar etapas do processo.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">10. DO CANCELAMENTO PREMIUM</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Até 72h após pagamento: reembolso integral</li>
                    <li>Após consultoria mas antes da produção: reembolso de 80%</li>
                    <li>Durante produção: reembolso de 50%</li>
                    <li>Após início do registro: reembolso de 20%</li>
                    <li>Após entrega completa: sem reembolso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">11. DA CONFIDENCIALIDADE</h4>
                  <p>Este contrato inclui cláusula de confidencialidade. Todas as informações, briefings e materiais são tratados com máximo sigilo. A harmonIA compromete-se a não divulgar dados do projeto sem autorização expressa.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">12. DAS DISPOSIÇÕES LEGAIS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Contrato regido pela Lei de Direitos Autorais (9.610/98)</li>
                    <li>Foro exclusivo: Comarca de São Paulo/SP</li>
                    <li>Mediação prévia obrigatória para conflitos</li>
                    <li>Executividade extrajudicial do contrato</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Aceite do Contrato */}
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-purple-600" />
                  Aceite do Contrato Premium
                </h4>
                
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
                    Declaro que li e compreendi integralmente este contrato premium. Confirmo que tenho 
                    plenos poderes para contratar este serviço e que todas as informações fornecidas são 
                    verdadeiras e completas. Entendo que este contrato incluirá registro legal na Biblioteca 
                    Nacional e transferência total de propriedade intelectual. Aceito todos os termos, 
                    condições e obrigações estabelecidas.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptContract}
                    disabled={!isAccepted || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Aceitar Contrato Premium e Finalizar
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
              <p>harmonIA Premium Services - Registro Legal e Propriedade Intelectual</p>
              <p>contato@harmonia.media | WhatsApp VIP: +55 11 92058-5072 </p></p>
              <p>Biblioteca Nacional do Brasil - Registro de Obras Intelectuais</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractPremium;
