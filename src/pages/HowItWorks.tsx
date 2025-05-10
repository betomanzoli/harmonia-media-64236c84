
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Music, Send, ThumbsUp, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Escolha seu pacote",
      description: "Selecione o pacote que melhor atende às suas necessidades. Temos opções para presentes pessoais, uso profissional e empresarial.",
      icon: <Sparkles className="h-10 w-10 text-harmonia-green" />,
    },
    {
      title: "Preencha o briefing",
      description: "Conte-nos sobre sua história, emoção ou ideia que deseja transformar em música. Quanto mais detalhes, melhor será o resultado.",
      icon: <Send className="h-10 w-10 text-harmonia-green" />,
    },
    {
      title: "Receba sua prévia",
      description: "Nossa equipe combinará IA e expertise humana para criar sua música personalizada. Você receberá uma prévia para aprovação.",
      icon: <Music className="h-10 w-10 text-harmonia-green" />,
    },
    {
      title: "Solicite ajustes",
      description: "Se necessário, solicite ajustes conforme o número de revisões incluídas em seu pacote até que a música esteja perfeita.",
      icon: <ThumbsUp className="h-10 w-10 text-harmonia-green" />,
    },
    {
      title: "Receba sua música",
      description: "Após a aprovação final, você receberá sua música em alta qualidade, pronta para emocionar, conectar ou inspirar.",
      icon: <Download className="h-10 w-10 text-harmonia-green" />,
    },
  ];

  const faqs = [
    {
      question: "Quanto tempo leva para receber minha música?",
      answer: "O prazo de entrega depende do pacote selecionado. O Pacote Essencial tem entrega em até 7 dias úteis, o Pacote Profissional em até 5 dias úteis, e o Pacote Premium em até 7 dias úteis com prioridade no atendimento. Estes prazos começam a contar após a aprovação do briefing e confirmação do pagamento."
    },
    {
      question: "Como funciona o processo de revisão?",
      answer: "Após recebermos seu briefing, criamos uma primeira versão da música e enviamos para sua aprovação. Você poderá solicitar ajustes conforme o número de revisões incluídas em seu pacote. O Pacote Essencial inclui 1 revisão, o Profissional até 3 revisões, e o Premium oferece revisões ilimitadas até sua completa satisfação."
    },
    {
      question: "Quais direitos eu tenho sobre a música?",
      answer: "Os direitos variam conforme o pacote. O Pacote Essencial concede uso pessoal não-comercial. O Pacote Profissional permite uso em conteúdo digital próprio com créditos. O Pacote Premium inclui a cessão dos direitos autorais para uso comercial sem restrições."
    },
    {
      question: "Posso escolher o estilo musical?",
      answer: "Sim! No briefing você pode especificar o estilo musical desejado, referências de artistas ou músicas, e todos os detalhes que considera importantes para a criação da sua música personalizada."
    },
    {
      question: "E se eu não gostar da música?",
      answer: "Nosso objetivo é sua total satisfação! Por isso, oferecemos revisões incluídas em todos os pacotes. Se após todas as revisões disponíveis você ainda não estiver satisfeito, entraremos em contato para encontrar a melhor solução."
    },
    {
      question: "Vocês trabalham com músicas em outros idiomas?",
      answer: "Sim! Podemos criar músicas em português, inglês, espanhol e outros idiomas. Basta especificar no briefing o idioma desejado para a sua composição."
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Como Funciona</h1>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Transformamos suas histórias, emoções e ideias em músicas únicas e personalizadas através de um processo simples e eficiente.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mb-24">
            {/* Connect line */}
            <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gray-200 hidden md:block"></div>
            
            <div className="space-y-20 relative">
              {steps.map((step, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                  
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-harmonia-green z-10">
                    {step.icon}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 mb-20 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold mb-2">Pronto para começar?</h2>
                <p className="text-gray-300 max-w-lg">
                  Escolha um de nossos pacotes personalizados e transforme suas histórias em músicas inesquecíveis.
                </p>
              </div>
              <Button asChild size="lg" className="bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                <Link to="/pacotes">
                  Ver pacotes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-500">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher a harmonIA?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-harmonia-green" />
                </div>
                <h3 className="font-bold text-xl mb-2">Tecnologia + Talento Humano</h3>
                <p className="text-gray-500">
                  Combinamos inteligência artificial avançada com expertise musical humana para criar composições únicas.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                  <Music className="h-8 w-8 text-harmonia-green" />
                </div>
                <h3 className="font-bold text-xl mb-2">100% Personalizado</h3>
                <p className="text-gray-500">
                  Cada música é criada especificamente para você, considerando sua história, emoções e preferências.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                  <ThumbsUp className="h-8 w-8 text-harmonia-green" />
                </div>
                <h3 className="font-bold text-xl mb-2">Satisfação Garantida</h3>
                <p className="text-gray-500">
                  Trabalhamos com revisões incluídas em todos os pacotes para garantir que você fique 100% satisfeito.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-harmonia-green hover:bg-harmonia-green/90">
              <Link to="/briefing">
                Iniciar meu projeto musical
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HowItWorks;
