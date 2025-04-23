
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from './useFileUpload';
import { syncStorageData } from '@/services/adminStorageService';
import { emailService } from '@/lib/supabase';
import { notificationService } from '@/services/notificationService';

interface BriefingSubmission {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  submittedAt: string;
  briefingData: any;
  files?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export function useBriefingStorage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const { toast } = useToast();
  const { 
    isUploading, 
    uploadProgress, 
    uploadedFiles, 
    uploadMultipleFiles,
    openStorageFolder
  } = useFileUpload('briefings');

  const saveBriefingSubmission = async (
    briefingData: any,
    clientName: string,
    clientEmail: string,
    packageType: string,
    files?: File[]
  ): Promise<{success: boolean, submissionId?: string}> => {
    try {
      setIsSaving(true);
      
      // Upload reference files if provided
      let uploadedReferenceFiles = [];
      if (files && files.length > 0) {
        uploadedReferenceFiles = await uploadMultipleFiles(files, {
          clientName,
          clientEmail,
          packageType
        });
      }
      
      // Create submission object
      const submissionId = `briefing-${Date.now()}`;
      const submission: BriefingSubmission = {
        id: submissionId,
        clientName,
        clientEmail,
        packageType,
        submittedAt: new Date().toISOString(),
        briefingData,
        files: uploadedReferenceFiles.map(file => ({
          id: file.id,
          name: file.name,
          url: file.url
        }))
      };
      
      // Store the submission JSON in Google Drive
      const fileName = `briefing_${clientName.replace(/\s+/g, '_')}_${submissionId}.json`;
      const result = await syncStorageData('briefings', submission, fileName);
      
      if (result.success) {
        // Save to local storage as fallback/cache
        const storedBriefings = JSON.parse(localStorage.getItem('briefings') || '[]');
        storedBriefings.push(submission);
        localStorage.setItem('briefings', JSON.stringify(storedBriefings));
        
        toast({
          title: "Briefing salvo",
          description: "O briefing foi salvo com sucesso no Google Drive.",
        });
        
        // Enviar notificação
        notificationService.notify('briefing_received', {
          id: submissionId,
          clientName,
          clientEmail,
          packageType,
          submissionTime: new Date().toISOString(),
          filesCount: uploadedReferenceFiles.length
        });
        
        return { success: true, submissionId };
      } else {
        throw new Error("Falha ao salvar o briefing");
      }
    } catch (error) {
      console.error("Erro ao salvar briefing:", error);
      
      toast({
        title: "Erro ao salvar briefing",
        description: "Não foi possível salvar o briefing. Tente novamente.",
        variant: "destructive",
      });
      
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };
  
  // Send notification email to team about new briefing
  const notifyTeam = async (clientName: string, clientEmail: string, packageType: string): Promise<boolean> => {
    try {
      setIsNotifying(true);
      
      // In a real implementation, this would send an email via API
      // For now we use our mock email service
      const result = await emailService.sendBriefingConfirmation(clientEmail, clientName);
      
      if (result.success) {
        toast({
          title: "Equipe notificada",
          description: "A equipe foi notificada sobre o novo briefing.",
        });
        return true;
      } else {
        throw new Error("Falha ao notificar a equipe");
      }
    } catch (error) {
      console.error("Erro ao notificar equipe:", error);
      
      toast({
        title: "Erro na notificação",
        description: "Não foi possível notificar a equipe. O briefing foi salvo mesmo assim.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsNotifying(false);
    }
  };
  
  return {
    isSaving,
    isNotifying,
    isUploading,
    uploadProgress,
    saveBriefingSubmission,
    notifyTeam,
    openStorageFolder
  };
}
