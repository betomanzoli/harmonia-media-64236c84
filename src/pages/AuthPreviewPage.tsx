
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Lock, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const AuthPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load project information
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;

      try {
        const { data, error } = await supabase
          .from('preview_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) {
          throw error;
        }

        setProjectDetails(data);
      } catch (err) {
        console.error("Error fetching project details:", err);
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível encontrar as informações do projeto.",
          variant: "destructive"
        });
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!projectId || !email) {
      setError("Por favor, informe seu email.");
      setLoading(false);
      return;
    }

    try {
      // 1. Check if the email already has access
      const { data: tokenData, error: tokenError } = await supabase.rpc('check_email_access', {
        p_email: email,
        p_preview_id: projectId
      });

      if (tokenError) {
        console.error("Error checking email access:", tokenError);
      }

      // Generate a signed magic link
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This will send a magic link instead of a traditional OTP
          emailRedirectTo: `${window.location.origin}/view-preview/${projectId}`,
        },
      });

      if (error) {
        throw error;
      }

      // Log the access attempt
      try {
        await supabase.from('access_logs').insert({
          preview_id: projectId,
          user_email: email,
          access_method: 'magic_link',
          ip_address: null // We don't collect IP for privacy reasons
        });
      } catch (logError) {
        console.error("Error logging access:", logError);
        // Non-critical, continue anyway
      }

      // Show success message
      toast({
        title: "Email enviado com sucesso!",
        description: "Verifique sua caixa de entrada e clique no link para acessar a prévia.",
      });

      // Store email in localStorage to pre-fill on future visits
      localStorage.setItem('previewEmail', email);

    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Erro ao enviar o link de acesso. Por favor, tente novamente.");
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível enviar o email. Verifique seu endereço e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while project details are being fetched
  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-10 w-10 animate-spin text-harmonia-green" />
      </div>
    );
  }

  // Show error if project doesn't exist
  if (!projectDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full inline-flex justify-center items-center mb-4">
              <Lock className="h-6 w-6 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>
            <p className="text-gray-600">
              O projeto solicitado não existe ou está indisponível.
            </p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Voltar ao início
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="bg-harmonia-green/10 p-3 rounded-full inline-flex justify-center items-center mb-4">
            <Music className="h-6 w-6 text-harmonia-green" />
          </div>
          <h1 className="text-2xl font-bold">{projectDetails.project_title}</h1>
          <p className="text-gray-600 mt-1">
            Acesse a prévia musical criada para {projectDetails.client_name}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Seu email</Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Informe seu email para acessar a prévia"
              required
              className="mt-1"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando link de acesso...
              </span>
            ) : (
              'Acessar Prévia'
            )}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>
            Você receberá um email com um link de acesso seguro.
            <br />
            Se não encontrar o email, verifique sua pasta de spam.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AuthPreviewPage;
