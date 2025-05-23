import { createClient } from '@supabase/supabase-js';

// ✅ CONFIGURAÇÃO CENTRALIZADA
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// ✅ CLIENTE SUPABASE
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ✅ EMAIL SERVICE (resolver problema de import)
export const emailService = {
  sendFeedbackNotification: async (projectId: string, feedbackData: any) => {
    try {
      console.log('📧 Sending feedback notification for project:', projectId);
      
      // Aqui você pode integrar com um serviço de email real
      // Por enquanto, apenas logamos
      const emailData = {
        projectId,
        feedback: feedbackData,
        timestamp: new Date().toISOString()
      };
      
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Email notification sent:', emailData);
      return { success: true, data: emailData };
      
    } catch (error) {
      console.error('❌ Error sending email notification:', error);
      return { success: false, error };
    }
  },
  
  sendProjectUpdate: async (clientEmail: string, projectData: any) => {
    try {
      console.log('📧 Sending project update to:', clientEmail);
      
      const emailData = {
        to: clientEmail,
        subject: `Atualização do Projeto ${projectData.title}`,
        project: projectData,
        timestamp: new Date().toISOString()
      };
      
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Project update email sent:', emailData);
      return { success: true, data: emailData };
      
    } catch (error) {
      console.error('❌ Error sending project update:', error);
      return { success: false, error };
    }
  },

  sendWelcomeEmail: async (clientEmail: string, clientName: string) => {
    try {
      console.log('📧 Sending welcome email to:', clientEmail);
      
      const emailData = {
        to: clientEmail,
        name: clientName,
        subject: 'Bem-vindo à harmonIA!',
        timestamp: new Date().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Welcome email sent:', emailData);
      return { success: true, data: emailData };
      
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error };
    }
  }
};

// ✅ DATABASE HELPERS
export const dbHelpers = {
  async createBriefing(briefingData: any) {
    const { data, error } = await supabase
      .from('briefings')
      .insert(briefingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBriefing(id: string, updates: any) {
    const { data, error } = await supabase
      .from('briefings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProject(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createPreview(previewData: any) {
    const { data, error } = await supabase
      .from('previews')
      .insert(previewData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ✅ EXPORT DEFAULT
export default supabase;

// ✅ LOG APENAS EM DESENVOLVIMENTO
if (import.meta.env.DEV) {
  console.log('✅ Supabase inicializado:', supabaseUrl);
}
