
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Termos de Serviço</h1>
          <p className="text-gray-400 mb-10">
            Última atualização: 11 de Abril de 2025
          </p>

          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
              <p className="text-gray-400 mb-4">
                Bem-vindo aos Termos de Serviço da harmonIA. Este documento estabelece as condições para utilização dos nossos serviços de criação musical assistida por inteligência artificial.
              </p>
              <p className="text-gray-400 mb-4">
                A harmonIA atua como facilitadora no processo de criação musical utilizando inteligência artificial e supervisão humana. Nosso papel é similar ao de um despachante, conectando clientes às tecnologias de IA musical e oferecendo expertise para otimizar resultados.
              </p>
              <p className="text-gray-400">
                Ao utilizar nossos serviços, você concorda com estes termos. Por favor, leia-os atentamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Definição do Serviço</h2>
              <p className="text-gray-400 mb-4">
                A harmonIA oferece serviços de criação musical personalizada através da combinação de inteligência artificial e supervisão humana. Nossos serviços incluem:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Composição musical assistida por IA</li>
                <li>Refinamento e supervisão por músicos profissionais</li>
                <li>Entrega de arquivos digitais em diversos formatos</li>
                <li>Serviços adicionais conforme o pacote contratado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Papel da harmonIA como "Despachante Musical"</h2>
              <p className="text-gray-400 mb-4">
                A harmonIA utiliza plataformas de IA legítimas e licenciadas, atuando como intermediária para facilitar o acesso e uso dessas tecnologias. Nosso valor está na:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Curadoria e seleção das melhores ferramentas de IA musical</li>
                <li>Supervisão humana por profissionais qualificados</li>
                <li>Otimização dos resultados gerados pela IA</li>
                <li>Simplificação do processo para o cliente final</li>
              </ul>
              <p className="text-gray-400 mt-4">
                Nosso serviço remove as barreiras técnicas e de conhecimento que o cliente poderia enfrentar ao tentar utilizar diretamente estas tecnologias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Processo de Criação</h2>
              <p className="text-gray-400 mb-4">
                O processo de criação musical segue estas etapas:
              </p>
              <ol className="list-decimal pl-6 text-gray-400 space-y-2">
                <li><strong>Briefing</strong>: Coletamos suas ideias e preferências</li>
                <li><strong>Aprovação</strong>: Confirmamos detalhes e processamos o pagamento</li>
                <li><strong>Produção IA</strong>: Nossa IA gera as bases musicais iniciais</li>
                <li><strong>Refinamento Humano</strong>: Músicos profissionais aprimoram a composição</li>
                <li><strong>Entrega</strong>: Você recebe a música em formato digital</li>
                <li><strong>Revisões</strong>: Realizamos ajustes conforme seu feedback (quantidade varia por pacote)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Direitos de Uso e Licenciamento</h2>
              <p className="text-gray-400 mb-4">
                Os direitos de uso das composições variam conforme o pacote contratado:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Essencial:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Uso estritamente pessoal</li>
                    <li>Sem direitos comerciais</li>
                    <li>Sem autorização para modificação ou redistribuição</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Profissional:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Uso em conteúdo digital próprio</li>
                    <li>Uso comercial limitado conforme especificado</li>
                    <li>Sem autorização para revenda ou sublicenciamento</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Premium:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Licença comercial mais ampla</li>
                    <li>Documentação legal de propriedade</li>
                    <li>Direitos específicos conforme contrato</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitação de Responsabilidade sobre Direitos Autorais</h2>
              <p className="text-gray-400 mb-4">
                <strong>A harmonIA não garante a originalidade absoluta das composições geradas por IA.</strong> Embora tomemos medidas para mitigar riscos, é importante entender:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Tecnologias de IA musical são treinadas com dados existentes, podendo gerar conteúdo com similaridades a obras preexistentes</li>
                <li>Não nos responsabilizamos por eventuais disputas de direitos autorais que possam surgir</li>
                <li>Nossos pacotes Premium incluem verificações adicionais para mitigar riscos de similaridade com obras existentes, mas nenhum método é infalível</li>
                <li>Ao contratar nossos serviços, o cliente reconhece os riscos inerentes à criação musical assistida por IA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Mitigação de Riscos</h2>
              <p className="text-gray-400 mb-4">
                Implementamos diferentes níveis de mitigação de riscos conforme o pacote:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Essencial:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Verificação básica automatizada</li>
                    <li>Uso limitado a contexto pessoal</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Profissional:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Verificações intermediárias de similaridade</li>
                    <li>Ajustes para reduzir riscos em uso digital</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Pacote Premium:</h3>
                  <ul className="list-disc pl-6 text-gray-400 space-y-1">
                    <li>Verificações avançadas de similaridade</li>
                    <li>Registro oficial na Biblioteca Nacional</li>
                    <li>Documentação legal mais robusta</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Continuação dos termos de serviço... */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Entrega e Revisões</h2>
              <p className="text-gray-400 mb-4">
                Para todos os pacotes, o resultado final é uma composição musical refinada, mesmo que durante o processo sejam apresentadas múltiplas variações para escolha.
              </p>
              <p className="text-gray-400 mb-4">
                O número de revisões gratuitas varia conforme o pacote contratado:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Pacote Essencial: 1 revisão gratuita</li>
                <li>Pacote Profissional: 3 revisões gratuitas</li>
                <li>Pacote Premium: Revisões ilimitadas (dentro de 30 dias)</li>
              </ul>
              <p className="text-gray-400">
                Revisões adicionais podem ser contratadas separadamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Confidencialidade</h2>
              <p className="text-gray-400">
                Tratamos todas as informações do briefing e detalhes do projeto com confidencialidade. Não compartilharemos seu conteúdo sem autorização expressa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Pagamento e Reembolso</h2>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>O pagamento é processado após a aprovação do briefing</li>
                <li>Aceitamos cartão de crédito, PIX e transferência bancária</li>
                <li>Política de reembolso: até 24h após o pagamento, desde que a produção não tenha iniciado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Isenção de Garantias</h2>
              <p className="text-gray-400 mb-4">
                Embora nos esforcemos para entregar composições de alta qualidade, não podemos garantir:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Que a composição atenderá 100% das expectativas subjetivas do cliente</li>
                <li>Originalidade absoluta ou ausência de similaridades com outras obras</li>
                <li>Sucesso comercial ou aceitação pública da composição</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Alterações nos Termos</h2>
              <p className="text-gray-400">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas aos clientes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Lei Aplicável</h2>
              <p className="text-gray-400">
                Estes termos são regidos pelas leis do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
              <p className="text-gray-400 mb-4">
                Para questões relacionadas a estes termos, entre em contato através de:
              </p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Email: contato@harmonia.com.br</li>
                <li>WhatsApp: (+55) 11 92058-5072</li>
              </ul>
            </section>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-center text-gray-400">
                Ao contratar os serviços da harmonIA, você confirma que leu, entendeu e concorda com estes Termos de Serviço.
              </p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
