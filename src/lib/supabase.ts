import { createClient } from '@supabase/supabase-js'

// ✅ CONFIGURAÇÃO PADRÃO (baseada nos search results)
const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM'

// ✅ CLIENTE PRINCIPAL (conforme documentação oficial)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// ✅ EMAIL SERVICE (recriar inline)
export const emailService = {
  async sendFeedbackNotification(projectId: string, feedbackData: any) {
    try {
      console.log('📧 Sending feedback notification for project:', projectId);
      
      // Simular envio de email (substituir por serviço real depois)
      const emailData = {
        projectId,
        feedback: feedbackData,
        timestamp: new Date().toISOString(),
        type: 'feedback_notification'
      };
      
      // Log para debugging
      console.log('✅ Email notification logged:', emailData);
      
      // Salvar no banco como log de email
      const { error } = await supabase
        .from('email_logs')
        .insert({
          project_id: projectId,
          email_type: 'feedback_notification',
          email_data: emailData,
          sent_at: new Date().toISOString()
        });
      
      if (error) console.error('❌ Error logging email:', error);
      
      return { success: true, data: emailData };
    } catch (error) {
      console.error('❌ Error in sendFeedbackNotification:', error);
      return { success: false, error };
    }
  },

  async sendProjectUpdate(clientEmail: string, projectData: any) {
    try {
      console.log('📧 Sending project update to:', clientEmail);
      
      const emailData = {
        to: clientEmail,
        subject: `Atualização do Projeto ${projectData.title}`,
        project: projectData,
        timestamp: new Date().toISOString(),
        type: 'project_update'
      };
      
      console.log('✅ Project update email logged:', emailData);
      
      // Salvar log no banco
      const { error } = await supabase
        .from('email_logs')
        .insert({
          recipient_email: clientEmail,
          email_type: 'project_update',
          email_data: emailData,
          sent_at: new Date().toISOString()
        });
      
      if (error) console.error('❌ Error logging email:', error);
      
      return { success: true, data: emailData };
    } catch (error) {
      console.error('❌ Error in sendProjectUpdate:', error);
      return { success: false, error };
    }
  },

  async sendWelcomeEmail(clientEmail: string, clientName: string) {
    try {
      console.log('📧 Sending welcome email to:', clientEmail);
      
      const emailData = {
        to: clientEmail,
        name: clientName,
        subject: 'Bem-vindo à harmonIA!',
        timestamp: new Date().toISOString(),
        type: 'welcome'
      };
      
      console.log('✅ Welcome email logged:', emailData);
      
      return { success: true, data: emailData };
    } catch (error) {
      console.error('❌ Error in sendWelcomeEmail:', error);
      return { success: false, error };
    }
  }
};

// ✅ DATABASE HELPERS (funções comuns do banco)
export const dbHelpers = {
  async createBriefing(briefingData: any) {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .insert({
          ...briefingData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ Briefing created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error creating briefing:', error);
      throw error;
    }
  },

  async updateBriefing(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ Briefing updated:', id);
      return data;
    } catch (error) {
      console.error('❌ Error updating briefing:', error);
      throw error;
    }
  },

  async createProject(projectData: any) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ Project created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  },

  async createPreview(previewData: any) {
    try {
      const { data, error } = await supabase
        .from('previews')
        .insert({
          ...previewData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ Preview created:', data.preview_id);
      return data;
    } catch (error) {
      console.error('❌ Error creating preview:', error);
      throw error;
    }
  },

  async saveFeedback(feedbackData: any) {
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert({
          ...feedbackData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('✅ Feedback saved:', data.id);
      return data;
    } catch (error) {
      console.error('❌ Error saving feedback:', error);
      throw error;
    }
  }
};

// ✅ AUTH HELPERS (funções de autenticação)
export const authHelpers = {
  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from('briefings')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      console.log('✅ Supabase connection OK');
      return { connected: true };
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      return { connected: false, error };
    }
  },

  async testAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔐 Auth test:', user ? 'User logged in' : 'No user');
      return { user };
    } catch (error) {
      console.error('❌ Auth test failed:', error);
      return { user: null, error };
    }
  }
};

// ✅ UTILITY FUNCTIONS (funções úteis)
export const supabaseUtils = {
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  formatDate(date: string | Date) {
    try {
      const d = new Date(date);
      return d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  },

  async logError(error: any, context: string) {
    try {
      await supabase
        .from('error_logs')
        .insert({
          error_message: error.message || String(error),
          context,
          timestamp: new Date().toISOString()
        });
    } catch (logError) {
      console.error('❌ Failed to log error:', logError);
    }
  }
};

// ✅ EXPORT DEFAULT (conforme search results)
export default supabase;

// ✅ LOG DE INICIALIZAÇÃO
console.log('✅ Supabase client initialized with all helpers');
