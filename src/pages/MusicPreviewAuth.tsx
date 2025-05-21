
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getProjectIdFromPreviewLink } from '@/utils/previewLinkUtils';
import { checkPreviewAccessCookie, setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import MusicNoteIcon from '@/components/icons/MusicNoteIcon';

const MusicPreviewAuth: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Verificar se já existe um cookie de acesso
  useEffect(() => {
    if (!previewId) return;

    const checkAccess = async () => {
      setIsChecking(true);
      try {
        // Tenta obter o ID do projeto a partir do ID da prévia
        const actualProjectId = await getProjectIdFromPreviewLink(previewId);

        if (actualProjectId) {
          setProjectId(actualProjectId);
          
          // Verificar se já existe um cookie de acesso
          if (checkPreviewAccessCookie(actualProjectId)) {
            console.log('Acesso autorizado por cookie');
            navigate(`/preview/${previewId}`);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [previewId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido",
        variant: "destructive"
      });
      return;
    }

    if (!previewId) {
      toast({
        title: "ID da prévia não encontrado",
        description: "O link da prévia é inválido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Enviar email de login mágico para o cliente
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/preview/${previewId}`,
        }
      });

      if (error) throw error;

      // 2. Armazenar email e conceder acesso provisório
      if (projectId) {
        setPreviewAccessCookie(projectId);
        setPreviewEmailCookie(projectId, email);
      }

      // 3. Mostrar mensagem de sucesso
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para acessar a prévia musical",
      });

      // 4. Redirecionar para a página de prévia (já terá cookie de acesso, mas ainda precisará confirmar o link no email para acesso futuro)
      navigate(`/preview/${previewId}`);
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Não foi possível enviar o email de verificação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-harmonia-green"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-harmonia-green/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <MusicNoteIcon className="h-8 w-8 text-harmonia-green" />
          </div>
          <CardTitle className="text-2xl">Acesso à Prévia Musical</CardTitle>
          <CardDescription>
            Por favor, verifique seu email para acessar sua prévia personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Digite o email onde você recebeu a notificação sobre esta prévia musical.
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Acessar prévia
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPreviewAuth;
