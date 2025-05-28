
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDataValidation = () => {
  const { toast } = useToast();

  // Validar conexão com banco
  const validateConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('count(*)')
        .limit(1);
      
      if (error) throw error;
      
      console.log('✅ Conexão com Supabase validada');
      return true;
    } catch (error) {
      console.error('❌ Erro de conexão com Supabase:', error);
      toast({
        title: "Erro de conexão",
        description: "Problema na conexão com o banco de dados",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Validar se dados persistem após operação
  const validateDataPersistence = useCallback(async (table: 'clients' | 'projects' | 'project_versions' | 'feedback', id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar propagação
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        console.log(`✅ Dados persistidos em ${table}:`, data);
        return true;
      } else {
        console.log(`❌ Dados não encontrados em ${table} para ID: ${id}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao validar persistência em ${table}:`, error);
      return false;
    }
  }, []);

  // Testar operação CRUD completa
  const testCrudOperations = useCallback(async () => {
    console.log('🧪 Iniciando teste de operações CRUD...');
    
    try {
      // Teste 1: Criar cliente
      const testClient = {
        name: 'Cliente Teste',
        email: `teste${Date.now()}@harmonia.com`,
        phone: '(11) 99999-9999'
      };

      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert([testClient])
        .select()
        .single();

      if (createError) throw createError;
      console.log('✅ Cliente criado:', newClient);

      // Teste 2: Validar persistência
      const persisted = await validateDataPersistence('clients', newClient.id);
      if (!persisted) {
        throw new Error('Dados não persistiram após criação');
      }

      // Teste 3: Atualizar cliente
      const { error: updateError } = await supabase
        .from('clients')
        .update({ name: 'Cliente Teste Atualizado' })
        .eq('id', newClient.id);

      if (updateError) throw updateError;
      console.log('✅ Cliente atualizado');

      // Teste 4: Deletar cliente de teste
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', newClient.id);

      if (deleteError) throw deleteError;
      console.log('✅ Cliente de teste removido');

      toast({
        title: "Teste CRUD concluído",
        description: "Todas as operações funcionaram corretamente",
      });

      return true;
    } catch (error) {
      console.error('❌ Falha no teste CRUD:', error);
      toast({
        title: "Falha no teste CRUD",
        description: "Detectado problema nas operações de banco",
        variant: "destructive"
      });
      return false;
    }
  }, [validateDataPersistence, toast]);

  return {
    validateConnection,
    validateDataPersistence,
    testCrudOperations
  };
};
