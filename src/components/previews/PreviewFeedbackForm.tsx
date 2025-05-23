
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp, SendHorizonal } from 'lucide-react';
import { notificationService } from '@/services/notificationService';

interface PreviewFeedbackFormProps {
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onSubmit: (comments?: string) => void;
  onApprove: (comments?: string) => void;
  status?: 'waiting' | 'feedback' | 'approved';
  selectedVersion?: string | null;
  versionTitle?: string;
  projectId?: string;
}

const PreviewFeedbackForm: React.FC<PreviewFeedbackFormProps> = ({
  feedback,
  onFeedbackChange,
  onSubmit,
  onApprove,
  status = 'waiting',
  selectedVersion,
  versionTitle,
  projectId
}) => {
  const [localStatus, setLocalStatus] = useState(status);
  const [isSending, setIsSending] = useState(false);
  
  // Synchronize the state when props change
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  // Persist status to localStorage to maintain state between page refreshes
  useEffect(() => {
    if (projectId && localStatus !== 'waiting') {
      try {
        localStorage.setItem(`preview_status_${projectId}`, localStatus);
        console.log(`Saved status ${localStatus} for project ${projectId} to localStorage`);
      } catch (err) {
        console.error("Error saving preview status to localStorage:", err);
      }
    }
  }, [localStatus, projectId]);

  // Load saved status on component mount
  useEffect(() => {
    if (projectId) {
      try {
        const savedStatus = localStorage.getItem(`preview_status_${projectId}`);
        if (savedStatus && (savedStatus === 'approved' || savedStatus === 'feedback')) {
          setLocalStatus(savedStatus);
          console.log(`Loaded saved status ${savedStatus} for project ${projectId} from localStorage`);
        }
      } catch (err) {
        console.error("Error loading preview status from localStorage:", err);
      }
    }
  }, [projectId]);
  
  const handleSubmitFeedback = () => {
    if (!selectedVersion) return;
    
    setIsSending(true);
    
    // Notify the system about the feedback received
    if (projectId && selectedVersion) {
      notificationService.notify(
        'feedback_received',
        {
          projectId,
          message: feedback,
          versionId: selectedVersion,
          timestamp: new Date().toISOString()
        }
      );
    }

    // Save feedback to localStorage for persistence
    if (projectId) {
      try {
        localStorage.setItem(`preview_feedback_${projectId}`, feedback);
      } catch (err) {
        console.error("Error saving feedback to localStorage:", err);
      }
    }

    // Update local state
    setLocalStatus('feedback');
    
    // Call the parent component's callback
    onSubmit(feedback);
    
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };
  
  const handleApprove = () => {
    if (!selectedVersion) return;
    
    setIsSending(true);
    
    // Notify the system about the approval received
    if (projectId && selectedVersion) {
      notificationService.notify(
        'preview_approved',
        {
          projectId,
          versionId: selectedVersion,
          comments: feedback,
          timestamp: new Date().toISOString()
        }
      );
    }

    // Save approval status to localStorage for persistence
    if (projectId) {
      try {
        localStorage.setItem(`preview_status_${projectId}`, 'approved');
        localStorage.setItem(`preview_feedback_${projectId}`, feedback);
      } catch (err) {
        console.error("Error saving approval to localStorage:", err);
      }
    }

    // Update local state
    setLocalStatus('approved');
    
    // Call the parent component's callback
    onApprove(feedback);
    
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  };

  return (
    <Card className="p-6 bg-white">
      <h2 className="text-xl font-bold text-black mb-4">Envie seu feedback</h2>
      
      {selectedVersion && versionTitle && (
        <div className="mb-4 p-3 rounded-md bg-green-500">
          <p className="text-sm">
            <span className="font-medium">Versão selecionada:</span> {versionTitle}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
          Comentários ou ajustes desejados:
        </label>
        <Textarea 
          id="feedback" 
          placeholder="Escreva aqui suas observações, sugestões ou pedidos de ajustes..." 
          value={feedback} 
          onChange={e => onFeedbackChange(e.target.value)} 
          rows={5} 
          className="w-full resize-none" 
          disabled={localStatus === 'approved'} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleSubmitFeedback} 
          disabled={localStatus === 'approved' || isSending || !selectedVersion}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <SendHorizonal className="w-4 h-4 mr-2" />
          Enviar Feedback
        </Button>
        
        <Button 
          onClick={handleApprove} 
          disabled={localStatus === 'approved' || isSending || !selectedVersion}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Aprovar esta versão
        </Button>
      </div>
      
      {localStatus === 'approved' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <p className="text-sm text-green-800">
            Esta prévia já foi aprovada. Obrigado pelo seu feedback!
          </p>
        </div>
      )}
    </Card>
  );
};

export default PreviewFeedbackForm;
