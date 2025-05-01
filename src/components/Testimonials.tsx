import React from 'react';
import TestimonialCard from './TestimonialCard';
interface TestimonialsProps {
  showTestimonials?: boolean;
}
const Testimonials: React.FC<TestimonialsProps> = ({
  showTestimonials = true
}) => {
  if (!showTestimonials) return null;
  return;
};
export default Testimonials;