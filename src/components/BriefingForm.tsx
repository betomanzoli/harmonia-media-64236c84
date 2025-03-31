
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BriefingForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    occasion: "",
    style: "",
    story: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Entraremos em contato em breve para discutir seu projeto musical.",
    });
    
    setFormData({
      occasion: "",
      style: "",
      story: "",
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h3 className="text-xl font-semibold mb-6">Formulário de Briefing</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="occasion" className="block text-sm font-medium mb-1">
            Qual é a ocasião?
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
            required
          >
            <option value="">Selecione uma ocasião</option>
            <option value="aniversario">Aniversário</option>
            <option value="casamento">Casamento</option>
            <option value="corporativo">Evento Corporativo</option>
            <option value="presente">Presente</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-1">
            Qual estilo musical você prefere?
          </label>
          <input
            id="style"
            name="style"
            type="text"
            value={formData.style}
            onChange={handleChange}
            className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
            placeholder="Ex.: MPB, pop, instrumental etc"
            required
          />
        </div>
        
        <div>
          <label htmlFor="story" className="block text-sm font-medium mb-1">
            Conte sua história ou objetivo em até 3 frases:
          </label>
          <textarea
            id="story"
            name="story"
            rows={4}
            value={formData.story}
            onChange={handleChange}
            className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
            placeholder="Ex.: 'Quero homenagear meus pais pelos seus 50 anos juntos.'"
            required
          />
        </div>
        
        <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
          Enviar Briefing
        </Button>
      </form>
    </div>
  );
};

export default BriefingForm;
