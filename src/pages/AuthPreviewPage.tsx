
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { setPreviewAccessCookie } from '@/utils/authCookies';
import { Loader2 } from 'lucide-react';

const AuthPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) {
      toast({
        title: "Erro",
        description: "ID do projeto não encontrado",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Log the access attempt
      console.log(`Tentativa de acesso à prévia ${projectId} com email: ${email}`);
      
      // Check if project exists in database
      const { data: projectData, error: projectError } = await supabase
        .from('preview_projects')
        .select('id, client_name')
        .eq('id', projectId)
        .single();
      
      if (projectError || !projectData) {
        console.error("Projeto não encontrado:", projectError);
        throw new Error("Projeto não encontrado. Verifique o link e tente novamente.");
      }
      
      // Generate a magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/preview/${projectId}`,
        }
      });
      
      if (error) {
        console.error("Erro ao enviar email:", error);
        throw new Error(`Erro ao enviar email: ${error.message}`);
      }
      
      // Log access attempt
      await supabase.from('access_logs').insert({
        preview_id: projectId,
        user_email: email,
        access_method: 'magic_link',
        ip_address: 'client_ip',
      });
      
      setSent(true);
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada e clique no link para acessar a prévia",
      });
    } catch (err: any) {
      console.error("Erro ao autenticar:", err);
      toast({
        title: "Erro ao acessar prévia",
        description: err.message || "Ocorreu um erro ao tentar acessar a prévia",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectAccess = () => {
    if (projectId) {
      // Set access cookie directly (for development/testing)
      setPreviewAccessCookie(projectId);
      
      // Redirect to preview page
      navigate(`/preview/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Acesse sua Prévia Musical</h1>
            
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Seu Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email para acessar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digite o email que você usou ao contratar nossos serviços
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Acessar Prévia"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 border border-green-100 rounded-md p-4 mb-4">
                  <p className="text-green-800">
                    Email enviado com sucesso! Por favor, verifique sua caixa de entrada.
                  </p>
                </div>
                
                <p className="mb-4 text-sm text-gray-500">
                  Não recebeu o email? Confira sua pasta de spam ou tente novamente.
                </p>
                
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPreviewPage;
