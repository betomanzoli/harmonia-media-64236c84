
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site';

const PrivacyPolicy: React.FC = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2>1. Introdução</h2>
            <p>
              A harmonIA ("nós", "nosso" ou "empresa") está comprometida com a proteção da sua privacidade. 
              Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas 
              informações pessoais quando você utiliza nosso site e serviços de criação musical assistida por 
              inteligência artificial.
            </p>

            <h2>2. Informações Coletadas</h2>
            <h3>2.1 Informações fornecidas diretamente por você:</h3>
            <ul>
              <li>Dados cadastrais (nome, e-mail, telefone, CPF/CNPJ)</li>
              <li>Dados de pagamento (processados por gateways de pagamento seguros)</li>
              <li>Conteúdo do briefing musical (histórias pessoais, preferências musicais, referências)</li>
              <li>Feedback sobre os serviços e obras entregues</li>
            </ul>

            <h3>2.2 Informações coletadas automaticamente:</h3>
            <ul>
              <li>Dados de uso do site (páginas visitadas, tempo de permanência)</li>
              <li>Informações do dispositivo (tipo, sistema operacional, navegador)</li>
              <li>Endereço IP e localização aproximada</li>
              <li>Cookies e tecnologias similares</li>
            </ul>

            <h2>3. Uso das Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Criar e entregar as composições musicais solicitadas</li>
              <li>Processar pagamentos e gerenciar sua conta</li>
              <li>Realizar o registro legal das obras quando aplicável</li>
              <li>Comunicar sobre o andamento do seu projeto</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>

            <h2>4. Compartilhamento de Informações</h2>
            <p>
              Suas informações podem ser compartilhadas com:
            </p>
            <h3>4.1 Prestadores de serviços:</h3>
            <ul>
              <li>Plataformas de IA musical (apenas os parâmetros necessários, sem dados pessoais)</li>
              <li>Profissionais envolvidos na produção musical (sob acordos de confidencialidade)</li>
              <li>Serviços de hospedagem e tecnologia</li>
              <li>Processadores de pagamento</li>
            </ul>

            <h3>4.2 Para fins legais:</h3>
            <ul>
              <li>Registro na Biblioteca Nacional (apenas quando incluído no pacote contratado)</li>
              <li>Autoridades governamentais quando obrigatório por lei</li>
            </ul>

            <h2>5. Segurança das Informações</h2>
            <p>
              Implementamos medidas técnicas e organizacionais para proteger suas informações pessoais, incluindo:
            </p>
            <ul>
              <li>Criptografia de dados sensíveis</li>
              <li>Acesso restrito a colaboradores que necessitam da informação</li>
              <li>Monitoramento regular de nossos sistemas</li>
              <li>Política de retenção de dados com períodos definidos</li>
            </ul>

            <h2>6. Seus Direitos (LGPD)</h2>
            <p>
              Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento de seus dados</li>
              <li>Acesso aos seus dados</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Portabilidade dos dados</li>
              <li>Eliminação dos dados (com exceções legais)</li>
              <li>Informação sobre compartilhamento</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p>
              Para exercer estes direitos, entre em contato através do e-mail oficial disponível em nossa página de contato.
            </p>

            <h2>7. Período de Retenção</h2>
            <p>
              Mantemos suas informações pessoais pelo tempo necessário para:
            </p>
            <ul>
              <li>Cumprir com as finalidades descritas nesta política</li>
              <li>Atender obrigações legais e regulatórias</li>
            </ul>
            <p>
              Os períodos específicos de retenção de dados estão definidos em nossos contratos.
            </p>

            <h2>8. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência em nosso site. Você pode gerenciar as preferências 
              de cookies através das configurações do seu navegador.
            </p>

            <h2>9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre 
              disponível em nosso site, com a data da última atualização.
            </p>

            <h2>10. Contato</h2>
            <p>
              Para questões relacionadas à privacidade de seus dados, entre em contato com nosso Encarregado de 
              Proteção de Dados através do e-mail:
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

export default PrivacyPolicy;
