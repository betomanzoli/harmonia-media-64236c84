
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const QualificationBriefing = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Qualificação do Projeto</h1>
      <Card>
        <CardContent className="py-6">
          <p className="mb-6">
            Nosso questionário de qualificação ajudará a entender melhor suas necessidades e determinar o pacote ideal para seu projeto musical.
          </p>
          
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/briefing">Iniciar Qualificação</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualificationBriefing;
