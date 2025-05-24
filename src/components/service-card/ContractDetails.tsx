
import React from 'react';

// Contract content object that provides methods to get different contract texts
export const ContractContent = {
  getEssencialContract: () => {
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Essencial.

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO
2.1. O serviço inclui:
a) 1 (uma) composição musical (letra + melodia) via IA com supervisão humana;
b) 1 (uma) revisão de letra/estrutura musical;
c) Arquivo digital em alta qualidade (MP3/WAV);
d) Entrega em até 72 horas úteis;
e) Certificado digital de autoria.

CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS
3.1. O CONTRATANTE recebe uma licença não-exclusiva, intransferível, para uso EXCLUSIVAMENTE PESSOAL E NÃO-COMERCIAL da OBRA MUSICAL.
3.2. É expressamente VEDADA a reprodução pública, comercialização, adaptação, sincronização com imagens, ou cessão a terceiros da OBRA MUSICAL.
3.3. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA".`;
  },
  
  getProfissionalContract: () => {
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Profissional.

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO
2.1. O serviço inclui:
a) 1 (uma) composição musical (letra + melodia) via IA com supervisão humana;
b) Até 2 (duas) revisões de letra/estrutura musical;
c) Produção musical com arranjo profissional;
d) Arquivo digital em alta qualidade (MP3/WAV);
e) Entrega em até 5 dias úteis;
f) Certificado digital de autoria;
g) Uso pessoal e comercial limitado.

CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS
3.1. O CONTRATANTE recebe uma licença não-exclusiva para uso PESSOAL E COMERCIAL LIMITADO da OBRA MUSICAL.
3.2. O uso comercial limitado permite a utilização em até 3 (três) vídeos online, 1 (uma) apresentação ao vivo, e sincronização com imagens para fins promocionais pessoais.
3.3. É vedada a comercialização direta da OBRA MUSICAL como produto independente.
3.4. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA".`;
  },
  
  getPremiumContract: () => {
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Premium.

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO
2.1. O serviço inclui:
a) 1 (uma) composição musical (letra + melodia) via IA com supervisão humana;
b) Revisões ilimitadas de letra/estrutura musical;
c) Produção musical premium com arranjo personalizado;
d) Mixagem e masterização profissional;
e) Arquivo digital em alta qualidade (MP3/WAV/STEMS);
f) Entrega em até 10 dias úteis;
g) Certificado digital de autoria;
h) Uso comercial completo.

CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS
3.1. O CONTRATANTE recebe uma licença não-exclusiva para uso PESSOAL E COMERCIAL COMPLETO da OBRA MUSICAL.
3.2. O uso comercial completo permite utilização sem restrições quantitativas em vídeos, apresentações ao vivo, sincronização com imagens e distribuição em plataformas digitais.
3.3. O CONTRATANTE pode comercializar a OBRA MUSICAL como parte de produtos e serviços.
3.4. O CONTRATANTE pode registrar a OBRA MUSICAL em seu nome nas entidades de direitos autorais.
3.5. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA".`;
  }
};

interface ContractDetailsProps {
  packageType: 'essencial' | 'profissional' | 'premium';
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ packageType }) => {
  let contractText = '';
  
  switch(packageType) {
    case 'essencial':
      contractText = ContractContent.getEssencialContract();
      break;
    case 'profissional':
      contractText = ContractContent.getProfissionalContract();
      break;
    case 'premium':
      contractText = ContractContent.getPremiumContract();
      break;
    default:
      contractText = ContractContent.getEssencialContract();
  }
  
  return (
    <div className="bg-gray-50 p-4 rounded-md border text-sm">
      <pre className="whitespace-pre-wrap font-mono text-xs">
        {contractText}
      </pre>
    </div>
  );
};

export default ContractDetails;
