import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Shield, FileSignature, AlertTriangle } from 'lucide-react';

const ContractPremium: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const briefingId = searchParams.get('briefing');
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!briefingId) {
      navigate('/briefing');
    }
  }, [briefingId, navigate]);

  const handleAcceptContract = async () => {
    if (!briefingId) {
      toast({
        title: 'Erro',
        description: 'Briefing ID não encontrado.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('briefings')
        .update({
          contract_accepted: true,
          status: 'contract_accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', briefingId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Contrato Aceito!',
        description: 'Redirecionando para a página de pagamento...',
      });

      navigate(`/payment?briefing=${briefingId}&package=premium`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/briefing')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Briefing
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Contrato de Prestação de Serviços - Pacote Premium
                </CardTitle>
                <p className="text-gray-600">
                  Leia atentamente os termos do contrato antes de aceitar
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Características do Pacote Premium
                  </h3>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• 1 música personalizada com até 8 versões + 3 extras</li>
                    <li>• Registro oficial na Biblioteca Nacional</li>
                    <li>• Propriedade 100% do cliente</li>
                    <li>• Consulta de 30 minutos com nossos especialistas</li>
                    <li>• Entrega em até 10 dias úteis</li>
                    <li>• Todos os formatos de áudio disponíveis</li>
                  </ul>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-2">1. OBJETO DO CONTRATO</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    A harmonIA se compromete a criar uma música personalizada conforme especificações 
                    do cliente, incluindo registro legal e transferência total de propriedade.
                  </p>

                  <h4 className="font-semibold mb-2">2. PROPRIEDADE INTELECTUAL</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Após o pagamento integral e conclusão do projeto, todos os direitos autorais 
                    e de propriedade intelectual serão transferidos integralmente ao cliente, 
                    incluindo registro na Biblioteca Nacional.
                  </p>

                  <h4 className="font-semibold mb-2">3. PRAZO DE ENTREGA</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    O prazo de entrega é de até 10 dias úteis, contados a partir da aprovação 
                    do briefing detalhado e confirmação do pagamento.
                  </p>

                  <h4 className="font-semibold mb-2">4. REVISÕES</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Estão incluídas até 3 revisões da música principal. Revisões adicionais 
                    poderão ser solicitadas mediante taxa adicional.
                  </p>

                  <h4 className="font-semibold mb-2">5. GARANTIAS</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Garantimos originalidade total da composição e responsabilidade por 
                    eventuais questões de direitos autorais de terceiros.
                  </p>

                  <h4 className="font-semibold mb-2">6. CANCELAMENTO</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Em caso de cancelamento pelo cliente após início dos trabalhos, 
                    será retido 30% do valor como taxa de serviços já prestados.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Importante</h4>
                      <p className="text-sm text-red-700">
                        Ao aceitar este contrato, você concorda com todos os termos descritos. 
                        Certifique-se de ter lido e compreendido todas as cláusulas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accept-contract"
                    checked={contractAccepted}
                    onCheckedChange={setContractAccepted}
                  />
                  <label 
                    htmlFor="accept-contract" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os termos e condições do contrato
                  </label>
                </div>

                <Button
                  onClick={handleAcceptContract}
                  disabled={!contractAccepted || isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileSignature className="mr-2 h-4 w-4" />
                      Aceitar Contrato e Prosseguir
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  Pacote Premium
                </CardTitle>
                <div className="text-center text-2xl font-bold text-purple-600">
                  R$ 969,00
                </div>
                <p className="text-center text-gray-600">
                  Registro legal + propriedade total
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1 música personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">8 versões + 3 extras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Registro na Biblioteca Nacional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Propriedade 100% sua</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Consulta de 30 minutos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Entrega em 10 dias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Todos os formatos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPremium;
