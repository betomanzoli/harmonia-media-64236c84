
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import NavLink from '@/components/NavLink';

// Benefits displayed on the qualification section
const qualificationBenefits = [{
  title: "Processo simples e personalizado",
  description: "Após preencher o formulário de qualificação, você receberá recomendações personalizadas e poderá escolher o pacote ideal para seu projeto."
}, {
  title: "Economize tempo e dinheiro",
  description: "Nosso processo de qualificação garante que você receba o pacote mais adequado às suas necessidades, sem gastar mais do que o necessário."
}, {
  title: "Entrega garantida",
  description: "Após o pagamento, você terá acesso ao briefing completo e acompanhamento dedicado de todo o processo de produção da sua música."
}];
const Index: React.FC = () => {
  return <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        {/* Porfolio section temporarily hidden */}
        <Testimonials showTestimonials={false} />

        {/* Call to Action for Qualification Form */}
        <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-background to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nosso Fluxo de Trabalho</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Simplificamos nosso processo para oferecer a melhor experiência:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="p-6 border-harmonia-green/20 hover:border-harmonia-green/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-harmonia-green/20 flex items-center justify-center">
                    <span className="text-harmonia-green font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Qualificação</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Responda algumas perguntas para entendermos suas necessidades e recebermos recomendações personalizadas.
                </p>
                <CheckCircle2 className="text-harmonia-green h-5 w-5 ml-auto" />
              </Card>
              
              <Card className="p-6 border-harmonia-green/20 hover:border-harmonia-green/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-harmonia-green/20 flex items-center justify-center">
                    <span className="text-harmonia-green font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Pagamento</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Escolha o pacote recomendado e realize o pagamento de forma segura através de nossas opções disponíveis.
                </p>
                <CheckCircle2 className="text-harmonia-green h-5 w-5 ml-auto" />
              </Card>
              
              <Card className="p-6 border-harmonia-green/20 hover:border-harmonia-green/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-harmonia-green/20 flex items-center justify-center">
                    <span className="text-harmonia-green font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Briefing Completo</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Após o pagamento, preencha o briefing detalhado para iniciarmos a produção da sua música personalizada.
                </p>
                <CheckCircle2 className="text-harmonia-green h-5 w-5 ml-auto" />
              </Card>
            </div>
            
            <div className="text-center">
              <NavLink href="/qualificacao">
                <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                  Iniciar Qualificação
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>
          </div>
        </section>

        <section id="qualificacao" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">Vamos Entender Suas Necessidades</h2>
              <p className="text-gray-400 mb-8">
                Nosso formulário de qualificação foi desenvolvido para entender exatamente o que você precisa
                e recomendar o pacote ideal para seu projeto musical.
              </p>
              <div className="space-y-6">
                {qualificationBenefits.map((benefit, index) => <Card key={index} className="p-6">
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </Card>)}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Pronto para Começar?</h3>
                <p className="text-gray-400 mb-6">
                  Preencha nosso formulário de qualificação para receber uma recomendação personalizada
                  baseada nas suas necessidades específicas.
                </p>
                <NavLink href="/qualificacao">
                  <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                    Iniciar Qualificação
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Index;
