
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { setPreviewAccessCookie } from '@/utils/authCookies';
import { Loader2 } from 'lucide-react';

const MusicPreviewAuth: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (!previewId) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Check for existing auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User already authenticated:", session.user.email);
          // Set cookie for this preview and redirect
          setPreviewAccessCookie(previewId);
          navigate(`/preview/${previewId}`);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [previewId, navigate]);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, digite seu email para acessar a prévia.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Set up redirect URL with the current preview ID
      const redirectTo = `${window.location.origin}/auth/callback?redirect=/preview/${previewId}`;
      
      console.log("Sending magic link with redirect:", redirectTo);
      
      // Send magic link email
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        throw error;
      }

      // Show success message
      toast({
        title: "Link enviado",
        description: `Enviamos um link de acesso para ${email}. Por favor, verifique sua caixa de entrada.`,
      });
      
      // We don't redirect here because user needs to click the magic link in email
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        title: "Erro",
        description: error.message || "Houve um problema ao enviar o link. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!previewId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acesso não disponível</CardTitle>
            <CardDescription>O código de prévia não foi encontrado.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Voltar para o início
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl">Acesso à Prévia</CardTitle>
          <CardDescription>
            Por favor, insira seu email para acessar a prévia musical.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMagicLinkLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Acessar Prévia"
                )}
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Enviaremos um link de acesso para o email cadastrado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPreviewAuth;
