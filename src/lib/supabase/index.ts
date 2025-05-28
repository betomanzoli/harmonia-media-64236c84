
import { supabase } from '@/integrations/supabase/client';

// Utilitários para operações do banco usando configuração unificada
export const dbOperations = {
  // Projetos
  async createProject(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...projectData,
        id: crypto.randomUUID(),
        preview_code: generatePreviewCode(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_versions (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getProjectById(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_versions (*)
      `)
      .eq('id', projectId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getProjectByPreviewCode(previewCode: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_versions (*)
      `)
      .eq('preview_code', previewCode)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Versões
  async addVersion(projectId: string, versionData: any) {
    const { data, error } = await supabase
      .from('project_versions')
      .insert([{
        ...versionData,
        id: crypto.randomUUID(),
        project_id: projectId,
        version_id: `v${Date.now()}`,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteVersion(versionId: string) {
    const { error } = await supabase
      .from('project_versions')
      .delete()
      .eq('id', versionId);
    
    if (error) throw error;
  },

  // Feedback
  async addFeedback(projectId: string, content: string, userEmail: string) {
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        id: crypto.randomUUID(),
        project_id: projectId,
        content,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;

    // Atualizar status do projeto
    await this.updateProject(projectId, {
      status: 'feedback',
      feedback: content
    });
    
    return data;
  },

  // Clientes
  async createClient(clientData: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        ...clientData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Gerar código único para preview
function generatePreviewCode(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Sistema de autenticação para clientes
export const clientAuth = {
  async validatePreviewAccess(previewCode: string, email: string) {
    // Verificar se o projeto existe
    const project = await dbOperations.getProjectByPreviewCode(previewCode);
    if (!project) {
      throw new Error('Projeto não encontrado');
    }

    // Verificar se o email está autorizado
    if (project.client_email && project.client_email.toLowerCase() !== email.toLowerCase()) {
      throw new Error('Email não autorizado para este projeto');
    }

    // Registrar acesso
    await supabase
      .from('preview_access_logs')
      .insert([{
        id: crypto.randomUUID(),
        project_id: project.id,
        email,
        accessed_at: new Date().toISOString()
      }]);

    return project;
  },

  async generateAccessToken(projectId: string, email: string) {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72); // 72 horas

    const { data, error } = await supabase
      .from('preview_validations')
      .insert([{
        id: crypto.randomUUID(),
        project_id: projectId,
        email,
        token,
        expires_at: expiresAt.toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async validateToken(token: string) {
    const { data, error } = await supabase
      .from('preview_validations')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) throw error;
    return data;
  }
};

export { supabase };
