
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';

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
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Termos de Serviço</h1>
            <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>1. Natureza do Serviço</h2>
            <h3>1.1 Definições</h3>
            <p>
              <strong>PRESTADORA:</strong> harmonIA
            </p>
            <p>
              <strong>CLIENTE:</strong> Pessoa física ou jurídica contratante dos serviços.
            </p>
            <p>
              <strong>OBRA MUSICAL:</strong> Composição musical criada utilizando tecnologia de IA com intervenção humana.
            </p>

            <h3>1.2 Escopo do Serviço</h3>
            <p>
              A harmonIA atua como "despachante musical", intermediando o acesso do CLIENTE a tecnologias de inteligência artificial para criação musical. 
              O serviço inclui orientação técnica, curadoria, refinamento humano especializado e documentação legal conforme o pacote contratado.
            </p>

            <h2>2. Pacotes e Direitos Concedidos</h2>
            <h3>2.1 Pacote Essencial</h3>
            <p>
              <strong>Direitos concedidos:</strong> Licença não-exclusiva, intransferível, para uso EXCLUSIVAMENTE PESSOAL E NÃO-COMERCIAL da OBRA MUSICAL.
            </p>
            <p>
              A harmonIA mantém direitos sobre melodia, harmonia e arranjos.
            </p>

            <h3>2.2 Pacote Profissional</h3>
            <p>
              <strong>Direitos concedidos:</strong> Licença limitada para uso em conteúdo digital próprio, monetização em plataformas do CLIENTE e execução em eventos particulares ou corporativos do CLIENTE.
            </p>
            <p>
              Vedado sublicenciar, revender ou ceder a obra a terceiros.
            </p>

            <h3>2.3 Pacote Premium</h3>
            <p>
              <strong>Direitos concedidos:</strong> Cessão total dos direitos patrimoniais sobre a OBRA MUSICAL, conforme Termo de Cessão de Direitos Autorais específico.
            </p>

            <h2>3. Limitações de Responsabilidade</h2>
            <h3>3.1 Originalidade e Verificações</h3>
            <p>
              A harmonIA realiza verificações técnicas de similaridade conforme o pacote contratado, mas não garante a originalidade absoluta das composições geradas por IA.
            </p>
            <p>
              Tais verificações representam o melhor esforço técnico disponível, não constituindo garantia absoluta contra eventuais reivindicações de terceiros.
            </p>

            <h3>3.2 Responsabilidade do Cliente</h3>
            <p>
              O CLIENTE assume integral e exclusiva responsabilidade por qualquer uso da OBRA MUSICAL que exceda os limites estabelecidos no contrato específico do seu pacote.
            </p>
            <p>
              A harmonIA NÃO ASSUME RESPONSABILIDADE, em nenhuma hipótese, por usos da OBRA MUSICAL que excedam os limites estabelecidos no contrato.
            </p>

            <h2>4. Registros e Proteção Legal</h2>
            <h3>4.1 Limitações de Registro</h3>
            <p>
              O registro na Biblioteca Nacional incluído no Pacote Premium limita-se exclusivamente à letra da OBRA MUSICAL.
            </p>
            <p>
              O registro em blockchain oferecido serve apenas como comprovação de precedência temporal (timestamp), não substituindo registros oficiais de proteção autoral.
            </p>
            <p>
              Quaisquer registros adicionais de melodia, arranjo ou fonograma em órgãos como UBC, ECAD ou similares são de responsabilidade exclusiva do CLIENTE.
            </p>

            <h2>5. Processo de Mitigação de Riscos</h2>
            <p>
              A harmonIA implementa as seguintes medidas para mitigação de riscos de similaridade:
            </p>
            <ul>
              <li>Verificação por algoritmos automatizados de comparação musical</li>
              <li>Documentação detalhada do processo criativo</li>
              <li>Parametrização específica para minimizar citações diretas</li>
            </ul>

            <h2>6. Política de Revisões</h2>
            <h3>6.1 Revisões Incluídas</h3>
            <p>
              Cada pacote inclui um número específico de revisões com prazos determinados para solicitação. Os detalhes completos são fornecidos no contrato específico de cada pacote.
            </p>

            <h3>6.2 Disponibilidade de Arquivos</h3>
            <p>
              Os arquivos e projetos da OBRA MUSICAL ficarão disponíveis para revisões por tempo limitado após a entrega final, após o qual serão arquivados.
            </p>
            <p>
              Revisões adicionais além das incluídas no pacote estão sujeitas a custos adicionais e disponibilidade técnica.
            </p>

            <h2>7. Política de Reembolso</h2>
            <h3>7.1 Condições de Reembolso</h3>
            <p>
              As condições de reembolso variam conforme o estágio do projeto e estão detalhadas nos contratos específicos.
            </p>

            <h3>7.2 Similaridade Significativa</h3>
            <p>
              Em caso de comprovada similaridade significativa com obras preexistentes, identificada por ferramentas automáticas de verificação ou reclamação formal, a harmonIA oferece soluções variadas conforme o pacote contratado. Os detalhes completos estão especificados nos contratos.
            </p>

            <h2>8. Direitos de Propriedade Intelectual</h2>
            <h3>8.1 Propriedade da harmonIA</h3>
            <p>
              A harmonIA mantém todos os direitos sobre sua metodologia, processos, ferramentas e tecnologia utilizados na criação das obras musicais.
            </p>
            <p>
              A harmonIA reserva-se o direito de utilizar a OBRA MUSICAL em seu portfólio, para fins promocionais, preservando o contexto original da criação.
            </p>

            <h3>8.2 Atribuição</h3>
            <p>
              O uso da OBRA MUSICAL exige atribuição conforme especificado no contrato do pacote adquirido.
            </p>

            <h2>9. Alterações nos Termos</h2>
            <p>
              A harmonIA pode modificar estes Termos de Serviço a qualquer momento, publicando os termos modificados no site. O uso continuado dos serviços após tais modificações constitui aceitação dos novos termos.
            </p>

            <h2>10. Contato</h2>
            <p>
              Para questões relacionadas a estes Termos de Serviço, entre em contato através do e-mail:
              <a href={`mailto:${siteConfig.contact.email}`} className="text-harmonia-green hover:underline ml-1">
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
