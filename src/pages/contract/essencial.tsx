import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const ContractEssencial: React.FC = () => {
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
      // Atualizar status do briefing
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

      // Redirecionar para pagamento com dados do contrato
      const paymentUrl = `/payment?briefing=${briefingId}&package=essencial`;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Contrato de Prestação de Serviços - Pacote Essencial</CardTitle>
            <p className="text-gray-600 mt-2">
              Leia atentamente os termos antes de prosseguir com o pagamento
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Resumo do Pacote */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Resumo do Pacote Essencial - R$ 219,00
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ 1 música personalizada baseada na sua história</li>
                <li>✅ 2 versões diferentes para você escolher a final</li>
                <li>✅ Certificado digital de autenticidade da obra</li>
                <li>✅ Entrega em até 5 dias úteis após briefing detalhado</li>
                <li>✅ Suporte durante todo o processo de criação</li>
                <li>✅ Arquivo final em MP3 de alta qualidade</li>
              </ul>
            </div>

            {/* Termos do Contrato */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TERMOS E CONDIÇÕES</h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900">1. DO OBJETO</h4>
                  <p>O presente contrato tem por objeto a prestação de serviços de criação musical personalizada através do Pacote Essencial, incluindo composição, produção e entrega de arquivo digital.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">2. DAS ESPECIFICAÇÕES DO SERVIÇO</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Criação de 1 (uma) música original baseada no briefing fornecido</li>
                    <li>Produção de 2 (duas) versões para escolha da versão final</li>
                    <li>Duração aproximada de 2 a 4 minutos</li>
                    <li>Entrega em formato MP3 com qualidade 320kbps</li>
                    <li>Certificado digital de autenticidade incluso</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">3. DO PRAZO DE ENTREGA</h4>
                  <p>O prazo de entrega é de até 5 (cinco) dias úteis, contados a partir da conclusão do briefing detalhado e confirmação do pagamento.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">4. DO VALOR E FORMA DE PAGAMENTO</h4>
                  <p>O valor total do serviço é de R$ 219,00 (duzentos e dezenove reais), pago integralmente via PIX ou cartão de crédito através da plataforma MercadoPago.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">5. DOS DIREITOS AUTORAIS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>O cliente terá direitos de uso pessoal e não comercial da obra</li>
                    <li>A harmonIA mantém os direitos de propriedade intelectual</li>
                    <li>É permitido compartilhamento em redes sociais com atribuição</li>
                    <li>Para uso comercial, contrate o Pacote Profissional ou Premium</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">6. DAS REVISÕES</h4>
                  <p>O Pacote Essencial inclui até 1 (uma) rodada de pequenos ajustes na versão escolhida, limitada a alterações de mixagem ou pequenos detalhes melódicos.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">7. DAS GARANTIAS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Garantimos originalidade total da composição</li>
                    <li>Garantimos qualidade técnica da produção</li>
                    <li>Garantimos entrega no prazo estabelecido</li>
                    <li>Oferecemos suporte pós-entrega por 30 dias</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">8. DO CANCELAMENTO</h4>
                  <p>O cancelamento pode ser solicitado até 24 horas após a confirmação do pagamento, com reembolso integral. Após o início da produção, não há possibilidade de cancelamento.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">9. DAS DISPOSIÇÕES GERAIS</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Este contrato é regido pelas leis brasileiras</li>
                    <li>Eventuais conflitos serão resolvidos no foro de São Paulo/SP</li>
                    <li>A harmonIA se reserva o direito de usar a música em portfolio</li>
                    <li>O cliente autoriza o uso de seu nome como referência</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">10. DO CONTATO E SUPORTE</h4>
                  <p>Dúvidas e suporte: contato@harmonia.media | WhatsApp: (11) 99999-9999</p>
                </div>
              </div>
            </div>

            {/* Aceite do Contrato */}
            <div className="border-t pt-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Aceite dos Termos</h4>
                
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
                    Declaro que li, compreendi e aceito todos os termos e condições descritos neste contrato. 
                    Confirmo que as informações fornecidas são verdadeiras e assumo a responsabilidade 
                    pelo cumprimento das obrigações aqui estabelecidas.
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptContract}
                    disabled={!isAccepted || isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceitar Contrato e Ir para Pagamento
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
              <p>harmonIA - Música Personalizada com Inteligência Artificial</p>
              <p>contato@harmonia.media | +55 11 92058-5072</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractEssencial;
