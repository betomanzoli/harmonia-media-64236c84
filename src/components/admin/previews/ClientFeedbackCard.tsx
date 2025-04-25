
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle, Edit, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ClientFeedbackCardProps {
  feedback: string;
  status: string;
  onSaveFeedback?: (feedback: string) => void;
}

const ClientFeedbackCard: React.FC<ClientFeedbackCardProps> = ({ 
  feedback, 
  status,
  onSaveFeedback
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(feedback);
  
  const handleSave = () => {
    if (onSaveFeedback) {
      onSaveFeedback(editedFeedback);
    }
    setIsEditing(false);
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3" />
            Aguardando avaliação
          </Badge>
        );
      case 'feedback':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-300">
            <MessageSquare className="h-3 w-3" />
            Feedback recebido
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3" />
            Projeto aprovado
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Feedback do Cliente
        </CardTitle>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          
          {onSaveFeedback && (
            isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave} 
                className="border-green-500 text-green-500 hover:bg-green-50"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Salvar
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)} 
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Editar
              </Button>
            )
          )}
        </div>
      </CardHeader>
      <CardContent>
        {status === 'waiting' && !feedback && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            <p>O cliente ainda não enviou feedback para este projeto.</p>
          </div>
        )}
        
        {isEditing ? (
          <Textarea 
            value={editedFeedback} 
            onChange={(e) => setEditedFeedback(e.target.value)}
            placeholder="Insira o feedback do cliente aqui..."
            className="min-h-[150px]"
          />
        ) : feedback ? (
          <div className="bg-background border p-4 rounded-md whitespace-pre-wrap">
            {feedback}
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            Nenhum feedback registrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientFeedbackCard;
