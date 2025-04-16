
import React from 'react';

interface ContractContentProps {
  title: string;
}

const ContractContent: React.FC<ContractContentProps> = ({ title }) => {
  // Determine contract content based on package title
  const getContractContent = () => {
    if (title.includes('Premium')) {
      return premiumContract;
    } else if (title.includes('Profissional')) {
      return professionalContract;
    } else {
      return essentialContract;
    }
  };

  const contractContent = getContractContent();
  
  return (
    <div className="max-h-[400px] overflow-y-auto border border-border rounded-md p-4 my-4">
      <div dangerouslySetInnerHTML={{ __html: contractContent }} />
    </div>
  );
};

// Contract templates without personal information
const essentialContract = `
<h3 class="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL</h3>
<p class="mb-4">
  CONTRATADA: harmonIA
  <br />
  CONTRATANTE: Cliente contratante dos serviços
</p>

<p class="mb-2">
  Pelo presente instrumento particular de Contrato de Prestação de Serviços, as partes acima qualificadas têm entre si justas e contratadas as seguintes condições:
</p>

<h4 class="font-bold mt-4 mb-2">1. OBJETO</h4>
<p class="mb-2">
  1.1. O presente contrato tem por objeto a prestação de serviços de composição musical personalizada no formato "Pacote Essencial", que inclui:
</p>
<ul class="list-disc pl-6 mb-4">
  <li>Composição musical personalizada com base no briefing fornecido pelo CONTRATANTE;</li>
  <li>Uma revisão inclusa;</li>
  <li>Entrega em até 7 dias úteis a partir da aprovação do briefing;</li>
  <li>Licença para uso pessoal, não comercial.</li>
</ul>

<h4 class="font-bold mt-4 mb-2">2. VALOR E FORMA DE PAGAMENTO</h4>
<p class="mb-2">
  2.1. Pela prestação dos serviços, o CONTRATANTE pagará à CONTRATADA o valor especificado na plataforma.
</p>
<p class="mb-2">
  2.2. O pagamento será realizado antecipadamente, através das formas de pagamento disponibilizadas no site.
</p>

<h4 class="font-bold mt-4 mb-2">3. DIREITOS DE USO</h4>
<p class="mb-2">
  3.1. O "Pacote Essencial" concede ao CONTRATANTE uma licença limitada de uso pessoal da composição musical.
</p>
<p class="mb-2">
  3.2. A licença NÃO inclui direitos para uso comercial, reprodução pública, ou modificação da obra sem autorização.
</p>
<p class="mb-2">
  3.3. A CONTRATADA não garante exclusividade absoluta da composição, dado o processo assistido por IA.
</p>

<h4 class="font-bold mt-4 mb-2">4. PRAZO DE ENTREGA</h4>
<p class="mb-2">
  4.1. O prazo de entrega é de até 7 dias úteis a partir da aprovação do briefing e confirmação do pagamento.
</p>

<h4 class="font-bold mt-4 mb-2">5. REVISÕES</h4>
<p class="mb-2">
  5.1. O pacote inclui 1 (uma) revisão gratuita, a ser solicitada em até 15 dias após a entrega.
</p>
<p class="mb-2">
  5.2. Revisões adicionais poderão ser contratadas separadamente.
</p>

<h4 class="font-bold mt-4 mb-2">6. CONSIDERAÇÕES FINAIS</h4>
<p class="mb-2">
  6.1. Ao aceitar este contrato, o CONTRATANTE declara ter lido, compreendido e concordado com todas as cláusulas aqui presentes.
</p>
<p class="mb-2">
  6.2. Este contrato é regido pelas leis brasileiras.
</p>
`;

const professionalContract = `
<h3 class="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL</h3>
<p class="mb-4">
  CONTRATADA: harmonIA
  <br />
  CONTRATANTE: Cliente contratante dos serviços
</p>

<p class="mb-2">
  Pelo presente instrumento particular de Contrato de Prestação de Serviços, as partes acima qualificadas têm entre si justas e contratadas as seguintes condições:
</p>

<h4 class="font-bold mt-4 mb-2">1. OBJETO</h4>
<p class="mb-2">
  1.1. O presente contrato tem por objeto a prestação de serviços de composição musical personalizada no formato "Pacote Profissional", que inclui:
</p>
<ul class="list-disc pl-6 mb-4">
  <li>Composição musical personalizada com base no briefing fornecido pelo CONTRATANTE;</li>
  <li>Três versões para escolha;</li>
  <li>Até três revisões inclusas;</li>
  <li>Entrega em até 10 dias úteis a partir da aprovação do briefing;</li>
  <li>Licença para uso comercial limitado.</li>
</ul>

<h4 class="font-bold mt-4 mb-2">2. VALOR E FORMA DE PAGAMENTO</h4>
<p class="mb-2">
  2.1. Pela prestação dos serviços, o CONTRATANTE pagará à CONTRATADA o valor especificado na plataforma.
</p>
<p class="mb-2">
  2.2. O pagamento será realizado antecipadamente, através das formas de pagamento disponibilizadas no site.
</p>

<h4 class="font-bold mt-4 mb-2">3. DIREITOS DE USO</h4>
<p class="mb-2">
  3.1. O "Pacote Profissional" concede ao CONTRATANTE uma licença de uso comercial limitado da composição musical.
</p>
<p class="mb-2">
  3.2. A licença inclui direitos para uso em conteúdo digital próprio, como vlogs, podcasts, ou vídeos para redes sociais.
</p>
<p class="mb-2">
  3.3. A licença NÃO inclui direitos para revenda ou sublicenciamento da composição.
</p>
<p class="mb-2">
  3.4. A CONTRATADA não garante exclusividade absoluta da composição, dado o processo assistido por IA.
</p>

<h4 class="font-bold mt-4 mb-2">4. PRAZO DE ENTREGA</h4>
<p class="mb-2">
  4.1. O prazo de entrega é de até 10 dias úteis a partir da aprovação do briefing e confirmação do pagamento.
</p>

<h4 class="font-bold mt-4 mb-2">5. REVISÕES</h4>
<p class="mb-2">
  5.1. O pacote inclui até 3 (três) revisões gratuitas, a serem solicitadas em até 30 dias após a entrega.
</p>
<p class="mb-2">
  5.2. Revisões adicionais poderão ser contratadas separadamente.
</p>

<h4 class="font-bold mt-4 mb-2">6. CONSIDERAÇÕES FINAIS</h4>
<p class="mb-2">
  6.1. Ao aceitar este contrato, o CONTRATANTE declara ter lido, compreendido e concordado com todas as cláusulas aqui presentes.
</p>
<p class="mb-2">
  6.2. Este contrato é regido pelas leis brasileiras.
</p>
`;

const premiumContract = `
<h3 class="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM</h3>
<p class="mb-4">
  CONTRATADA: harmonIA
  <br />
  CONTRATANTE: Cliente contratante dos serviços
</p>

<p class="mb-2">
  Pelo presente instrumento particular de Contrato de Prestação de Serviços, as partes acima qualificadas têm entre si justas e contratadas as seguintes condições:
</p>

<h4 class="font-bold mt-4 mb-2">1. OBJETO</h4>
<p class="mb-2">
  1.1. O presente contrato tem por objeto a prestação de serviços de composição musical personalizada no formato "Pacote Premium", que inclui:
</p>
<ul class="list-disc pl-6 mb-4">
  <li>Composição musical personalizada premium com base no briefing fornecido pelo CONTRATANTE;</li>
  <li>Revisões ilimitadas durante o período de produção;</li>
  <li>Registro na Biblioteca Nacional;</li>
  <li>Entrega em até 15 dias úteis a partir da aprovação do briefing;</li>
  <li>Licença comercial global.</li>
</ul>

<h4 class="font-bold mt-4 mb-2">2. VALOR E FORMA DE PAGAMENTO</h4>
<p class="mb-2">
  2.1. Pela prestação dos serviços, o CONTRATANTE pagará à CONTRATADA o valor especificado na plataforma.
</p>
<p class="mb-2">
  2.2. O pagamento será realizado antecipadamente, através das formas de pagamento disponibilizadas no site.
</p>

<h4 class="font-bold mt-4 mb-2">3. DIREITOS DE USO</h4>
<p class="mb-2">
  3.1. O "Pacote Premium" concede ao CONTRATANTE uma licença comercial global da composição musical.
</p>
<p class="mb-2">
  3.2. A licença inclui direitos para uso em qualquer mídia e formato, incluindo uso comercial amplo.
</p>
<p class="mb-2">
  3.3. A licença NÃO inclui direitos para revenda da composição como produto musical independente.
</p>
<p class="mb-2">
  3.4. A CONTRATADA implementa verificações avançadas para mitigar riscos de similaridade com obras existentes.
</p>

<h4 class="font-bold mt-4 mb-2">4. PRAZO DE ENTREGA</h4>
<p class="mb-2">
  4.1. O prazo de entrega é de até 15 dias úteis a partir da aprovação do briefing e confirmação do pagamento.
</p>
<p class="mb-2">
  4.2. O prazo para registro na Biblioteca Nacional é de até 30 dias adicionais após a aprovação final da composição.
</p>

<h4 class="font-bold mt-4 mb-2">5. REVISÕES</h4>
<p class="mb-2">
  5.1. O pacote inclui revisões ilimitadas durante o período de produção (até 30 dias após a primeira entrega).
</p>

<h4 class="font-bold mt-4 mb-2">6. CONSIDERAÇÕES FINAIS</h4>
<p class="mb-2">
  6.1. Ao aceitar este contrato, o CONTRATANTE declara ter lido, compreendido e concordado com todas as cláusulas aqui presentes.
</p>
<p class="mb-2">
  6.2. Este contrato é regido pelas leis brasileiras.
</p>
`;

export default ContractContent;
