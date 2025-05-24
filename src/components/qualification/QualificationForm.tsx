
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const QualificationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    needsBy: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store qualification data in localStorage
    localStorage.setItem('qualificationData', JSON.stringify(formData));
    // Redirect to payment page
    navigate('/payment');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" required>Nome completo</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="Seu nome completo" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" required>Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="seu@email.com" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="(XX) XXXXX-XXXX" 
          value={formData.phone} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project" required>Descreva seu projeto</Label>
        <Textarea 
          id="project" 
          name="project" 
          placeholder="Conte um pouco sobre o projeto musical que você precisa..." 
          value={formData.project} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="needsBy">Prazo desejado</Label>
        <Input 
          id="needsBy" 
          name="needsBy" 
          placeholder="Em quanto tempo você precisa do projeto finalizado?" 
          value={formData.needsBy} 
          onChange={handleChange} 
        />
      </div>
      
      <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
        Continuar para pagamento
      </Button>
    </form>
  );
};

export default QualificationForm;
