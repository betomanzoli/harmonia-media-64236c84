
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NavLink from '@/components/NavLink';
import { siteConfig } from '@/config/site';

const QuestionsPage: React.FC = () => {
  const faqs = [
    {
      question: "Como funciona o processo de criação musical?",
      answer: "Nosso processo começa com o preenchimento de um briefing detalhado para entendermos sua visão. Em seguida, nossa equipe de compositores e produtores desenvolve uma prévia inicial. Você pode solicitar ajustes até estar completamente satisfeito. Após a aprovação, entregamos a versão final em alta qualidade."
    },
    {
      question: "Quanto tempo leva para criar uma música personalizada?",
      answer: "O tempo médio de produção é de 7 a 14 dias para o pacote Essencial, 14 a 21 dias para o Profissional, e 21 a 30 dias para o Premium. Prazos específicos são definidos durante a consulta inicial, dependendo da complexidade do projeto."
    },
    {
      question: "Como são feitas as revisões e ajustes?",
      answer: "Após recebermos seu feedback sobre a prévia inicial, nossa equipe faz os ajustes necessários. Oferecemos até 2 rodadas de revisão no pacote Essencial, 3 no Profissional e revisões ilimitadas no Premium para garantir sua satisfação."
    },
    {
      question: "Quais formatos de arquivo são entregues?",
      answer: "Entregamos arquivos WAV de alta resolução em todos os pacotes. O pacote Profissional inclui também versões em MP3, e o Premium oferece todos os formatos, incluindo stems individuais para maior flexibilidade."
    },
    {
      question: "Posso usar a música criada para fins comerciais?",
      answer: "Sim! Todos os nossos pacotes incluem licença para uso comercial. O pacote Premium inclui direitos exclusivos completos, permitindo uso ilimitado em qualquer meio ou plataforma."
    },
    {
      question: "Como é feito o pagamento?",
      answer: "Aceitamos pagamentos via cartão de crédito, PIX, transferência bancária e boleto. Geralmente solicitamos um depósito inicial de 50% para começar o projeto, com o restante devido na entrega."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* FAQ Hero Section */}
      <div className="bg-gradient-to-b from-harmonia-green/10 to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-center mt-4 text-gray-600 max-w-3xl mx-auto">
            Respostas para as dúvidas mais comuns sobre nossos serviços de composição e produção musical personalizada.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 bg-harmonia-green/5 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Ainda tem dúvidas?</h3>
          <p className="mb-4">
            Entre em contato conosco diretamente e teremos prazer em responder todas as suas perguntas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <NavLink href="/contact" className="bg-harmonia-green text-white px-4 py-2 rounded-md hover:bg-harmonia-green/90 text-center">
              Fale Conosco
            </NavLink>
            <NavLink href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`} external={true} className="bg-white border border-harmonia-green text-harmonia-green px-4 py-2 rounded-md hover:bg-harmonia-green/5 text-center">
              WhatsApp
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
