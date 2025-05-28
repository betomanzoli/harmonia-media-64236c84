
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Music } from 'lucide-react';

const BriefingComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [packageType, setPackageType] = useState<'essencial' | 'profissional' | 'premium'>('essencial');

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg && ['essencial', 'profissional', 'premium'].includes(pkg)) {
      setPackageType(pkg as 'essencial' | 'profissional' | 'premium');
    }
  }, [searchParams]);

  const getPackageTitle = () => {
    switch (packageType) {
      case 'essencial':
        return 'Pacote Essencial';
      case 'profissional':
        return 'Pacote Profissional';
      case 'premium':
        return 'Pacote Premium';
      default:
        return 'Pacote Selecionado';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Briefing Enviado!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div>
            <p className="text-gray-600 mb-2">
              Seu briefing para o <strong>{getPackageTitle()}</strong> foi enviado com sucesso.
            </p>
            <p className="text-sm text-gray-500">
              Nossa equipe analisará suas informações e entrará em contato em breve.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Music className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-600">Próximos Passos</span>
            </div>
            <p className="text-sm text-blue-700">
              Você receberá um e-mail de confirmação com os detalhes do seu projeto
              e instruções para acompanhar o progresso.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Voltar ao Início
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/services')}
              className="w-full"
            >
              Ver Outros Serviços
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefingComplete;
