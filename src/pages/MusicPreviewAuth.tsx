import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MusicPreviewAuth = () => {
  const { previewId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivateWindow, setIsPrivateWindow] = useState(false);

  // Detecção robusta de navegador privado
  useEffect(() => {
    const detectPrivateMode = async () => {
      try {
        const testKey = '_harmonia_private_test_';
        sessionStorage.setItem(testKey, 'true');
        sessionStorage.removeItem(testKey);
        setIsPrivateWindow(false);
      } catch (e) {
        setIsPrivateWindow(true);
        document.cookie = `harmonia_private=1; SameSite=None; Secure; Partitioned`;
      }
    };
    detectPrivateMode();
  }, []);

  const handleSendMagicLink = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: isPrivateWindow 
            ? `${window.location.origin}/auth/callback?is_private=true&preview_id=${previewId}`
            : `${window.location.origin}/auth/callback?preview_id=${previewId}`,
          data: { preview_id: previewId }
        }
      });

      if (error) throw error;

      // Sistema híbrido de armazenamento
      const sessionData = {
        previewId,
        email,
        timestamp: new Date().getTime()
      };
      
      try {
        localStorage.setItem('previewSession', JSON.stringify(sessionData));
      } catch {
        sessionStorage.setItem('previewSessionTemp', JSON.stringify(sessionData));
      }

      toast({
        title: "Link de acesso enviado!",
        description: "Verifique seu email para continuar",
      });

    } catch (error) {
      toast({
        title: "Erro ao enviar link",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Acesso à Prévia</h1>
          <p className="text-gray-600">
            Digite seu email para receber o link de acesso seguro
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          
          <Button 
            onClick={handleSendMagicLink}
            disabled={isLoading}
            className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Enviar Link de Acesso
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewAuth;
