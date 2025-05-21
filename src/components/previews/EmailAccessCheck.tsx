
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { setPreviewAccessCookie, setPreviewEmailCookie } from '@/utils/authCookies';
import MusicNoteIcon from '@/components/icons/MusicNoteIcon';

interface EmailAccessCheckProps {
  projectId: string;
  onAccess: () => void;
}

const EmailAccessCheck: React.FC<EmailAccessCheckProps> = ({ projectId, onAccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

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
    
    setIsSubmitting(true);
    
    try {
      // Configure redirect URL back to this preview
      const redirectTo = `${window.location.origin}/preview/${projectId}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      
      if (error) throw error;
      
      // Store email in cookie to check when returning
      setPreviewEmailCookie(projectId, email);
      
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para acessar sua prévia musical exclusiva.",
      });
    } catch (error: any) {
      console.error("Magic link error:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o link de acesso. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-harmonia-green/10 mb-4">
          <MusicNoteIcon className="h-8 w-8 text-harmonia-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Prévia Musical Exclusiva</h2>
        <p className="text-gray-500 mt-1">
          Por favor, confirme seu email para acessar sua prévia musical.
        </p>
      </div>

      {!emailSent ? (
        <form onSubmit={handleSendMagicLink} className="space-y-4">
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
                Enviando link...
              </>
            ) : (
              <>
                Verificar acesso
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Um link mágico será enviado para seu email para verificar seu acesso.
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-1">Verifique seu email</h3>
            <p className="text-blue-700 text-sm">
              Enviamos um link de acesso para <span className="font-medium">{email}</span>.
              Por favor, verifique sua caixa de entrada e spam.
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
    </Card>
  );
};

export default EmailAccessCheck;
