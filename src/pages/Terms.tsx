
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            <p>
              Bem-vindo à harmonIA. Ao usar nosso site e serviços, você concorda com estes Termos de Serviço. 
              Por favor, leia-os cuidadosamente.
            </p>

            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou usar nossos serviços, você concorda em ficar vinculado a estes Termos de Serviço, 
              nossa Política de Privacidade e quaisquer termos adicionais aplicáveis.
            </p>

            <h2>2. Descrição dos Serviços</h2>
            <p>
              A harmonIA fornece serviços de composição musical personalizada utilizando inteligência artificial 
              e músicos profissionais. Nossos serviços incluem:
            </p>
            <ul>
              <li>Composição de músicas personalizadas</li>
              <li>Produção musical e arranjos</li>
              <li>Masterização de áudio</li>
              <li>Licenciamento musical</li>
            </ul>

            <h2>3. Direitos Autorais e Licenciamento</h2>
            <p>
              Quando você contrata nossos serviços, recebe uma licença para uso da música conforme especificado 
              no pacote escolhido. Os direitos específicos variam por pacote:
            </p>
            <ul>
              <li><strong>Pacote Essencial:</strong> Licença pessoal, não-comercial.</li>
              <li><strong>Pacote Profissional:</strong> Licença para uso comercial limitado.</li>
              <li><strong>Pacote Premium:</strong> Licença comercial ampla com direitos de exclusividade.</li>
            </ul>
            <p>
              A harmonIA mantém os direitos de propriedade intelectual subjacentes, exceto quando explicitamente 
              transferidos como parte do pacote Premium.
            </p>

            <h2>4. Conteúdo do Usuário</h2>
            <p>
              Ao enviar conteúdo para nossa plataforma (texto, áudio, imagens), você:
            </p>
            <ul>
              <li>Garante que possui os direitos necessários sobre este conteúdo.</li>
              <li>Concede à harmonIA permissão para usar esse conteúdo apenas para criar sua composição.</li>
              <li>Entende que não usaremos seu conteúdo para outros fins sem sua autorização explícita.</li>
            </ul>

            <h2>5. Pagamentos e Reembolsos</h2>
            <p>
              Os preços são apresentados antes da conclusão do pedido. Oferecemos:
            </p>
            <ul>
              <li>Reembolso total se cancelar antes do início da produção.</li>
              <li>Reembolso parcial se cancelar durante o processo criativo, dependendo do estágio.</li>
              <li>Revisões gratuitas conforme especificado em cada pacote.</li>
            </ul>

            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              A harmonIA não será responsável por danos indiretos, incidentais ou consequentes. 
              Nossa responsabilidade total é limitada ao valor pago pelo serviço.
            </p>

            <h2>7. Alterações aos Termos</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. As alterações entrarão em vigor após a 
              publicação no site. O uso contínuo dos serviços após as alterações constitui aceitação dos novos termos.
            </p>

            <h2>8. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes termos, entre em contato conosco pelo e-mail: 
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

export default Terms;
