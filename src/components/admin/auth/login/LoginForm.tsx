
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Shield } from 'lucide-react';
import { ConnectionStatus } from '@/types/admin-auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  onPasswordReset: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading, 
  connectionStatus, 
  onPasswordReset 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  // Determine if the form should be disabled
  const formDisabled = isLoading || (!connectionStatus.connected && !connectionStatus.tested);

  // Admin demo credentials (for demonstration purposes)
  const useDemoCredentials = () => {
    form.setValue('email', 'admin@harmonia.com');
    form.setValue('password', 'admin123456');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@example.com"
                  {...field}
                  disabled={formDisabled}
                  className={formDisabled ? "bg-gray-100" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="******"
                  {...field}
                  disabled={formDisabled}
                  className={formDisabled ? "bg-gray-100" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={formDisabled}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Entrar
            </>
          )}
        </Button>
        
        {!connectionStatus.connected && connectionStatus.tested && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            <p className="font-medium">Login temporariamente indisponível</p>
            <p className="mt-1">O sistema não consegue se conectar ao Supabase neste momento. Você pode usar o modo de demonstração ou tentar novamente quando a conexão for restabelecida.</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm"
            onClick={onPasswordReset}
            disabled={formDisabled}
          >
            Esqueceu sua senha?
          </Button>
          
          {!connectionStatus.connected && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={useDemoCredentials}
            >
              Preencher com credenciais de demonstração
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
