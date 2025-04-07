
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import Footer from '@/components/Footer';
import BriefingForm from '@/components/BriefingForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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

        {/* Call to Action for Qualification Form */}
        <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-background to-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Comece Sua Jornada Musical</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Descubra qual pacote é o ideal para você. Responda algumas perguntas rápidas e receba recomendações personalizadas.
            </p>
            <Link to="/qualificacao">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                Preencher Formulário de Qualificação
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

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
