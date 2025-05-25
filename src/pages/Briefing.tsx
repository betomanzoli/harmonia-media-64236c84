
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import BriefingForm from '@/components/BriefingForm';
import ConversationalBriefing from '@/components/briefing/ConversationalBriefing';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Briefing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [useConversational, setUseConversational] = useState(false);

  // Get package from URL params
  const packageFromUrl = searchParams.get('package') as 'essencial' | 'profissional' | 'premium' | null;

  useEffect(() => {
    // Check if user prefers conversational briefing
    const conversationalMode = searchParams.get('mode') === 'conversational';
    setUseConversational(conversationalMode);
  }, [searchParams]);

  const handleBriefingSubmit = async (briefingId: string, packageType?: 'essencial' | 'profissional' | 'premium') => {
    try {
      toast({
        title: "Briefing enviado com sucesso!",
        description: "Entraremos em contato em breve para dar início ao seu projeto."
      });

      // Navigate to success page with briefing ID
      navigate(`/briefing-success?id=${briefingId}${packageType ? `&package=${packageType}` : ''}`);
    } catch (error) {
      console.error('Error handling briefing submission:', error);
      toast({
        title: "Erro ao processar briefing",
        description: "Ocorreu um erro. Tente novamente ou entre em contato conosco.",
        variant: "destructive"
      });
    }
  };

  if (useConversational) {
    return (
      <PublicLayout>
        <ConversationalBriefing 
          initialPackage={packageFromUrl || 'essencial'}
          onComplete={handleBriefingSubmit}
        />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <BriefingForm 
        selectedPackage={packageFromUrl || undefined}
        onSubmit={(briefingId) => handleBriefingSubmit(briefingId)}
      />
    </PublicLayout>
  );
};

export default Briefing;
