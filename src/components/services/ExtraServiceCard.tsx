
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from 'react';

interface ExtraServiceCardProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  icon: LucideIcon;
  serviceId: string;
  onServiceClick: () => void;
}

const ExtraServiceCard: React.FC<ExtraServiceCardProps> = ({
  title,
  price,
  description,
  features,
  icon: Icon,
  serviceId,
  onServiceClick,
}) => {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const renderPlagiarismDetails = () => (
    <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Avaliação de Risco de Plágio Musical</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4 text-sm">
          <p>
            Como serviço extra, oferecemos a avaliação de risco de plágio de melodia e arranjo utilizando uma das plataformas mais avançadas do mundo para detecção de similaridade musical. A plataforma utiliza inteligência artificial para analisar profundamente elementos como melodia, harmonia, ritmo e estrutura, comparando sua música com bilhões de obras já lançadas globalmente.
          </p>
          
          <p>
            Após a análise, você recebe um relatório detalhado indicando o grau de similaridade e eventuais trechos que merecem atenção, ajudando a proteger sua propriedade intelectual antes do lançamento ou registro.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-bold mb-2">Ressalvas importantes:</h3>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Nenhum sistema automatizado garante 100% de proteção.</li>
              <li>O resultado deve ser interpretado como um indicativo robusto.</li>
              <li>Não substitui uma análise pericial humana em casos de alta relevância jurídica ou comercial.</li>
              <li>Para letras de músicas, utilizamos plataformas especializadas em detecção de plágio textual.</li>
            </ul>
          </div>
          
          <p className="italic">
            Essa abordagem integrada maximiza a segurança e a originalidade do seu trabalho musical.
          </p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );

  const showPlagiarismDetailsButton = title.includes("Avaliação de Risco de Plágio");

  return (
    <>
      <div className="bg-card border border-border hover:border-harmonia-green/50 rounded-lg p-6 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Icon className="text-harmonia-green w-5 h-5" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className={`font-bold ${typeof price === 'string' && price.includes('Consultar') ? 'text-amber-400' : 'text-harmonia-green'}`}>
              {typeof price === 'number' ? `R$${price}` : price}
            </span>
            <span className="text-xs text-amber-400 font-medium">Promocional</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          {description}
        </p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="text-sm text-gray-300">{feature}</li>
          ))}
        </ul>
        <div className="flex space-x-2">
          <Button 
            onClick={onServiceClick}
            className="w-full bg-secondary hover:bg-secondary/90"
          >
            {price.toString().includes('Consultar') ? 'Solicitar Orçamento Personalizado' : `Adicionar ${title}`}
          </Button>
          {showPlagiarismDetailsButton && (
            <Button 
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(true)}
              className="w-full"
            >
              Saiba Mais
            </Button>
          )}
        </div>
      </div>
      {showPlagiarismDetailsButton && renderPlagiarismDetails()}
    </>
  );
};

export default ExtraServiceCard;

