import React from 'react';
import TestimonialCard from './TestimonialCard';
interface TestimonialsProps {
  showTestimonials?: boolean;
}
const Testimonials: React.FC<TestimonialsProps> = ({
  showTestimonials = true
}) => {
  if (!showTestimonials) return null;
  const testimonials = [{
    id: 1,
    name: "Maria Silva",
    role: "Noiva",
    comment: "A música que a harmonIA criou para nosso casamento foi simplesmente perfeita. Captou exatamente a emoção que queríamos para nosso momento especial.",
    rating: 5
  }, {
    id: 2,
    name: "Carlos Mendes",
    role: "Diretor de Marketing",
    comment: "Contratamos para um jingle publicitário e superou todas as expectativas. O resultado trouxe exatamente a identidade que buscávamos para nossa marca.",
    rating: 5
  }, {
    id: 3,
    name: "Ana Ferreira",
    role: "Cliente Particular",
    comment: "Encomendei uma música para presentear meu marido em nosso aniversário. Foi uma experiência incrível e ele se emocionou muito!",
    rating: 5
  }];
  return;
};
export default Testimonials;