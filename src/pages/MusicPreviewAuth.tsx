import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Shield, ArrowRight, Clipboard, User } from 'lucide-react';
import MusicNoteIcon from '@/components/icons/MusicNoteIcon';

const MusicPreviewAuth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthChecking(true);
      
      // Check if user is already authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      // If we have a session and a project ID, check authorization
      if (session?.user && projectId) {
        const userEmail = session.user.email;
        
        // Check if user has access to this preview
        const { data: previewData, error: previewError } = await supabase
          .from('previews')
          .select('*')
          .eq('preview_id', projectId)
          .maybeSingle();
        
        if (previewError) throw previewError;
        
        // If preview exists and user is in allowed_emails array, redirect to preview page
        if (previewData && userEmail && previewData.allowed_emails && 
            previewData.allowed_emails.includes(userEmail)) {
          // User is authorized, redirect to preview page
          navigate(`/preview/${projectId}`);
          return;
        } else if (previewData && userEmail) {
          // User is authenticated but not authorized for this preview
          toast({
            title: "Acesso não autorizado",
            description: "Seu email não tem permissão para acessar esta prévia.",
            variant: "destructive"
          });
          // Sign out the user
          await supabase.auth.signOut();
        }
      }
      
      setAuthChecking(false);
    } catch (error) {
      console.error("Auth check error:", error);
      toast({
        title: "Erro ao verificar autenticação",
        description: "Ocorreu um erro ao verificar seu acesso. Por favor, tente novamente.",
        variant: "destructive"
      });
      setAuthChecking(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Configure redirect URL
      const redirectTo = `${window.location.origin}/auth/callback?redirect=/preview/${projectId}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: false, // Não cria usuário se não existir
          data: {
            projectId: projectId,
            appName: "harmonIA - Prévias Musicais",
            appUrl: window.location.origin
          }
        },
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Enviamos um link de acesso exclusivo para as suas prévias musicais. Por favor, verifique sua caixa de entrada.",
      });
    } catch (error) {
      console.error("Magic link error:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o link de acesso. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
            <h2 className="text-xl font-medium text-gray-800">Verificando acesso...</h2>
            <p className="text-gray-500">Estamos verificando suas credenciais para acessar a prévia musical.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-harmonia-green/10 p-3 rounded-full mb-4">
            <Shield className="h-8 w-8 text-harmonia-green" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Prévia Musical Exclusiva</h1>
          <p className="text-gray-500 text-center">
            Esta é uma prévia exclusiva da sua música. Por favor, confirme seu email para acessar.
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
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
                  Enviando link...
                </>
              ) : (
                <>
                  Acessar prévia
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-1">Verifique seu email</h3>
              <p className="text-blue-700 text-sm">
                Enviamos um link de acesso para <span className="font-medium">{email}</span>.
                Por favor, verifique sua caixa de entrada.
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Não recebeu o email?</p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="text-sm"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-500">
              Já é um cliente registrado?
            </p>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => navigate('/client-dashboard')}
            >
              <User className="h-4 w-4 mr-2" />
              Acessar área do cliente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewAuth;
