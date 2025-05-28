import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProjectAccessFormProps {
  projectId: string;
  onAccessGranted: () => void;
}

const ProjectAccessForm: React.FC<ProjectAccessFormProps> = ({ projectId, onAccessGranted }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('preview_code')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error("Error fetching preview code:", error);
        setError("Ocorreu um erro ao verificar o código de acesso.");
        return;
      }

      if (data && data.preview_code === accessCode) {
        onAccessGranted();
      } else {
        setError("Código de acesso incorreto. Tente novamente.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Ocorreu um erro ao autenticar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" />
          Acesso à Prévia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Digite o código de acesso"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button disabled={isLoading} className="w-full">
            {isLoading ? "Verificando..." : "Acessar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectAccessForm;
