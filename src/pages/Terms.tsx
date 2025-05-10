
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
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
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Termos e Condições</h1>
          
          <div className="prose prose-invert max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar os serviços oferecidos pela harmonIA ("nós", "nosso" ou "Empresa"), você concorda 
              com os seguintes termos e condições. Se você não concordar com algum destes termos, por favor, 
              não use nossos serviços.
            </p>
            
            <h2>2. Descrição do Serviço</h2>
            <p>
              A harmonIA oferece serviços de composição musical personalizada utilizando inteligência artificial 
              combinada com produção musical humana. Nossos serviços incluem, mas não se limitam a, criação de músicas 
              originais baseadas nas preferências e informações fornecidas pelos clientes.
            </p>
            
            <h2>3. Processo de Encomenda</h2>
            <p>
              Para solicitar uma música personalizada, os clientes devem preencher um formulário de briefing 
              detalhando suas preferências musicais e objetivos. Após o recebimento do pagamento, nossa equipe 
              iniciará o processo de criação.
            </p>
            
            <h2>4. Direitos Autorais e Licenciamento</h2>
            <p>
              Os direitos de uso da música variam de acordo com o pacote adquirido:
            </p>
            <ul>
              <li><strong>Pacote Essencial:</strong> Licença para uso pessoal não comercial.</li>
              <li><strong>Pacote Profissional:</strong> Licença para uso em conteúdo digital próprio.</li>
              <li><strong>Pacote Premium:</strong> Cessão total dos direitos autorais da obra.</li>
            </ul>
            <p>
              A menos que especificado no pacote Premium, a harmonIA mantém os direitos autorais sobre as composições. 
              O uso não autorizado das composições além do escopo da licença adquirida constitui violação de direitos autorais.
            </p>
            
            <h2>5. Revisões e Alterações</h2>
            <p>
              O número de revisões permitidas varia de acordo com o pacote adquirido. Alterações adicionais 
              podem estar sujeitas a cobranças extras conforme acordado previamente.
            </p>
            
            <h2>6. Prazos de Entrega</h2>
            <p>
              Os prazos são estimados e podem variar dependendo da complexidade do projeto e do volume de trabalho. 
              A harmonIA se esforçará para cumprir os prazos acordados, mas não se responsabiliza por atrasos 
              causados por fatores externos ou revisões extensas solicitadas pelo cliente.
            </p>
            
            <h2>7. Política de Reembolso</h2>
            <p>
              Reembolsos totais são oferecidos apenas se a harmonIA não conseguir entregar a música conforme 
              especificado no briefing após todas as revisões permitidas. Não há reembolso para serviços 
              já iniciados ou concluídos que atendam às especificações acordadas.
            </p>
            
            <h2>8. Confidencialidade</h2>
            <p>
              A harmonIA trata todas as informações fornecidas pelos clientes com confidencialidade, mas 
              pode usar as músicas criadas para exibição em seu portfólio, a menos que acordado diferentemente.
            </p>
            
            <h2>9. Responsabilidade</h2>
            <p>
              A harmonIA não se responsabiliza por danos consequenciais, indiretos ou incidentais relacionados 
              ao uso das composições fornecidas.
            </p>
            
            <h2>10. Modificações dos Termos</h2>
            <p>
              A harmonIA se reserva o direito de modificar estes termos a qualquer momento. As modificações 
              entram em vigor imediatamente após a publicação no site.
            </p>
            
            <h2>11. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil, e quaisquer disputas relacionadas a estes termos 
              serão resolvidas nos tribunais de São Paulo, SP.
            </p>
            
            <h2>12. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes termos, entre em contato conosco pelo e-mail: {siteConfig.contact.email}
            </p>
            
            <p className="mt-8 text-sm text-gray-400">
              Última atualização: 19 de abril de 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
