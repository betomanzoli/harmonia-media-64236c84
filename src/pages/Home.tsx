
import React from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import NavLink from '@/components/NavLink';

const Home: React.FC = () => {
  // Disable chatbot initialization
  React.useEffect(() => {
    // Remove any existing chatbot script or disable its initialization
    if ((window as any).harmonIAChatbot) {
      // Set a flag to prevent initialization
      localStorage.setItem('chatbot-disabled', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
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
            
            <NavLink href="/services">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
                Ver Pacotes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </NavLink>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
