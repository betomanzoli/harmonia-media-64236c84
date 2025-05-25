
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BriefingComplete = () => {
  const [searchParams] = useSearchParams();
  const briefingId = searchParams.get('briefing_id');
  const [packageType, setPackageType] = useState<'essencial' | 'profissional' | 'premium'>('essencial');

  useEffect(() => {
    // Get package type from URL params with type safety
    const urlPackageType = searchParams.get('package') as 'essencial' | 'profissional' | 'premium';
    if (urlPackageType && ['essencial', 'profissional', 'premium'].includes(urlPackageType)) {
      setPackageType(urlPackageType);
    }
  }, [searchParams]);

  if (!briefingId) {
    return <Navigate to="/briefing" replace />;
  }

  const getPackageDetails = (type: 'essencial' | 'profissional' | 'premium') => {
    const packages = {
      essencial: {
        name: 'Essencial',
        price: 'R$ 299',
        turnaround: '5-7 dias úteis',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      profissional: {
        name: 'Profissional',
        price: 'R$ 599',
        turnaround: '7-10 dias úteis',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      premium: {
        name: 'Premium',
        price: 'R$ 999',
        turnaround: '10-14 dias úteis',
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      }
    };
    return packages[type];
  };

  const packageDetails = getPackageDetails(packageType);

  const nextSteps = [
    {
      step: 1,
      title: 'Pagamento',
      description: 'Finalize o pagamento para iniciar seu projeto',
      status: 'pending' as const
    },
    {
      step: 2,
      title: 'Produção',
      description: 'Nossa equipe iniciará a criação da sua música',
      status: 'upcoming' as const
    },
    {
      step: 3,
      title: 'Prévia',
      description: 'Você receberá uma prévia para feedback',
      status: 'upcoming' as const
    },
    {
      step: 4,
      title: 'Entrega Final',
      description: 'Versão final da sua música personalizada',
      status: 'upcoming' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Briefing Concluído!
          </h1>
          <p className="text-gray-600">
            Obrigado por compartilhar sua visão conosco. Seu briefing foi salvo com sucesso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Resumo do Pedido
                <Badge className={packageDetails.color}>
                  {packageDetails.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pacote Selecionado:</span>
                <span className="font-semibold">{packageDetails.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor:</span>
                <span className="font-semibold text-green-600">{packageDetails.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prazo:</span>
                <span className="font-semibold">{packageDetails.turnaround}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ID do Briefing:</span>
                <span className="font-mono text-sm">{briefingId}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step) => (
                  <div key={step.step} className="flex items-start space-x-3">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                      ${step.status === 'pending' 
                        ? 'bg-harmonia-green text-white' 
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-harmonia-green/5 border-harmonia-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-harmonia-green" />
              <div className="flex-1">
                <h3 className="font-semibold text-harmonia-green mb-1">
                  O que acontece agora?
                </h3>
                <p className="text-gray-700">
                  Em breve você receberá um e-mail com as instruções de pagamento. 
                  Após a confirmação, nossa equipe iniciará a produção da sua música personalizada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            className="bg-harmonia-green hover:bg-harmonia-green/90"
            onClick={() => window.location.href = '/'}
          >
            Voltar ao Início
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BriefingComplete;
