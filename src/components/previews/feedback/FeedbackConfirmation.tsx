
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from 'lucide-react';

const FeedbackConfirmation = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg border border-border">
          <div className="text-center">
            <div className="bg-harmonia-green/10 mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-harmonia-green" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Feedback Enviado!</h1>
            
            <p className="text-gray-400 mb-8">
              Agradecemos o seu feedback sobre as prévias musicais. Nossa equipe já está analisando suas considerações e entrará em contato em breve.
            </p>
            
            <div className="space-y-4">
              <Button asChild className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para a página inicial
                </Link>
              </Button>
              
              <p className="text-sm text-gray-500">
                Se precisar de qualquer assistência adicional, entre em contato conosco pelo email <a href="mailto:contato@harmonia.media" className="text-harmonia-green hover:underline">contato@harmonia.media</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackConfirmation;
