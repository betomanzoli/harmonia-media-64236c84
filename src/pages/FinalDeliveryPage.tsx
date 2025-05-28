import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Music, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FinalDeliveryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // Simulação de busca no Supabase
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Erro ao buscar projeto:', error);
          return;
        }

        setProject(data);
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        Projeto não encontrado.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader className="flex flex-col items-center space-y-2">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl font-bold">Entrega Finalizada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Seu projeto <span className="font-semibold">{project.title}</span> foi finalizado e está pronto para download.
          </p>

          <div className="flex items-center space-x-4">
            <Music className="h-6 w-6 text-gray-500" />
            <p className="text-gray-600">
              Aproveite sua música!
            </p>
          </div>

          <Button className="w-full bg-green-600 text-white hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalDeliveryPage;
