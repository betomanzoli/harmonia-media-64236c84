
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import FinalDeliverySystem from '@/components/deliveries/FinalDeliverySystem';

interface DeliveryFile {
  id: string;
  name: string;
  format: string;
  size: string;
  url: string;
}

interface ProjectData {
  id: string;
  title: string;
  completionDate: string;
  files: DeliveryFile[];
}

const FinalDeliveryPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      setIsLoading(true);
      
      try {
        // In a production app, this would fetch data from the server
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock project data
        const mockProjectData: ProjectData = {
          id: projectId,
          title: 'Música para Casamento - Maria e João',
          completionDate: new Date().toISOString(),
          files: [
            {
              id: '1',
              name: 'Música_Final_Completa.wav',
              format: 'wav',
              size: '48MB',
              url: '#'
            },
            {
              id: '2',
              name: 'Música_Final_Completa.mp3',
              format: 'mp3',
              size: '9.4MB',
              url: '#'
            },
            {
              id: '3',
              name: 'Música_Final_SemVocais.wav',
              format: 'wav',
              size: '45MB',
              url: '#'
            },
            {
              id: '4',
              name: 'Música_Final_SemVocais.mp3',
              format: 'mp3',
              size: '8.8MB',
              url: '#'
            },
            {
              id: '5',
              name: 'Stems_Separados.zip',
              format: 'zip',
              size: '120MB',
              url: '#'
            }
          ]
        };

        setProjectData(mockProjectData);
      } catch (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os arquivos do projeto. Por favor, tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green mb-4" />
        <h2 className="text-xl font-medium text-gray-700">Carregando arquivos do projeto...</h2>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h2>
          <p className="text-gray-500 mb-6">
            Não foi possível encontrar os dados do projeto solicitado. O link pode ter expirado ou o projeto não existe.
          </p>
          <Button 
            onClick={() => navigate('/client-dashboard')}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 flex items-center text-gray-600"
            onClick={() => navigate('/client-dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{projectData.title}</h1>
          <p className="text-gray-600">
            Seus arquivos finais estão prontos para download.
          </p>
        </div>
        
        <FinalDeliverySystem 
          projectId={projectData.id}
          projectTitle={projectData.title}
          completionDate={projectData.completionDate}
          files={projectData.files}
        />
      </div>
    </div>
  );
};

export default FinalDeliveryPage;
