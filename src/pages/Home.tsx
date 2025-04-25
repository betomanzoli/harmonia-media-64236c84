
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music, FileText, Headphones, Check } from 'lucide-react';
import NavLink from '@/components/NavLink';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        
        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-20 px-6 md:px-10 bg-gradient-to-b from-background to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Transformar sua história em música é um processo simples e colaborativo.
                Veja como funciona:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-black/40 p-6 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-harmonia-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="pt-4 text-center mb-4">
                  <FileText className="w-10 h-10 mx-auto text-harmonia-green mb-2" />
                  <h3 className="text-xl font-bold">Briefing</h3>
                </div>
                <p className="text-gray-400 text-center">
                  Compartilhe sua história e preferências musicais através do nosso briefing detalhado.
                </p>
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Descreva sua história e sentimentos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Escolha estilos musicais de referência</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Informe detalhes importantes</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 p-6 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-harmonia-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="pt-4 text-center mb-4">
                  <Music className="w-10 h-10 mx-auto text-harmonia-green mb-2" />
                  <h3 className="text-xl font-bold">Composição</h3>
                </div>
                <p className="text-gray-400 text-center">
                  Nossa equipe cria múltiplas versões musicais baseadas em sua história.
                </p>
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>IA analisa sua história e emoções</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Músicos profissionais criam as composições</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Múltiplas opções são desenvolvidas</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 p-6 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-harmonia-green text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="pt-4 text-center mb-4">
                  <Headphones className="w-10 h-10 mx-auto text-harmonia-green mb-2" />
                  <h3 className="text-xl font-bold">Feedback e Entrega</h3>
                </div>
                <p className="text-gray-400 text-center">
                  Você ouve as versões, escolhe sua favorita e recebe a música finalizada.
                </p>
                <div className="mt-4 text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Acesso a todas as versões criadas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Possibilidade de solicitar ajustes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                    <span>Entrega da música finalizada em alta qualidade</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <NavLink href="/briefing">
                <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                  Iniciar Meu Projeto
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </NavLink>
            </div>
          </div>
        </section>
        
        <Services />
        <Testimonials showTestimonials={false} />

        {/* Call to Action */}
        <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-background to-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Transforme sua história em música</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Escolha um de nossos pacotes e crie uma composição musical personalizada
              com a harmonIA.
            </p>
            
            <NavLink href="/servicos">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                Ver Pacotes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </NavLink>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
