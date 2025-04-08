
// Utility to get contract content as plain text for emails

export const ContractContent = {
  getEssencialContract: (): string => {
    return `
      <h3 style="font-weight: bold; margin-bottom: 10px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL</h3>
      <p style="margin-bottom: 10px;">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
      <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Essencial.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
      <p>2.1. O serviço inclui:<br />
         a) 1 (uma) composição musical (letra + melodia) via IA com supervisão humana;<br />
         b) 1 (uma) revisão de letra/estrutura musical;<br />
         c) Arquivo digital em alta qualidade (MP3/WAV);<br />
         d) Entrega em até 72 horas úteis;<br />
         e) Certificado digital de autoria.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS</h4>
      <p>3.1. O CONTRATANTE recebe uma licença não-exclusiva, intransferível, para uso EXCLUSIVAMENTE PESSOAL E NÃO-COMERCIAL da OBRA MUSICAL.<br />
         3.2. É expressamente VEDADA a reprodução pública, comercialização, adaptação, sincronização com imagens, ou cessão a terceiros da OBRA MUSICAL.<br />
         3.3. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA para [Nome do CONTRATANTE]".</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA QUARTA - DA PROPRIEDADE INTELECTUAL</h4>
      <p>4.1. O CONTRATANTE detém direitos sobre o conteúdo fornecido para criação.<br />
         4.2. A CONTRATADA mantém direitos sobre melodia, harmonia e arranjos.<br />
         4.3. A OBRA MUSICAL é protegida por certificado digital de autoria emitido pela CONTRATADA.<br />
         4.4. Qualquer registro adicional da OBRA MUSICAL em órgãos como UBC, ECAD ou similares é de responsabilidade exclusiva do CONTRATANTE.</p>
    `;
  },
  
  getProfissionalContract: (): string => {
    return `
      <h3 style="font-weight: bold; margin-bottom: 10px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL</h3>
      <p style="margin-bottom: 10px;">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
      <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Profissional.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
      <p>2.1. O serviço inclui:<br />
         a) 3 (três) propostas de composição em estilos diferentes;<br />
         b) 2 (duas) revisões incluídas;<br />
         c) Masterização básica;<br />
         d) Stems básicos separados (voz + instrumentação);<br />
         e) Entrega em até 5 dias úteis;<br />
         f) Certificado digital de autoria com verificação via hash criptográfico.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS</h4>
      <p>3.1. O CONTRATANTE recebe uma licença limitada para:<br />
         a) Uso em conteúdo digital próprio (canais pessoais de redes sociais, podcast, site);<br />
         b) Monetização em plataformas digitais onde o CONTRATANTE seja o titular da conta;<br />
         c) Execução em eventos particulares ou corporativos do CONTRATANTE.<br />
         3.2. É expressamente VEDADO:<br />
         a) Sublicenciar ou revender a OBRA MUSICAL;<br />
         b) Ceder a terceiros para uso em conteúdo não vinculado diretamente ao CONTRATANTE;<br />
         c) Sincronização comercial com produções audiovisuais para distribuição em cinema ou TV.</p>
    `;
  },
  
  getPremiumContract: (): string => {
    return `
      <h3 style="font-weight: bold; margin-bottom: 10px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM</h3>
      <p style="margin-bottom: 10px;">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
      <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Premium.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
      <p>2.1. O serviço inclui:<br />
         a) 5 (cinco) propostas de conceito/estilo;<br />
         b) 3 (três) revisões completas;<br />
         c) Registro da letra na Biblioteca Nacional;<br />
         d) Masterização profissional com ajustes manuais;<br />
         e) Stems completos separados;<br />
         f) Entrega em até 7 dias úteis;<br />
         g) Certificado digital de autoria com registro em blockchain e documentação completa.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA TERCEIRA - DA CESSÃO DE DIREITOS AUTORAIS</h4>
      <p>3.1. A CONTRATADA transfere ao CONTRATANTE a titularidade dos direitos patrimoniais sobre a OBRA MUSICAL, nos termos do Termo de Cessão de Direitos Autorais anexo a este contrato.</p>
      
      <h4 style="font-weight: bold; margin-top: 15px;">CLÁUSULA QUARTA - DOS REGISTROS LEGAIS</h4>
      <p>4.1. A CONTRATADA providenciará o registro da LETRA da OBRA MUSICAL na Biblioteca Nacional em nome do CONTRATANTE.<br />
         4.2. A CONTRATADA realizará registro em blockchain como evidência de precedência temporal, não substituindo registros oficiais completos.<br />
         4.3. Quaisquer registros adicionais de melodia, arranjo ou fonograma em órgãos como UBC, ECAD ou similares são de responsabilidade exclusiva do CONTRATANTE.</p>
    `;
  }
};
