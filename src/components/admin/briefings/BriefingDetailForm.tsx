
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Briefing } from '@/hooks/admin/useBriefings';

interface BriefingDetailFormProps {
  briefing: Briefing;
  isEditing: boolean;
  onClose: () => void;
  onUpdate?: (updatedBriefing: Briefing) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefing, 
  isEditing, 
  onClose, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState<Briefing>({ ...briefing });
  const [packageSpecificData, setPackageSpecificData] = useState(briefing.formData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (value: string) => {
    setFormData(prev => ({ ...prev, packageType: value }));
  };

  const handlePackageFieldsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPackageSpecificData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setPackageSpecificData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({
        ...formData,
        formData: packageSpecificData
      });
    }
  };

  const renderEssentialPackageFields = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storyDescription">História ou Conceito</Label>
          <Textarea
            id="storyDescription"
            name="storyDescription"
            value={packageSpecificData.storyDescription || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            rows={4}
            placeholder="Descreva a história ou conceito que deseja transformar em música"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emotions">Emoções Principais</Label>
          <Input
            id="emotions"
            name="emotions"
            value={packageSpecificData.emotions || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Alegria, Nostalgia, Amor, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="musicStyle">Estilo Musical</Label>
          <Input
            id="musicStyle"
            name="musicStyle"
            value={packageSpecificData.musicStyle || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Pop, MPB, Rock, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referenceArtists">Artistas de Referência</Label>
          <Input
            id="referenceArtists"
            name="referenceArtists"
            value={packageSpecificData.referenceArtists || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Mencione até 3 artistas de referência"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tempo">Andamento</Label>
          <Select
            value={packageSpecificData.tempo || ''}
            onValueChange={(value) => handleSelectChange('tempo', value)}
            disabled={!isEditing}
          >
            <SelectTrigger id="tempo">
              <SelectValue placeholder="Selecione o andamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lento">Lento e contemplativo</SelectItem>
              <SelectItem value="medio">Médio e equilibrado</SelectItem>
              <SelectItem value="animado">Animado e energético</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specificPhrases">Frases Específicas</Label>
          <Input
            id="specificPhrases"
            name="specificPhrases"
            value={packageSpecificData.specificPhrases || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="A música deve incluir alguma frase específica?"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="certificateName">Nome para Certificado</Label>
          <Input
            id="certificateName"
            name="certificateName"
            value={packageSpecificData.certificateName || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Nome completo para o certificado"
          />
        </div>
      </div>
    );
  };

  const renderProfessionalPackageFields = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="storyDescription">História e Conceito</Label>
          <Textarea
            id="storyDescription"
            name="storyDescription"
            value={packageSpecificData.storyDescription || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            rows={4}
            placeholder="Descrição detalhada da história ou conceito"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purpose">Propósito Principal</Label>
          <Select
            value={packageSpecificData.purpose || ''}
            onValueChange={(value) => handleSelectChange('purpose', value)}
            disabled={!isEditing}
          >
            <SelectTrigger id="purpose">
              <SelectValue placeholder="Selecione o propósito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="identidade">Identidade sonora para marca/conteúdo</SelectItem>
              <SelectItem value="trilha">Trilha para vídeo/podcast</SelectItem>
              <SelectItem value="conteudo">Conteúdo para monetização</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="musicStyles">Estilos Musicais</Label>
          <Input
            id="musicStyles"
            name="musicStyles"
            value={packageSpecificData.musicStyles || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Estilos musicais desejados (até 3)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bpm">BPM Aproximado</Label>
          <Input
            id="bpm"
            name="bpm"
            value={packageSpecificData.bpm || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Tempo/BPM aproximado"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instruments">Instrumentos Destacados</Label>
          <Input
            id="instruments"
            name="instruments"
            value={packageSpecificData.instruments || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Instrumentos que gostaria de destacar"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="structure">Estrutura Preferida</Label>
          <Select
            value={packageSpecificData.structure || ''}
            onValueChange={(value) => handleSelectChange('structure', value)}
            disabled={!isEditing}
          >
            <SelectTrigger id="structure">
              <SelectValue placeholder="Selecione a estrutura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tradicional">Tradicional (intro, verso, refrão...)</SelectItem>
              <SelectItem value="narrativa">Narrativa (desenvolvimento contínuo)</SelectItem>
              <SelectItem value="minimalista">Minimalista (loops com pequenas variações)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="referenceLinks">Links de Referência</Label>
          <Textarea
            id="referenceLinks"
            name="referenceLinks"
            value={packageSpecificData.referenceLinks || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            rows={2}
            placeholder="Links para músicas de referência"
          />
        </div>
      </div>
    );
  };

  const renderPremiumPackageFields = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conceptDescription">Conceito e Aplicação</Label>
          <Textarea
            id="conceptDescription"
            name="conceptDescription"
            value={packageSpecificData.conceptDescription || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            rows={4}
            placeholder="Descrição detalhada do conceito e valores"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="strategicObjectives">Objetivos Estratégicos</Label>
          <Textarea
            id="strategicObjectives"
            name="strategicObjectives"
            value={packageSpecificData.strategicObjectives || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            rows={2}
            placeholder="Objetivos estratégicos para a composição"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Público-Alvo</Label>
          <Input
            id="targetAudience"
            name="targetAudience"
            value={packageSpecificData.targetAudience || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Público-alvo e contexto de utilização"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryEmotions">Emoções Primárias</Label>
          <Input
            id="primaryEmotions"
            name="primaryEmotions"
            value={packageSpecificData.primaryEmotions || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Emoções primárias (até 3)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryEmotions">Emoções Secundárias</Label>
          <Input
            id="secondaryEmotions"
            name="secondaryEmotions"
            value={packageSpecificData.secondaryEmotions || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Emoções secundárias (até 3)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="centralMessage">Mensagem Central</Label>
          <Input
            id="centralMessage"
            name="centralMessage"
            value={packageSpecificData.centralMessage || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Mensagem central a ser transmitida"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="musicStyles">Estilos Musicais</Label>
          <Input
            id="musicStyles"
            name="musicStyles"
            value={packageSpecificData.musicStyles || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Estilos musicais (até 5)"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registrationName">Nome para Registro</Label>
          <Input
            id="registrationName"
            name="registrationName"
            value={packageSpecificData.registrationName || ''}
            onChange={handlePackageFieldsChange}
            disabled={!isEditing}
            placeholder="Nome completo para registro na Biblioteca Nacional"
          />
        </div>
      </div>
    );
  };

  const renderPackageFields = () => {
    // Convert packageType to lowercase for standardized comparison
    const packageTypeLower = formData.packageType.toLowerCase();
    
    if (packageTypeLower.includes('essencial')) {
      return renderEssentialPackageFields();
    } else if (packageTypeLower.includes('profissional')) {
      return renderProfessionalPackageFields();
    } else if (packageTypeLower.includes('premium')) {
      return renderPremiumPackageFields();
    } else {
      return <p className="text-muted-foreground">Pacote não reconhecido</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Cliente</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="packageType">Pacote</Label>
          <Select 
            value={formData.packageType} 
            onValueChange={handlePackageChange}
            disabled={!isEditing}
          >
            <SelectTrigger id="packageType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essencial">Essencial</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          disabled={!isEditing}
          rows={3}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Informações Específicas do Pacote {formData.packageType}</h3>
        {renderPackageFields()}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {isEditing ? 'Cancelar' : 'Fechar'}
        </Button>
        {isEditing && <Button type="submit">Salvar Alterações</Button>}
      </div>
    </form>
  );
};

export default BriefingDetailForm;
