
import React from 'react';
import TestimonialCard from './TestimonialCard';

interface TestimonialsProps {
  showTestimonials?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  showTestimonials = true
}) => {
  if (!showTestimonials) return null;
  
  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      role: "Noiva",
      comment: "A música que a harmonIA criou para nosso casamento foi simplesmente perfeita. Captou exatamente a emoção que queríamos para nosso momento especial.",
      rating: 5
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Diretor de Marketing",
      comment: "Contratamos para um jingle publicitário e superou todas as expectativas. O resultado trouxe exatamente a identidade que buscávamos para nossa marca.",
      rating: 5
    },
    {
      id: 3,
      name: "Ana Ferreira",
      role: "Cliente Particular",
      comment: "Encomendei uma música para presentear meu marido em nosso aniversário. Foi uma experiência incrível e ele se emocionou muito!",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">O que nossos clientes dizem</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Veja o que as pessoas estão falando sobre nossas músicas personalizadas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              clientName={testimonial.name}
              position={testimonial.role}
              testimonial={testimonial.comment}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
