import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { checkPreviewAccessCookie, setPreviewAccessCookie } from '@/utils/authCookies';

const MusicPreviewPage: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!previewCode) return;

      setIsLoading(true);
      const access = checkPreviewAccessCookie(previewCode);
      setHasAccess(access);

      if (access) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('preview_code', previewCode)
            .single();

          if (error) {
            console.error('Error fetching project:', error);
          } else {
            setProject(data);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [previewCode]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Clock className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar esta prévia.</p>
            <Button onClick={() => window.location.href = `/music-preview-auth?previewCode=${previewCode}`}>
              Solicitar Acesso
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Projeto Não Encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>O projeto com o código de prévia especificado não foi encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Prévia Musical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Título: {project.title}</p>
            <p>Status: {project.status}</p>
            <Music className="mr-2 h-4 w-4" />
            <CheckCircle className="mr-2 h-4 w-4" />
            <MessageSquare className="mr-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPreviewPage;
