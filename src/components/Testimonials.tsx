
import React from 'react';
import TestimonialCard from './TestimonialCard';

interface TestimonialsProps {
  showTestimonials?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ showTestimonials = true }) => {
  if (!showTestimonials) return null;
  
  return (
    <section id="depoimentos" className="py-20 px-6 md:px-10 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem sobre HarmonIA</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Centenas de clientes satisfeitos compartilham suas experiências com nossos serviços de composição musical.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard 
            quote="A música capturou exatamente a emoção que eu queria transmitir! Foi o presente perfeito para o aniversário da minha mãe." 
            author="Ana Silva"
            rating={5}
          />
          <TestimonialCard 
            quote="Nosso jingle ficou incrível! Os clientes adoraram a identidade sonora e já notamos um aumento no reconhecimento da marca." 
            author="João Santos"
            role="CEO da Tech Solutions"
            rating={5}
          />
          <TestimonialCard 
            quote="A equipe foi super atenciosa e entregou tudo antes do prazo! A qualidade da música superou todas as minhas expectativas." 
            author="Mariana Costa"
            rating={5}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
