
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <p>
              A harmonIA valoriza a privacidade dos seus usuários e está comprometida em proteger as informações pessoais que você compartilha conosco. Esta política descreve como coletamos, usamos e protegemos suas informações quando você utiliza nosso site e serviços.
            </p>

            <h2>1. Informações que Coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul>
              <li><strong>Informações pessoais:</strong> Nome, e-mail, telefone e outras informações de contato que você fornecer voluntariamente.</li>
              <li><strong>Dados de briefing:</strong> Informações sobre o projeto musical que você deseja criar.</li>
              <li><strong>Arquivos enviados:</strong> Arquivos de áudio, textos ou outros materiais que você enviar para referência.</li>
              <li><strong>Informações de uso:</strong> Dados sobre como você interage com nosso site, incluindo páginas visitadas e recursos utilizados.</li>
            </ul>

            <h2>2. Como Usamos Suas Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Fornecer e personalizar nossos serviços de composição musical.</li>
              <li>Comunicar sobre seu projeto e responder a suas solicitações.</li>
              <li>Processar pagamentos e gerenciar sua conta.</li>
              <li>Melhorar e desenvolver nossos serviços.</li>
              <li>Cumprir obrigações legais e proteger direitos legais.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>
              Não vendemos suas informações pessoais. Podemos compartilhar informações com:
            </p>
            <ul>
              <li>Músicos e produtores que trabalham em seu projeto, com sua autorização prévia.</li>
              <li>Prestadores de serviços que nos ajudam a operar o site e fornecer serviços.</li>
              <li>Quando exigido por lei ou para proteger nossos direitos legais.</li>
            </ul>

            <h2>4. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado ou alteração.
              No entanto, nenhum método de transmissão pela internet é 100% seguro.
            </p>

            <h2>5. Seus Direitos</h2>
            <p>
              Você tem direito a:
            </p>
            <ul>
              <li>Acessar suas informações pessoais.</li>
              <li>Corrigir informações imprecisas.</li>
              <li>Solicitar exclusão de seus dados (sujeito a obrigações legais).</li>
              <li>Opor-se ou restringir certos tipos de processamento.</li>
            </ul>

            <h2>6. Cookies e Tecnologias Semelhantes</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, 
              analisar o uso do site e personalizar conteúdo. Você pode gerenciar suas preferências 
              de cookies através das configurações do seu navegador.
            </p>

            <h2>7. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco pelo e-mail: 
              <a href="mailto:contato@harmonia.media" className="text-harmonia-green hover:underline ml-1">
                contato@harmonia.media
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
