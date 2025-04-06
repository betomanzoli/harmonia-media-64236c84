
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import Footer from '@/components/Footer';
import BriefingForm from '@/components/BriefingForm';
import { Card } from '@/components/ui/card';

// Benefits displayed on the briefing section
const briefingBenefits = [
  {
    title: "Processo simples e rápido",
    description: "Após o envio do formulário, você receberá um contato em até 24 horas para confirmar detalhes e realizar o pagamento. A produção começa imediatamente após a confirmação."
  },
  {
    title: "Garantia de satisfação",
    description: "Oferecemos revisões gratuitas (quantidade varia conforme o pacote) para garantir que você fique 100% satisfeito com sua música."
  },
  {
    title: "Entrega segura",
    description: "Todas as músicas são entregues em formato digital de alta qualidade, com certificados e registros conforme o pacote escolhido."
  }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <section id="briefing" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">Criar Minha Música</h2>
              <p className="text-gray-400 mb-8">
                Preencha o formulário ao lado para iniciar seu projeto musical. Nossa equipe irá analisar seu briefing e
                entrar em contato para discutir os próximos passos.
              </p>
              <div className="space-y-6">
                {briefingBenefits.map((benefit, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </Card>
                ))}
              </div>
            </div>
            <BriefingForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
