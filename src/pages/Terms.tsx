
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Terms: React.FC = () => {
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

          <h1 className="text-4xl font-bold mb-8">Termos de Serviço</h1>

          <div className="prose prose-lg max-w-none">
            <p>
              Ao utilizar os serviços da harmonIA, você concorda com estes termos de serviço. Por favor, leia-os cuidadosamente.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar nosso site e serviços, você concorda em ficar vinculado a estes Termos de Serviço. Se você não concorda com alguma parte destes termos, não poderá utilizar nossos serviços.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Descrição dos Serviços</h2>
            <p>
              A harmonIA oferece serviços de composição musical personalizada utilizando inteligência artificial combinada com expertise humana. Nossos serviços incluem:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Composição de músicas personalizadas;</li>
              <li>Produção musical;</li>
              <li>Revisões de acordo com o pacote contratado;</li>
              <li>Entrega digital dos arquivos musicais.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Compras e Pagamentos</h2>
            <p>
              Ao adquirir um de nossos pacotes, você concorda com os seguintes termos:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Os preços são apresentados em Reais (BRL) e incluem todos os impostos aplicáveis;</li>
              <li>O pagamento deve ser feito integralmente antes do início do serviço;</li>
              <li>Aceitamos pagamentos via MercadoPago, que inclui cartões de crédito, boleto bancário e Pix;</li>
              <li>O serviço será iniciado após a confirmação do pagamento.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Política de Reembolso</h2>
            <p>
              Devido à natureza personalizada de nossos serviços:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Reembolsos são possíveis apenas antes do início da produção da música;</li>
              <li>Após o envio da primeira prévia, não serão concedidos reembolsos;</li>
              <li>Se não pudermos atender às suas necessidades após tentativas razoáveis de revisão (conforme seu pacote), poderemos oferecer um reembolso parcial a nosso critério.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Direitos Autorais e Propriedade Intelectual</h2>
            <p>
              Os direitos autorais são concedidos conforme o pacote contratado:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Pacote Essencial: Licença para uso pessoal não-comercial;</li>
              <li>Pacote Profissional: Licença para uso em conteúdo digital próprio;</li>
              <li>Pacote Premium: Cessão de direitos autorais para uso comercial.</li>
            </ul>
            <p className="mt-4">
              Em todos os casos, a harmonIA mantém o direito de utilizar as músicas criadas em seu portfólio, com a devida atribuição ao cliente.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Prazos e Entregas</h2>
            <p>
              Os prazos de entrega variam conforme o pacote contratado e começam a contar a partir da confirmação do pagamento e recebimento do briefing completo.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Alterações aos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              A harmonIA não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, resultantes do uso ou incapacidade de usar nossos serviços.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa relacionada será submetida à jurisdição exclusiva dos tribunais brasileiros.
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

export default Terms;
