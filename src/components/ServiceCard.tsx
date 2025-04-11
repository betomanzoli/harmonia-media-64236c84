
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TermsDialog from './service-card/TermsDialog';
import FeatureList from './service-card/FeatureList';
import ServiceCardHeader from './service-card/ServiceCardHeader';
import { useServiceTerms } from '@/hooks/service-card/useServiceTerms';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended = false 
}) => {
  const navigate = useNavigate();
  
  const {
    isTermsDialogOpen,
    setIsTermsDialogOpen,
    acceptedTerms,
    setAcceptedTerms,
    handleChoosePackage,
    handleProceedToBriefing
  } = useServiceTerms(title);
  
  return (
    <div className={cn(
      "rounded-lg p-6 border transition-all duration-300 h-full flex flex-col",
      recommended 
        ? 'border-harmonia-green bg-gradient-to-b from-harmonia-green/10 to-transparent shadow-lg' 
        : 'border-border hover:border-harmonia-green/50 bg-card hover:bg-card/80'
    )}>
      <ServiceCardHeader 
        title={title}
        price={price}
        description={description}
        recommended={recommended}
      />
      
      <FeatureList features={features} />
      
      <Button 
        onClick={handleChoosePackage}
        className={cn(
          "w-full", 
          recommended ? 'bg-harmonia-green hover:bg-harmonia-green/90' : 'bg-secondary hover:bg-secondary/90'
        )}
      >
        Escolher Pacote
      </Button>
      
      <TermsDialog
        open={isTermsDialogOpen}
        onOpenChange={setIsTermsDialogOpen}
        title={title}
        acceptedTerms={acceptedTerms}
        onAcceptedTermsChange={setAcceptedTerms}
        onAccept={handleProceedToBriefing}
      />
    </div>
  );
};

export default ServiceCard;
