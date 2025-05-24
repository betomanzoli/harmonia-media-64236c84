
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from 'lucide-react';

interface ClientFeedbackCardProps {
  feedback: string;
  status: string;
  onSaveFeedback: (feedback: string) => void;
}

const ClientFeedbackCard: React.FC<ClientFeedbackCardProps> = ({
  feedback,
  status,
  onSaveFeedback
}) => {
  const [editMode, setEditMode] = useState(false);
  const [feedbackText, setFeedbackText] = useState(feedback || '');
  
  const handleSave = () => {
    onSaveFeedback(feedbackText);
    setEditMode(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
          Feedback do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editMode ? (
          <>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[120px]"
              placeholder="Digite o feedback do cliente"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFeedbackText(feedback);
                  setEditMode(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                Salvar
              </Button>
            </div>
          </>
        ) : feedback ? (
          <>
            <div className="bg-gray-50 p-4 rounded-md border text-sm">
              {feedback}
            </div>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditMode(true)}
              >
                Editar Feedback
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center p-4 bg-gray-50 rounded-md border border-dashed">
              {status === 'feedback' ? (
                <p className="text-sm text-muted-foreground">
                  O cliente enviou feedback, mas ele ainda não foi registrado.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  O cliente ainda não enviou nenhum feedback.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditMode(true)}
              >
                Adicionar Feedback
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFeedbackCard;
