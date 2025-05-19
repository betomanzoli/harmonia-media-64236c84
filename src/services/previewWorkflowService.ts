
import webhookService from './webhookService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface PreviewWorkflowData {
  preview_id: string;
  briefing_id?: string;
  project_id?: string;
  client_id?: string;
  version?: string | number;
  notes?: string;
  status?: 'new' | 'feedback' | 'approved';
  feedback?: string;
  files?: string[];
}

const previewWorkflowService = {
  // Create or update a preview in the workflow
  createPreview: async (data: PreviewWorkflowData): Promise<boolean> => {
    try {
      console.log('Creating preview in workflow:', data);

      // First, try to send to the n8n webhook
      const webhookSuccess = await webhookService.sendPreviewData({
        ...data,
        created_at: new Date().toISOString()
      });

      console.log('Webhook notification result:', webhookSuccess);

      // Optionally, you can also update Supabase if needed
      if (data.preview_id) {
        try {
          const { error } = await supabase
            .from('previews')
            .upsert({
              preview_id: data.preview_id,
              project_id: data.project_id,
              title: `Preview ${data.version || '1'}`,
              description: data.notes || '',
              created_at: new Date().toISOString(),
              is_active: true
            });

          if (error) {
            console.error('Error updating Supabase with preview data:', error);
          }
        } catch (dbError) {
          console.error('Database error while updating preview:', dbError);
        }
      }

      return webhookSuccess;
    } catch (error) {
      console.error('Error in previewWorkflowService.createPreview:', error);
      return false;
    }
  },

  // Handle feedback for a preview
  sendFeedback: async (previewId: string, feedback: string): Promise<boolean> => {
    try {
      console.log('Sending feedback for preview:', previewId, feedback);

      const data: PreviewWorkflowData = {
        preview_id: previewId,
        status: 'feedback',
        feedback,
        created_at: new Date().toISOString()
      };

      return await webhookService.sendPreviewData(data);
    } catch (error) {
      console.error('Error in previewWorkflowService.sendFeedback:', error);
      return false;
    }
  },

  // Handle approval for a preview
  approvePreview: async (previewId: string, versionId?: string): Promise<boolean> => {
    try {
      console.log('Approving preview:', previewId, 'version:', versionId);

      const data: PreviewWorkflowData = {
        preview_id: previewId,
        status: 'approved',
        version: versionId,
        created_at: new Date().toISOString()
      };

      return await webhookService.sendPreviewData(data);
    } catch (error) {
      console.error('Error in previewWorkflowService.approvePreview:', error);
      return false;
    }
  }
};

export default previewWorkflowService;
