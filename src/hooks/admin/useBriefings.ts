
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BriefingItem {
  id: string;
  clientName: string;
  email: string;
  projectDescription: string;
  packageType: string;
  status: string;
  createdAt: string;
  budget?: string;
  timeline?: string;
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<BriefingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadBriefings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar briefings:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os briefings.",
          variant: "destructive"
        });
        return;
      }

      const formattedBriefings: BriefingItem[] = data.map(briefing => ({
        id: briefing.id,
        clientName: briefing.data?.clientName || 'Cliente sem nome',
        email: briefing.data?.email || 'Email não informado',
        projectDescription: briefing.data?.projectDescription || 'Descrição não informada',
        packageType: briefing.package_type || 'Não definido',
        status: briefing.status || 'pending',
        createdAt: new Date(briefing.created_at).toLocaleDateString('pt-BR'),
        budget: briefing.data?.budget,
        timeline: briefing.data?.timeline
      }));

      setBriefings(formattedBriefings);
    } catch (error) {
      console.error('Erro ao carregar briefings:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar briefings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBriefing = async (briefingData: {
    clientName: string;
    email: string;
    projectDescription: string;
    packageType: 'essencial' | 'profissional' | 'premium';
    budget?: string;
    timeline?: string;
    phone?: string;
    company?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .insert({
          package_type: briefingData.packageType,
          status: 'pending',
          data: {
            clientName: briefingData.clientName,
            email: briefingData.email,
            projectDescription: briefingData.projectDescription,
            budget: briefingData.budget,
            timeline: briefingData.timeline,
            phone: briefingData.phone,
            company: briefingData.company,
            createdAt: new Date().toISOString()
          },
          initial_responses: {
            clientName: briefingData.clientName,
            email: briefingData.email,
            projectDescription: briefingData.projectDescription
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar briefing:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o briefing.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Briefing criado com sucesso!",
      });

      // Recarregar a lista
      await loadBriefings();
      
      return data;
    } catch (error) {
      console.error('Erro ao criar briefing:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar briefing.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteBriefing = async (briefingId: string) => {
    try {
      const { error } = await supabase
        .from('briefings')
        .update({ is_deleted: true })
        .eq('id', briefingId);

      if (error) {
        console.error('Erro ao deletar briefing:', error);
        toast({
          title: "Erro",
          description: "Não foi possível deletar o briefing.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Briefing deletado com sucesso!",
      });

      // Recarregar a lista
      await loadBriefings();
      return true;
    } catch (error) {
      console.error('Erro ao deletar briefing:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar briefing.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadBriefings();
  }, []);

  return {
    briefings,
    isLoading,
    createBriefing,
    deleteBriefing,
    loadBriefings
  };
};
