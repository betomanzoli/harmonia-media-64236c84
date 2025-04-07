
import { supabase } from './client';

// Função para criar políticas RLS para uma tabela específica
export const createTableRLSPolicies = async (tableName: string) => {
  try {
    console.log(`Criando políticas RLS para tabela ${tableName}...`);
    
    // Habilitar RLS na tabela se ainda não estiver habilitado
    await supabase.rpc('enable_rls', { table_name: tableName });
    
    // Criar política para leitura (SELECT) para usuários autenticados
    await supabase.rpc('create_select_policy', {
      table_name: tableName,
      policy_name: `${tableName}_select_policy`,
      policy_definition: `auth.role() = 'authenticated'`
    });
    
    // Criar política para escrita (INSERT) para usuários autenticados
    await supabase.rpc('create_insert_policy', {
      table_name: tableName,
      policy_name: `${tableName}_insert_policy`,
      policy_definition: `auth.role() = 'authenticated'`
    });
    
    // Criar política para atualização (UPDATE) para usuários autenticados
    await supabase.rpc('create_update_policy', {
      table_name: tableName,
      policy_name: `${tableName}_update_policy`,
      policy_definition: `auth.role() = 'authenticated'`
    });
    
    // Criar política para exclusão (DELETE) para usuários autenticados
    await supabase.rpc('create_delete_policy', {
      table_name: tableName,
      policy_name: `${tableName}_delete_policy`,
      policy_definition: `auth.role() = 'authenticated'`
    });
    
    console.log(`Políticas RLS criadas com sucesso para tabela ${tableName}`);
    return { success: true };
  } catch (error: any) {
    console.error(`Erro ao criar políticas RLS para tabela ${tableName}:`, error);
    return { 
      success: false, 
      error: error.message || `Erro desconhecido ao configurar políticas para ${tableName}` 
    };
  }
};

// Executa todas as migrações necessárias
export const runMigrations = async () => {
  try {
    console.log('Iniciando migrações...');
    
    // Lista de tabelas que precisam de políticas RLS
    const tables = [
      'admin_users',
      'audio_samples',
      'portfolio_items',
      'qualification_submissions',
      'system_settings'
    ];
    
    // Aplicar políticas RLS para cada tabela
    const results = [];
    for (const table of tables) {
      const result = await createTableRLSPolicies(table);
      results.push({ table, ...result });
    }
    
    // Criar função para verificar status de segurança
    await supabase.rpc('create_security_check_function');
    
    console.log('Migrações concluídas com sucesso');
    
    return {
      success: true,
      results
    };
  } catch (error: any) {
    console.error('Erro ao executar migrações:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao executar migrações'
    };
  }
};

export default runMigrations;
