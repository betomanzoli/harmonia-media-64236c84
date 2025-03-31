
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BriefingForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    occasion: "",
    style: "",
    story: "",
    name: "",
    phone: "",
    email: "",
    contactPreference: "whatsapp",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Google Sheets integration via Google Forms
      // This simulates the submission to a Google Form webhook that populates a Google Sheet
      const googleFormsEndpoint = "https://docs.google.com/forms/u/0/d/e/YOUR_FORM_ID/formResponse";
      
      // In a real implementation, you would use your actual Google Form parameters and make a POST request
      console.log("Form data to be sent to Google Sheets:", formData);
      
      // Simulate successful submission
      setTimeout(() => {
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Entraremos em contato em breve para discutir seu projeto musical.",
        });
        
        setFormData({
          occasion: "",
          style: "",
          story: "",
          name: "",
          phone: "",
          email: "",
          contactPreference: "whatsapp",
        });
        
        setIsSubmitting(false);
        
        // Simulate Zapier/Make.com automation flow - this would happen on the server side in a real implementation
        console.log("Zapier automation: Creating Trello card for new project");
        console.log("Zapier automation: Initiating Suno AI music generation task");
        console.log("Zapier automation: Scheduling Moises mastering task");
        
        // If contactPreference is whatsapp, open WhatsApp
        if (formData.contactPreference === "whatsapp" && formData.phone) {
          const phoneNumber = formData.phone.replace(/\D/g, '');
          const message = `Olá! Acabo de enviar um briefing para a harmonIA. Meu nome é ${formData.name} e gostaria de criar uma música para ${formData.occasion}. Aguardo contato!`;
          window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Ocorreu um erro ao enviar seu briefing. Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h3 className="text-xl font-semibold mb-6">Formulário de Briefing</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Seu nome completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
            placeholder="Digite seu nome"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Seu e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Seu WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
              placeholder="(11) 99999-9999"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="contactPreference" className="block text-sm font-medium mb-1">
            Preferência de contato
          </label>
          <select
            id="contactPreference"
            name="contactPreference"
            value={formData.contactPreference}
            onChange={handleChange}
            className="w-full bg-secondary border border-border rounded-md p-2 focus:border-harmonia-green focus:outline-none"
          >
            <option value="whatsapp">WhatsApp (resposta em até 2h)</option>
            <option value="email">E-mail (resposta em até 24h)</option>
          </select>
        </div>
        
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
        
        <Button 
          type="submit" 
          className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Briefing"}
        </Button>
      </form>
    </div>
  );
};

export default BriefingForm;
