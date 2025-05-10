
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

          <div className="prose prose-lg max-w-none">
            <p>
              A harmonIA está comprometida com a proteção e privacidade dos dados pessoais de seus usuários. Esta política descreve como coletamos, usamos e protegemos suas informações quando você utiliza nossos serviços.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Informações que coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Informações pessoais como nome, email e telefone;</li>
              <li>Informações de pagamento processadas por nossos parceiros de pagamento;</li>
              <li>Informações sobre suas preferências musicais e requisitos de projeto;</li>
              <li>Dados de uso do site e estatísticas de interação;</li>
              <li>Comunicações que você nos envia.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Como utilizamos suas informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Fornecer, manter e melhorar nossos serviços;</li>
              <li>Processar pedidos e transações;</li>
              <li>Enviar informações sobre seu pedido e atualizações;</li>
              <li>Responder a suas perguntas e solicitações;</li>
              <li>Personalizar sua experiência com nossos serviços;</li>
              <li>Proteger contra atividades fraudulentas ou ilegais.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Compartilhamento de informações</h2>
            <p>
              Não vendemos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar suas informações com:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Parceiros de processamento de pagamento;</li>
              <li>Prestadores de serviço que nos auxiliam na operação do site;</li>
              <li>Quando exigido por lei ou para proteger direitos legais.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Segurança de dados</h2>
            <p>
              Implementamos medidas de segurança projetadas para proteger suas informações contra acesso não autorizado, alteração ou divulgação.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Seus direitos</h2>
            <p>
              Você tem direito a:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Acessar os dados que temos sobre você;</li>
              <li>Corrigir informações imprecisas;</li>
              <li>Solicitar a exclusão de seus dados;</li>
              <li>Retirar consentimentos anteriormente concedidos;</li>
              <li>Opor-se ao processamento de seus dados.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Recomendamos verificar regularmente para estar ciente de qualquer alteração. Alterações significativas serão notificadas por email ou por um aviso em nosso site.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco pelo email <a href="mailto:contato@harmonia.media" className="text-harmonia-green hover:underline">contato@harmonia.media</a>.
            </p>

            <p className="mt-8 text-sm text-gray-500">
              Última atualização: 10 de maio de 2025
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
