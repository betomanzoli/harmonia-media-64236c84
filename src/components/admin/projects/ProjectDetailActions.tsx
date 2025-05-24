
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Link, Calendar, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ProjectDetailActionsProps {
  projectId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  onAddVersion?: () => void;
  onShowPreviewLink?: () => void;
  onExtendDeadline?: () => void;
}

const ProjectDetailActions: React.FC<ProjectDetailActionsProps> = ({ 
  projectId, 
  clientName,
  clientEmail,
  clientPhone,
  onAddVersion,
  onShowPreviewLink,
  onExtendDeadline
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(clientPhone);
  
  // Fetch client data if phone is missing
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientPhone && clientEmail) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('clients')
            .select('phone')
            .eq('email', clientEmail)
            .single();
          
          if (data && !error) {
            console.log('Found client phone:', data.phone);
            setPhone(data.phone);
          }
        } catch (err) {
          console.error('Error fetching client phone:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchClientData();
  }, [clientEmail, clientPhone]);

  const handleWhatsAppClick = () => {
    if (!phone) {
      toast({
        title: "Telefone não disponível",
        description: "O cliente não tem um número de telefone cadastrado.",
        variant: "destructive"
      });
      return;
    }
    
    // Format phone number - ensure it only contains numbers
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Ensure phone has country code
    const phoneWithCountryCode = formattedPhone.startsWith('55') 
      ? formattedPhone 
      : `55${formattedPhone}`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleEmailClick = () => {
    if (!clientEmail) {
      toast({
        title: "Email não disponível",
        description: "O cliente não tem um email cadastrado.",
        variant: "destructive"
      });
      return;
    }
    
    window.location.href = `mailto:${clientEmail}?subject=Seu projeto musical - ${clientName || 'Harmonia'}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-3">Ações do Projeto</h3>
      
      <Button 
        className="w-full bg-harmonia-green hover:bg-harmonia-green/80" 
        onClick={onAddVersion}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Versão
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onShowPreviewLink}
      >
        <Link className="mr-2 h-4 w-4" /> Copiar Link de Prévia
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onExtendDeadline}
      >
        <Calendar className="mr-2 h-4 w-4" /> Estender Prazo
      </Button>
      
      <h3 className="text-lg font-semibold mt-6 mb-3">Contatar Cliente</h3>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleWhatsAppClick}
        disabled={!phone || loading}
      >
        <Phone className="mr-2 h-4 w-4" /> WhatsApp
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleEmailClick}
        disabled={!clientEmail}
      >
        <Mail className="mr-2 h-4 w-4" /> Email
      </Button>
    </div>
  );
};

export default ProjectDetailActions;
