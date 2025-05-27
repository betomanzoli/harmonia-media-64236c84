
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Briefing: React.FC = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: 'Pacote Essencial',
      price: 'R$ 219,00',
      description: 'Ideal para presentes emocionais rápidos.',
      features: [
        'Composição musical única',
        'Uma revisão gratuita',
        'Uso exclusivamente pessoal',
        'Entrega digital em até 7 dias',
        'Suporte por e-mail',
        'Arquivo digital em alta qualidade (MP3/WAV)',
        'Certificado digital de autoria'
      ],
      formUrl: 'https://forms.cloud.microsoft.com/r/0wi3ArSLXv',
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      name: 'Pacote Profissional',
      price: 'R$ 479,00',
      description: 'Perfeito para criadores de conteúdo e pequenos negócios.',
      features: [
        'Composição musical personalizada',
        'Até três revisões gratuitas',
        'Licença para uso em conteúdo digital próprio',
        'Três versões para escolha',
        'Entrega em até 5 dias',
        'Suporte prioritário',
        'Masterização básica IA',
        'Stems separados (vocais + instrumentação)'
      ],
      formUrl: 'https://forms.cloud.microsoft.com/r/vvd6cq6i2a',
      color: 'border-green-200 hover:border-green-300',
      popular: true
    },
    {
      name: 'Pacote Premium',
      price: 'R$ 969,00',
      description: 'Melhor opção para empresas e projetos corporativos.',
      features: [
        'Composição totalmente personalizada',
        'Revisões ilimitadas (até aprovação)',
        'Cessão total dos direitos autorais',
        'Cinco versões para escolha',
        'Registro na Biblioteca Nacional',
        'Certificado blockchain',
        'Consultoria de 30 minutos',
        'Entrega prioritária',
        'Suporte VIP por WhatsApp',
        'Partitura em formato MusicXML'
      ],
      formUrl: 'https://forms.cloud.microsoft.com/r/fd0AG5N3it',
      color: 'border-purple-200 hover:border-purple-300'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Button>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Escolha seu Pacote</h1>
            <p className="text-gray-400 max-w-3xl mx-auto mb-6">
              Selecione o pacote que melhor atende às suas necessidades e preencha o briefing correspondente. 
              Sua música será criada após a confirmação do pagamento.
            </p>
            
            <Alert className="max-w-2xl mx-auto mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> O preenchimento do briefing é o primeiro passo. 
                A produção da sua música só será iniciada após a confirmação do pagamento.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg) => (
              <Card key={pkg.name} className={`relative ${pkg.color} transition-colors`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-harmonia-green text-white px-4 py-1 rounded-full text-sm font-medium">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-harmonia-green mb-2">{pkg.price}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-harmonia-green shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                    onClick={() => window.open(pkg.formUrl, '_blank')}
                  >
                    Preencher Briefing
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-500 mb-4">
              Tem dúvidas sobre qual pacote escolher?
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/faq')}
              className="mr-4"
            >
              Ver Perguntas Frequentes
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/5511920585072', '_blank')}
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Briefing;
