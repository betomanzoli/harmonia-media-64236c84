
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqData = [
    {
      question: "Quais são os pacotes disponíveis?",
      answer: "Oferecemos três pacotes:\n\nEssencial: Ideal para uso pessoal e presentes.\n\nProfissional: Para criadores de conteúdo e pequenos negócios, com mais opções e revisões.\n\nPremium: Para empresas e projetos corporativos, incluindo cessão total de direitos e diferenciais exclusivos."
    },
    {
      question: "Quais serviços extras posso contratar?",
      answer: "Você pode adicionar registro oficial, masterização premium, entrega expressa, partitura, stems extras, revisão adicional, entre outros."
    },
    {
      question: "Preciso entender de música para contratar?",
      answer: "Não! Basta contar sua história ou ideia. Nós criamos tudo para você."
    },
    {
      question: "Posso enviar uma letra pronta? Tenho desconto se já tiver a letra?",
      answer: "Sim, pode enviar uma letra ou rascunho, mas o valor do serviço não muda. A criação da letra está sempre inclusa no pacote."
    },
    {
      question: "Quais estilos musicais posso escolher?",
      answer: "Trabalhamos com todos os estilos: pop, sertanejo, rock, gospel, infantil, corporativo e outros. É só indicar o estilo ou artista de referência."
    },
    {
      question: "Como são escolhidas as vozes das músicas?",
      answer: "Usamos vozes geradas por IA, inspiradas no estilo ou artista que você indicar, mas nunca imitações exatas de famosos. Não utilizamos vozes humanas profissionais nem de artistas reais."
    },
    {
      question: "Posso pedir uma música com a voz de um cantor famoso?",
      answer: "Não. Por ética e respeito aos direitos autorais, não usamos vozes de artistas famosos. Prezamos pela originalidade e legalidade."
    },
    {
      question: "Como recebo minha música?",
      answer: "Você recebe o áudio em alta qualidade, a letra e um certificado digital de autoria, tudo por e-mail ou área do cliente. Nos pacotes Profissional e Premium, também pode receber stems separados, documentação de similaridade e, no Premium, registro em blockchain e na Biblioteca Nacional."
    },
    {
      question: "Minha música é registrada automaticamente?",
      answer: "Sua música já está protegida por lei desde a criação. O registro oficial é opcional e pode ser contratado como serviço extra. No Premium, o registro da letra na Biblioteca Nacional já está incluso."
    },
    {
      question: "Quais são os direitos de uso da música?",
      answer: "Essencial: Uso exclusivamente pessoal e não-comercial. Não pode revender, sublicenciar, sincronizar com vídeos comerciais ou ceder a terceiros.\n\nProfissional: Uso em conteúdo digital próprio, eventos particulares ou corporativos, monetização em canais próprios. Não pode sublicenciar, revender ou usar em produções audiovisuais comerciais para cinema/TV.\n\nPremium: Cessão total dos direitos autorais para qualquer uso, inclusive comercial, conforme termo de cessão anexo ao contrato."
    },
    {
      question: "Em quanto tempo recebo minha música?",
      answer: "O prazo varia conforme o pacote: até 7 dias úteis (Essencial), até 5 dias úteis (Profissional) e entrega prioritária (Premium). Entrega expressa disponível como extra."
    },
    {
      question: "E se eu não gostar do resultado?",
      answer: "Você pode solicitar revisões conforme o pacote escolhido. Revisões extras podem ser contratadas à parte."
    },
    {
      question: "Por quanto tempo posso pedir revisões?",
      answer: "Os arquivos do projeto ficam disponíveis para revisões por até 90 dias após a entrega final. Após esse prazo, os arquivos são arquivados e não é mais possível solicitar revisões."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "O pagamento é feito integralmente no ato da contratação. A produção só começa após a confirmação do pagamento."
    },
    {
      question: "Quem é responsável pelo uso da música?",
      answer: "O cliente assume total responsabilidade pelo uso da obra dentro dos limites do contrato. A harmonIA não se responsabiliza por uso indevido ou por disputas de terceiros decorrentes de uso fora do permitido."
    },
    {
      question: "Como funciona a verificação de similaridade? Isso garante originalidade?",
      answer: "Realizamos verificações automatizadas de similaridade da letra e da música, comparando com bancos de dados para mitigar riscos de coincidências ou plágio. Isso ajuda a garantir originalidade, mas não elimina totalmente a possibilidade de obras semelhantes ou disputas futuras. Todos os detalhes e limitações desse processo estão descritos em contrato."
    },
    {
      question: "Minha dúvida não está aqui. O que faço?",
      answer: "Fale com a gente pelo WhatsApp ou e-mail!\nharmonIA – Sua história, sua música."
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              harmonIA – Perguntas Frequentes
            </h1>
            <p className="text-lg text-gray-600">
              Tire suas dúvidas sobre nossos serviços e processos
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-harmonia-green">
                FAQ - Perguntas e Respostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {index + 1}. {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-gray-600 whitespace-pre-line">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Ainda tem dúvidas? Entre em contato conosco!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-harmonia-green text-white px-6 py-3 rounded-lg hover:bg-harmonia-green/90 transition-colors"
              >
                WhatsApp
              </a>
              <a 
                href="/contato" 
                className="border border-harmonia-green text-harmonia-green px-6 py-3 rounded-lg hover:bg-harmonia-green hover:text-white transition-colors"
              >
                Formulário de Contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FAQ;
