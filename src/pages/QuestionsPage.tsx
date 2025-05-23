
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const QuestionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Perguntas Frequentes</h1>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Quanto tempo leva para receber minha música?</AccordionTrigger>
                <AccordionContent>
                  O tempo de entrega varia conforme o pacote escolhido. Normalmente, nossos prazos são: Essencial (7-10 dias), 
                  Profissional (14-21 dias) e Premium (21-30 dias). Caso precise com urgência, temos opções de entrega expressa.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Como funciona o processo de criação?</AccordionTrigger>
                <AccordionContent>
                  Nosso processo começa com o preenchimento de um briefing detalhado. Com base nessas informações, 
                  nossos compositores criam uma versão inicial que você pode avaliar. Após seu feedback, 
                  fazemos os ajustes necessários até a aprovação final da composição.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Quantas revisões estão incluídas?</AccordionTrigger>
                <AccordionContent>
                  O número de revisões depende do pacote escolhido: Essencial (1 revisão), 
                  Profissional (2 revisões) e Premium (revisões ilimitadas). Revisões adicionais 
                  podem ser solicitadas por um valor extra.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Posso usar a música comercialmente?</AccordionTrigger>
                <AccordionContent>
                  Sim! Você recebe todos os direitos de uso da música. No pacote Premium, 
                  você também recebe os direitos autorais completos da composição.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Quais formatos de arquivo são entregues?</AccordionTrigger>
                <AccordionContent>
                  Entregamos a versão final em formato WAV e MP3 de alta qualidade. 
                  No pacote Premium, você também recebe os stems separados e o projeto de produção completo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuestionsPage;
