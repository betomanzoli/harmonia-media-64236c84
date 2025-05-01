
import React from 'react';
import TestimonialCard from './TestimonialCard';

interface TestimonialsProps {
  showTestimonials?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  showTestimonials = true
}) => {
  if (!showTestimonials) return null;
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">O que nossos clientes dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            clientName="Maria Silva"
            position="Noiva"
            testimonial="A música personalizada criada para o nosso casamento foi simplesmente perfeita. Todos os convidados se emocionaram!"
            rating={5}
          />
          <TestimonialCard
            clientName="João Santos"
            position="Diretor Criativo"
            testimonial="Utilizamos as composições da harmonIA para nossa campanha publicitária e o resultado superou todas as expectativas."
            rating={5}
          />
          <TestimonialCard
            clientName="Ana Oliveira"
            position="Empreendedora"
            testimonial="O jingle criado para minha marca trouxe personalidade e reconhecimento imediato. Trabalho excepcional!"
            rating={5}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
