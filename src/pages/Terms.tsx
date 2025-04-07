
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import RevisionPolicy from '@/components/legal/RevisionPolicy';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Terms: React.FC = () => {
  const navigate = useNavigate();
  const [showRevisionPolicy, setShowRevisionPolicy] = useState(false);

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
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Termos de Serviço</h1>
            <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <Accordion type="single" collapsible className="mb-10">
            <AccordionItem value="revision-policy">
              <AccordionTrigger className="text-xl font-semibold text-harmonia-green">
                Política de Revisões e Reembolso
              </AccordionTrigger>
              <AccordionContent>
                <RevisionPolicy />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="prose prose-invert max-w-none">
            <h2>1. Introdução</h2>
            <p>
              Bem-vindo aos Termos de Serviço da harmonIA. Este documento estabelece as condições para utilização 
              dos nossos serviços de criação musical assistida por inteligência artificial.
            </p>
            <p>
              A harmonIA atua como facilitadora no processo de criação musical utilizando inteligência artificial e 
              supervisão humana. Nosso papel é similar ao de um despachante, conectando clientes às tecnologias de 
              IA musical e oferecendo expertise para otimizar resultados.
            </p>
            <p>
              Ao utilizar nossos serviços, você concorda com estes termos. Por favor, leia-os atentamente.
            </p>

            <h2>2. Definição do Serviço</h2>
            <p>
              A harmonIA oferece serviços de criação musical personalizada através da combinação de inteligência artificial 
              e supervisão humana. Nossos serviços incluem:
            </p>
            <ul>
              <li>Composição musical assistida por IA</li>
              <li>Refinamento e supervisão por músicos profissionais</li>
              <li>Entrega de arquivos digitais em diversos formatos</li>
              <li>Serviços adicionais conforme o pacote contratado</li>
            </ul>

            <h2>3. Papel da harmonIA como "Despachante Musical"</h2>
            <p>
              A harmonIA utiliza plataformas de IA legítimas e licenciadas, atuando como intermediária para facilitar 
              o acesso e uso dessas tecnologias. Nosso valor está na:
            </p>
            <ul>
              <li>Curadoria e seleção das melhores ferramentas de IA musical</li>
              <li>Supervisão humana por profissionais qualificados</li>
              <li>Otimização dos resultados gerados pela IA</li>
              <li>Simplificação do processo para o cliente final</li>
            </ul>
            <p>
              Nosso serviço remove as barreiras técnicas e de conhecimento que o cliente poderia enfrentar ao tentar 
              utilizar diretamente estas tecnologias.
            </p>

            <h2>4. Processo de Criação</h2>
            <p>
              O processo de criação musical segue estas etapas:
            </p>
            <ol>
              <li><strong>Qualificação:</strong> Entendemos suas necessidades e recomendamos o pacote ideal</li>
              <li><strong>Pagamento:</strong> Escolha do pacote e processamento seguro</li>
              <li><strong>Briefing:</strong> Coletamos suas ideias e preferências em detalhes</li>
              <li><strong>Produção IA:</strong> Nossa IA gera as bases musicais iniciais</li>
              <li><strong>Refinamento Humano:</strong> Músicos profissionais aprimoram a composição</li>
              <li><strong>Entrega de Prévias:</strong> Você escolhe sua versão favorita</li>
              <li><strong>Ajustes Finais:</strong> Realizamos refinamentos conforme sua escolha</li>
              <li><strong>Entrega Final:</strong> Você recebe a música em formato digital</li>
            </ol>

            <h2>5. Direitos de Uso e Licenciamento</h2>
            <p>
              Os direitos de uso das composições variam conforme o pacote contratado:
            </p>

            <h3>5.1 Pacote Essencial</h3>
            <ul>
              <li>Uso estritamente pessoal</li>
              <li>Sem direitos comerciais</li>
              <li>Sem autorização para modificação ou redistribuição</li>
            </ul>

            <h3>5.2 Pacote Profissional</h3>
            <ul>
              <li>Uso em conteúdo digital próprio</li>
              <li>Uso comercial limitado conforme especificado</li>
              <li>Sem autorização para revenda ou sublicenciamento</li>
            </ul>

            <h3>5.3 Pacote Premium</h3>
            <ul>
              <li>Licença comercial mais ampla</li>
              <li>Documentação legal de propriedade</li>
              <li>Direitos específicos conforme contrato</li>
            </ul>

            <h2>6. Limitação de Responsabilidade sobre Direitos Autorais</h2>
            <p>
              <strong>A harmonIA não garante a originalidade absoluta das composições geradas por IA.</strong> Embora tomemos medidas 
              para mitigar riscos, é importante entender:
            </p>
            <ul>
              <li>Tecnologias de IA musical são treinadas com dados existentes, podendo gerar conteúdo com similaridades a obras preexistentes</li>
              <li>Não nos responsabilizamos por eventuais disputas de direitos autorais que possam surgir</li>
              <li>Nossos pacotes Premium incluem verificações adicionais para mitigar riscos de similaridade com obras existentes, mas nenhum método é infalível</li>
              <li>Ao contratar nossos serviços, o cliente reconhece os riscos inerentes à criação musical assistida por IA</li>
            </ul>

            <h2>7. Mitigação de Riscos</h2>
            <p>
              Implementamos diferentes níveis de mitigação de riscos conforme o pacote:
            </p>

            <h3>7.1 Pacote Essencial</h3>
            <ul>
              <li>Verificação básica automatizada</li>
              <li>Uso limitado a contexto pessoal</li>
            </ul>

            <h3>7.2 Pacote Profissional</h3>
            <ul>
              <li>Verificações intermediárias de similaridade</li>
              <li>Ajustes para reduzir riscos em uso digital</li>
            </ul>

            <h3>7.3 Pacote Premium</h3>
            <ul>
              <li>Verificações avançadas de similaridade</li>
              <li>Registro oficial na Biblioteca Nacional</li>
              <li>Documentação legal mais robusta</li>
            </ul>

            <h2>8. Entrega e Revisões</h2>
            <p>
              Para todos os pacotes, o resultado final é uma composição musical refinada, mesmo que durante o processo 
              sejam apresentadas múltiplas variações para escolha.
            </p>
            <p>
              O número de revisões gratuitas varia conforme o pacote contratado:
            </p>
            <ul>
              <li>Pacote Essencial: 1 revisão gratuita</li>
              <li>Pacote Profissional: 3 revisões gratuitas</li>
              <li>Pacote Premium: Revisões ilimitadas (dentro de 30 dias)</li>
            </ul>
            <p>
              Revisões adicionais podem ser contratadas separadamente.
            </p>

            <h2>9. Confidencialidade</h2>
            <p>
              Tratamos todas as informações do briefing e detalhes do projeto com confidencialidade. Não compartilharemos 
              seu conteúdo sem autorização expressa.
            </p>

            <h2>10. Pagamento e Reembolso</h2>
            <p>
              O pagamento é processado após a aprovação da qualificação e escolha do pacote.
              Aceitamos cartão de crédito, PIX e transferência bancária.
            </p>
            <p>
              Política de reembolso: até 24h após o pagamento, desde que a produção não tenha iniciado.
            </p>

            <h2>11. Isenção de Garantias</h2>
            <p>
              Embora nos esforcemos para entregar composições de alta qualidade, não podemos garantir:
            </p>
            <ul>
              <li>Que a composição atenderá 100% das expectativas subjetivas do cliente</li>
              <li>Originalidade absoluta ou ausência de similaridades com outras obras</li>
              <li>Sucesso comercial ou aceitação pública da composição</li>
            </ul>

            <h2>12. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão 
              comunicadas aos clientes.
            </p>

            <h2>13. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil.
            </p>

            <h2>14. Contato</h2>
            <p>
              Para questões relacionadas a estes termos, entre em contato através de:
            </p>
            <ul>
              <li>
                Email: 
                <a href={`mailto:${siteConfig.contact.email}`} className="text-harmonia-green hover:underline ml-1">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                WhatsApp: 
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-harmonia-green hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>

            <p className="mt-8 border-t border-border pt-6 text-center text-sm text-gray-400">
              Ao contratar os serviços da harmonIA, você confirma que leu, entendeu e concorda com estes Termos de Serviço.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
