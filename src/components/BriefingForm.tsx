
import React from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBriefingForm } from './briefing/useBriefingForm';
import PersonalInfoSection from './briefing/PersonalInfoSection';
import ReferencesSection from './briefing/ReferencesSection';
import EssentialPackageFields from './briefing/EssentialPackageFields';
import ProfessionalPackageFields from './briefing/ProfessionalPackageFields';
import PremiumPackageFields from './briefing/PremiumPackageFields';
import { Music, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBriefingData } from '@/hooks/useBriefingData';
import DynamicFormSection from './qualification/DynamicFormSection';

interface BriefingFormProps {
  packageType?: 'essencial' | 'profissional' | 'premium';
  initialData?: any;
  onSubmit?: (data: any) => void;
}

const BriefingForm: React.FC<BriefingFormProps> = ({ 
  packageType,
  initialData,
  onSubmit 
}) => {
  const location = useLocation();
  
  const getInitialPackage = (): 'essencial' | 'profissional' | 'premium' => {
    if (packageType) return packageType;
    
    const searchParams = new URLSearchParams(location.search);
    const packageParam = searchParams.get('package');
    
    if (packageParam && ['essencial', 'profissional', 'premium'].includes(packageParam)) {
      return packageParam as 'essencial' | 'profissional' | 'premium';
    }
    
    const paymentData = localStorage.getItem('paymentData');
    if (paymentData) {
      const { packageId } = JSON.parse(paymentData);
      if (['essencial', 'profissional', 'premium'].includes(packageId)) {
        return packageId as 'essencial' | 'profissional' | 'premium';
      }
    }
    
    return 'essencial';
  };
  
  const initialPackage = getInitialPackage();
  
  const { 
    form, 
    isSubmitting, 
    referenceFiles, 
    setReferenceFiles, 
    onSubmit: handleFormSubmit,
    selectedPackage
  } = useBriefingForm(initialPackage, initialData);

  const { sections, fields, loading } = useBriefingData(selectedPackage);

  // Custom submit handler that calls the provided onSubmit if available
  const handleCustomSubmit = async (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      await handleFormSubmit(data);
    }
  };

  const renderPackageTitle = () => {
    switch (selectedPackage) {
      case 'essencial':
        return "Briefing - Pacote Essencial";
      case 'profissional':
        return "Briefing - Pacote Profissional";
      case 'premium':
        return "Briefing - Pacote Premium";
      default:
        return "Formulário de Briefing";
    }
  };

  const renderPackageFields = () => {
    // Use dynamic form if we have data from Supabase
    if (sections.length > 0 && fields.length > 0) {
      return (
        <>
          {sections.map((section) => (
            <DynamicFormSection
              key={section.id}
              section={section}
              fields={fields.filter(field => field.section_id === section.id)}
              form={form}
            />
          ))}
        </>
      );
    }
    
    // Fallback to static components
    switch (selectedPackage) {
      case 'essencial':
        return <EssentialPackageFields />;
      case 'profissional':
        return <ProfessionalPackageFields />;
      case 'premium':
        return <PremiumPackageFields />;
      default:
        return <EssentialPackageFields />;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
        <span className="ml-2">Carregando formulário...</span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-harmonia-green/20 p-2 rounded-full">
          <Music className="w-5 h-5 text-harmonia-green" />
        </div>
        <h3 className="text-xl font-semibold">{renderPackageTitle()}</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCustomSubmit)} className="space-y-6">
          <PersonalInfoSection />
          
          {renderPackageFields()}
          
          <h3 className="text-lg font-semibold pt-4">Referências</h3>
          <ReferencesSection 
            referenceFiles={referenceFiles} 
            setReferenceFiles={setReferenceFiles} 
          />
          
          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Briefing"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BriefingForm;
