import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const PreviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sistema híbrido de cache
  useEffect(() => {
    const loadCachedFeedback = () => {
      try {
        const cached = localStorage.getItem(`feedback_${projectId}`) || 
                       sessionStorage.getItem(`feedback_temp_${projectId}`);
        if (cached) setFeedback(JSON.parse(cached).feedback);
      } catch (error) {
        console.error('Erro ao carregar cache:', error);
      }
    };
    loadCachedFeedback();
  }, [projectId]);

  const handleFeedbackChange = (value) => {
    setFeedback(value);
    try {
      localStorage.setItem(`feedback_${projectId}`, JSON.stringify({ feedback: value }));
    } catch {
      sessionStorage.setItem(`feedback_temp_${projectId}`, JSON.stringify({ feedback: value }));
    }
  };

  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('append_feedback', {
        project_id: projectId,
        feedback_data: {
          text: feedback,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      // Limpar cache após sucesso
      localStorage.removeItem(`feedback_${projectId}`);
      sessionStorage.removeItem(`feedback_temp_${projectId}`);

      navigate('/feedback-confirmacao');

    } catch (error) {
      toast({
        title: "Erro ao salvar feedback",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Deixe seu Feedback</h2>
      <Textarea
        value={feedback}
        onChange={(e) => handleFeedbackChange(e.target.value)}
        className="min-h-[200px] mb-6"
        placeholder="Digite seus comentários detalhados..."
      />
      <Button 
        onClick={submitFeedback}
        disabled={isSubmitting}
        className="bg-harmonia-green hover:bg-harmonia-green/90"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
      </Button>
    </div>
  );
};

export default PreviewPage;
