import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Edit2, 
  Save, 
  X 
} from 'lucide-react';

export interface BriefingDetailFormProps {
  briefingId: string;
  onClose?: () => void;
}

interface BriefingData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageType: 'essencial' | 'profissional' | 'premium';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  story: string;
  musicStyle: string;
  emotions: string[];
  duration: string;
  notes: string;
  budget: number;
  deadline: string;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefingId, 
  onClose 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BriefingData>({
    id: briefingId,
    clientName: "João Silva",
    clientEmail: "joao.silva@email.com",
    clientPhone: "(11) 99999-9999",
    packageType: "profissional",
    status: "in_progress",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:45:00Z",
    story: "Quero uma música para minha esposa no nosso aniversário de 10 anos. Ela sempre amou MPB e temos muitas memórias com Caetano Veloso.",
    musicStyle: "MPB",
    emotions: ["Amor", "Nostalgia", "Alegria"],
    duration: "3-4 minutos",
    notes: "", // ✅ INICIALIZADO COMO STRING VAZIA
    budget: 800,
    deadline: "2024-02-15"
  });

  const handleChange = (field: keyof BriefingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Lógica para salvar as alterações
    console.log('Salvando briefing:', formData);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPackageColor = (packageType: string) => {
    const colors = {
      essencial: 'bg-green-100 text-green-800',
      profissional: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800'
    };
    return colors[packageType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Briefing #{briefingId}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(formData.status)}>
              {formData.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPackageColor(formData.packageType)}>
              {formData.packageType}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)} 
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome</Label>
              {isEditing ? (
                <Input
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium">{formData.clientName}</p>
              )}
            </div>
            
            <div>
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleChange('clientEmail', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.clientEmail}</p>
              )}
            </div>
            
            <div>
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              {isEditing ? (
                <Input
                  value={formData.clientPhone}
                  onChange={(e) => handleChange('clientPhone', e.target.value)}
                />
              ) : (
                <p className="text-sm">{formData.clientPhone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Projeto */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalhes do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>História / Conceito</Label>
              {isEditing ? (
                <Textarea
                  value={formData.story}
                  onChange={(e) => handleChange('story', e.target.value)}
                  placeholder="Descreva a história ou conceito da música"
                  rows={3}
                />
              ) : (
                <p className="text-sm bg-gray-50 p-3 rounded-md">{formData.story}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Estilo Musical</Label>
                {isEditing ? (
                  <Select 
                    value={formData.musicStyle} 
                    onValueChange={(value) => handleChange('musicStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MPB">MPB</SelectItem>
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{formData.musicStyle}</p>
                )}
              </div>

              <div>
                <Label>Duração</Label>
                {isEditing ? (
                  <Select 
                    value={formData.duration} 
                    onValueChange={(value) => handleChange('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 minutos">1-2 minutos</SelectItem>
                      <SelectItem value="2-3 minutos">2-3 minutos</SelectItem>
                      <SelectItem value="3-4 minutos">3-4 minutos</SelectItem>
                      <SelectItem value="4+ minutos">4+ minutos</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{formData.duration}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Emoções</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.emotions.map((emotion, index) => (
                  <Badge key={index} variant="outline">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label>Notas Adicionais</Label>
              {/* ✅ CORRIGIDO: placeholder adicionado */}
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Adicione notas ou observações sobre este briefing"
                rows={4}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Orçamento</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', parseFloat(e.target.value))}
                    placeholder="0"
                  />
                ) : (
                  <p className="text-sm font-medium">
                    R$ {formData.budget.toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Prazo
                </Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {new Date(formData.deadline).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Criado em:</span>{' '}
              {new Date(formData.createdAt).toLocaleString('pt-BR')}
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>{' '}
              {new Date(formData.updatedAt).toLocaleString('pt-BR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefingDetailForm;
