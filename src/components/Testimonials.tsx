
import React from 'react';
import TestimonialCard from './TestimonialCard';

interface TestimonialsProps {
  showTestimonials?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ showTestimonials = true }) => {
  if (!showTestimonials) return null;
  
  return (
    <section id="depoimentos" className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Que Dizem Sobre Nós</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Veja o que nossos clientes dizem sobre suas experiências com as composições personalizadas da harmonIA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Ana Clara"
            role="Noiva"
            testimonial="A música que a harmonIA criou para nossa primeira dança foi simplesmente perfeita! Todo mundo ficou emocionado e criamos uma memória única com uma música que conta nossa história."
            rating={5}
          />
          
          <TestimonialCard
            name="Rafael Souza"
            role="Empresário"
            testimonial="Contratei para fazer uma surpresa para minha esposa em nosso aniversário de 10 anos. O resultado superou todas as expectativas! Recomendo demais."
            rating={5}
          />
          
          <TestimonialCard
            name="Caroline Martins"
            role="Profissional de Marketing"
            testimonial="Precisávamos de uma música original para nossa campanha, e a harmonIA entendeu perfeitamente o briefing. A entrega foi rápida e as músicas ficaram exatamente como imaginávamos."
            rating={5}
          />
        </div>
        
        <div className="mt-12 flex justify-center">
          <a href="/contato" className="text-harmonia-green hover:underline flex items-center">
            Quero compartilhar minha experiência
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
