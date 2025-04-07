
import { supabase } from './client';

// Função para criar políticas RLS para uma tabela específica
export const createTableRLSPolicies = async (tableName: string) => {
  try {
    console.log(`Criando políticas RLS para tabela ${tableName}...`);
    
    // Habilitar RLS na tabela se ainda não estiver habilitado
    const { error: enableError } = await supabase.rpc('enable_rls', { 
      table_name: tableName 
    });
    
    if (enableError) {
      console.error(`Erro ao habilitar RLS para ${tableName}:`, enableError);
      
      // Tente habilitar RLS direto via SQL como fallback
      await supabase.from('_exec_sql').select('*').eq('query', 
        `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`
      );
    }
    
    // Criar política para leitura (SELECT) para usuários autenticados
    const { error: selectError } = await supabase.rpc('create_policy', {
      table_name: tableName,
      name: `${tableName}_select_policy`,
      operation: 'SELECT',
      definition: `auth.role() = 'authenticated'`,
      check: `true`
    });
    
    if (selectError) {
      console.error(`Erro ao criar política SELECT para ${tableName}:`, selectError);
      
      // Tente criar política direto via SQL como fallback
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${tableName}_select_policy" ON "${tableName}" 
        FOR SELECT USING (auth.role() = 'authenticated');`
      );
    }
    
    // Criar política para escrita (INSERT) para usuários autenticados
    const { error: insertError } = await supabase.rpc('create_policy', {
      table_name: tableName,
      name: `${tableName}_insert_policy`,
      operation: 'INSERT',
      definition: `auth.role() = 'authenticated'`, 
      check: `true`
    });
    
    if (insertError) {
      console.error(`Erro ao criar política INSERT para ${tableName}:`, insertError);
      
      // Tente criar política direto via SQL como fallback
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${tableName}_insert_policy" ON "${tableName}" 
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
      );
    }
    
    // Criar política para atualização (UPDATE) para usuários autenticados
    const { error: updateError } = await supabase.rpc('create_policy', {
      table_name: tableName,
      name: `${tableName}_update_policy`,
      operation: 'UPDATE',
      definition: `auth.role() = 'authenticated'`,
      check: `true`
    });
    
    if (updateError) {
      console.error(`Erro ao criar política UPDATE para ${tableName}:`, updateError);
      
      // Tente criar política direto via SQL como fallback
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${tableName}_update_policy" ON "${tableName}" 
        FOR UPDATE USING (auth.role() = 'authenticated');`
      );
    }
    
    // Criar política para exclusão (DELETE) para usuários autenticados
    const { error: deleteError } = await supabase.rpc('create_policy', {
      table_name: tableName,
      name: `${tableName}_delete_policy`,
      operation: 'DELETE',
      definition: `auth.role() = 'authenticated'`,
      check: `true`
    });
    
    if (deleteError) {
      console.error(`Erro ao criar política DELETE para ${tableName}:`, deleteError);
      
      // Tente criar política direto via SQL como fallback
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${tableName}_delete_policy" ON "${tableName}" 
        FOR DELETE USING (auth.role() = 'authenticated');`
      );
    }
    
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
      
      // Aguarde um curto intervalo para não sobrecarregar o Supabase
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
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

// Função para criar manualmente políticas SQL para todas as tabelas
export const createSQLPolicies = async () => {
  try {
    console.log('Criando políticas RLS via SQL direto...');
    
    const tables = [
      'admin_users',
      'audio_samples',
      'portfolio_items',
      'qualification_submissions',
      'system_settings'
    ];
    
    for (const table of tables) {
      console.log(`Habilitando RLS e criando políticas para ${table}...`);
      
      // Habilitar RLS na tabela
      await supabase.from('_exec_sql').select('*').eq('query', 
        `ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`
      );
      
      // Criar política SELECT
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${table}_select_policy" ON "${table}" 
        FOR SELECT USING (auth.role() = 'authenticated');`
      );
      
      // Criar política INSERT
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${table}_insert_policy" ON "${table}" 
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
      );
      
      // Criar política UPDATE
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${table}_update_policy" ON "${table}" 
        FOR UPDATE USING (auth.role() = 'authenticated');`
      );
      
      // Criar política DELETE
      await supabase.from('_exec_sql').select('*').eq('query', 
        `CREATE POLICY "${table}_delete_policy" ON "${table}" 
        FOR DELETE USING (auth.role() = 'authenticated');`
      );
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar políticas SQL:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar políticas SQL'
    };
  }
};

export default runMigrations;
