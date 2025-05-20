
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Success = () => {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-center">Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="mb-6">
            Sua operação foi concluída com sucesso. Obrigado por escolher nossos serviços!
          </p>
          
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/">Voltar ao Início</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
