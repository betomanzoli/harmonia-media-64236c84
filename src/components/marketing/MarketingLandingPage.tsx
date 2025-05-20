
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseData } from '@/hooks/use-supabase-data';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import ConversationalForm from './ConversationalForm';
import ThankYouScreen from './ThankYouScreen';
import { extractUtmParams, storeUtmParams } from '@/utils/utmUtils';

export type LeadData = {
  name: string;
  email: string;
  responses: Record<string, any>;
  redirectPage?: string;
  leadSource?: string;
  leadMedium?: string;
  leadCampaign?: string;
  leadContent?: string;
  leadTerm?: string;
};

const MarketingLandingPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Store UTM parameters when the page loads
  useEffect(() => {
    const utmParams = extractUtmParams(location.search);
    storeUtmParams(utmParams);
  }, [location.search]);

  const handleFormSubmit = async (data: LeadData) => {
    setIsSubmitting(true);
    try {
      // Save to Supabase
      const { data: savedLead, error } = await supabase
        .from('marketing_leads')
        .insert([{
          name: data.name,
          email: data.email,
          responses: data.responses,
          redirect_page: data.redirectPage,
          lead_source: data.leadSource,
          lead_medium: data.leadMedium,
          lead_campaign: data.leadCampaign,
          lead_content: data.leadContent,
          lead_term: data.leadTerm
        }])
        .select();

      if (error) {
        throw error;
      }

      // Send data to webhook
      try {
        await fetch('https://humbrock.app.n8n.cloud/webhook/16ae1112-2469-420d-8fcc-c9569152bd8f/marketing-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            lead: {
              ...data,
              id: savedLead?.[0]?.id,
              timestamp: new Date().toISOString()
            }
          }),
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Continue even if webhook fails
      }

      // Set completion state
      setLeadData(data);
      setIsComplete(true);
      
      // Redirect after a delay
      setTimeout(() => {
        const redirectUrl = getRedirectUrl(data.responses);
        navigate(redirectUrl);
      }, 5000);
      
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao processar suas respostas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine redirect URL based on responses
  const getRedirectUrl = (responses: Record<string, any>): string => {
    // Logic to determine the best page to redirect to
    const projectType = responses.projectType;
    
    if (projectType === 'evento_pessoal') {
      return '/pacotes?tipo=essencial';
    } else if (projectType === 'negocio') {
      return '/pacotes?tipo=profissional';
    } else if (projectType === 'presente') {
      return '/pacotes?tipo=premium';
    } else {
      return '/pacotes';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <div className="py-6 px-4 flex justify-center">
        <a href="/" className="text-3xl font-bold text-white">
          harmonIA
        </a>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-10 max-w-4xl mx-auto w-full">
        {isComplete ? (
          <ThankYouScreen leadData={leadData!} />
        ) : (
          <ConversationalForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting} 
          />
        )}
      </div>
      
      <footer className="py-6 px-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} harmonIA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default MarketingLandingPage;
