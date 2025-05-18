
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setPreviewAccessCookie } from '@/utils/authCookies';
import MusicNoteIcon from '@/components/icons/MusicNoteIcon';
import { useNavigate } from 'react-router-dom';

interface ProjectAccessFormProps {
  projectId: string;
  onVerify: (email: string, code: string) => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onVerify }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Redirect to the Supabase auth flow for this preview
      navigate(`/auth/preview/${projectId}`);
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar seu acesso. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira o código de acesso",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check against Supabase if this is a valid code
      const { data, error } = await supabase
        .from('preview_codes')
        .select('*')
        .eq('project_id', projectId)
        .eq('code', code)
        .single();

      if (error || !data) {
        toast({
          title: "Código inválido",
          description: "O código inserido não é válido para esta prévia",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Set cookie for future access
      setPreviewAccessCookie(projectId);
      
      // Call the verification callback
      onVerify(email, code);
    } catch (error) {
      console.error("Code verification error:", error);
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o código. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-harmonia-green/10 mb-4">
          <MusicNoteIcon className="h-8 w-8 text-harmonia-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Prévia Musical Exclusiva</h2>
        <p className="text-gray-500 mt-1">
          Por favor, verifique seu acesso para visualizar sua prévia musical.
        </p>
      </div>

      {!showCodeInput ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="text-gray-400 absolute left-3 top-3 h-5 w-5" />
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
            <p className="text-xs text-gray-500 mt-1">
              Digite o email onde você recebeu a notificação sobre esta prévia musical.
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Verificar acesso
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowCodeInput(true)}
              className="text-sm text-gray-500 hover:text-harmonia-green"
            >
              Tenho um código de acesso
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Código de acesso
            </label>
            <Input
              id="code"
              type="text"
              placeholder="Digite o código de acesso"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Digite o código que você recebeu para acessar esta prévia musical.
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Acessar prévia
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowCodeInput(false)}
              className="text-sm text-gray-500 hover:text-harmonia-green"
            >
              Verificar por email
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectAccessForm;
