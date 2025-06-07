
// Utility to get contract content as plain text for emails

export const ContractContent = {
  getExpressContract: (): string => {
    return `
      <div style="line-height: 1.6; font-family: Arial, sans-serif;">
        <h2 style="color: #333; margin-bottom: 20px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS – PACOTE EXPRESS</h2>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA PRIMEIRA – DO OBJETO</h3>
        <p>1.1. Prestação de serviços de criação musical personalizada, assistida por inteligência artificial, conforme especificações do Pacote Express, nas seguintes modalidades:</p>
        <ul>
          <li><strong>Express com Letra:</strong> Criação de 6 (seis) versões musicais baseadas em 1 (uma) letra fornecida pelo CONTRATANTE, explorando diferentes estilos.</li>
          <li><strong>Express sem Letra:</strong> Criação de 3 (três) letras originais, cada uma com 2 (duas) versões musicais distintas, totalizando 6 (seis) versões.</li>
        </ul>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA SEGUNDA – DAS OBRIGAÇÕES</h3>
        <p>2.1. O CONTRATANTE deverá fornecer informações claras sobre suas preferências musicais através do briefing.</p>
        <p>2.2. harmonIA se compromete a entregar as versões dentro do prazo de 2 a 3 dias úteis, conforme modalidade escolhida.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA TERCEIRA – DOS DIREITOS CONCEDIDOS</h3>
        <p>3.1. O CONTRATANTE recebe uma licença não-exclusiva, intransferível, para uso <strong>pessoal e não-comercial</strong> da(s) obra(s) musical(is) entregue(s) neste pacote.</p>
        <p>3.2. Para uso comercial, sincronização com imagens, distribuição em plataformas digitais ou qualquer finalidade diversa do uso pessoal, o CONTRATANTE deverá contratar um upgrade para um pacote superior ou serviço adicional de cessão de direitos.</p>
        <p>3.3. O CONTRATANTE se compromete a não sublicenciar, revender ou ceder a terceiros a(s) obra(s) musical(is) recebida(s) neste pacote.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA QUARTA – DA PROPRIEDADE INTELECTUAL</h3>
        <p>4.1. No Express com Letra: O CONTRATANTE declara ser autor da letra fornecida, responsabilizando-se integralmente por sua originalidade e por eventuais reivindicações de terceiros.</p>
        <p>4.2. No Express sem Letra: harmonIA cede ao CONTRATANTE o direito de uso pessoal das letras e músicas geradas, conforme limites deste contrato.</p>
        <p>4.3. harmonIA mantém a titularidade sobre os métodos, arranjos e processos criativos utilizados, podendo reutilizá-los em outros projetos, exceto a letra fornecida pelo CONTRATANTE.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA QUINTA – DA RESPONSABILIDADE POR USO INDEVIDO</h3>
        <p>5.1. O CONTRATANTE assume integral e exclusiva responsabilidade por qualquer uso da(s) obra(s) musical(is) que exceda os limites estabelecidos neste contrato.</p>
        <p>5.2. harmonIA não responderá, em nenhuma hipótese, por disputas ou reivindicações de terceiros decorrentes de uso indevido da(s) obra(s) musical(is) pelo CONTRATANTE.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA SEXTA – DO VALOR E PAGAMENTO</h3>
        <p>6.1. O pagamento deverá ser realizado integralmente no ato da contratação, via opções disponíveis no site harmonIA.</p>
        <p>6.2. O início da produção ocorrerá apenas após a confirmação do pagamento.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA SÉTIMA – DA ENTREGA E ACEITAÇÃO</h3>
        <p>7.1. As versões serão entregues em formato digital, por link seguro enviado ao e-mail do CONTRATANTE.</p>
        <p>7.2. O CONTRATANTE poderá, caso deseje ajustes, contratar os serviços extras de revisão ou multiestilos, conforme tabela vigente.</p>
        <p>7.3. Após a entrega, os arquivos ficarão disponíveis para download pelo período de 90 (noventa) dias.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA OITAVA – DA VIGÊNCIA E RESCISÃO</h3>
        <p>8.1. O presente contrato entra em vigor na data do aceite digital pelo CONTRATANTE e se encerra com a entrega das versões.</p>
        <p>8.2. Em caso de desistência antes do início da produção, haverá reembolso integral. Após o início, não haverá reembolso.</p>
        
        <h3 style="color: #333; margin-top: 20px;">CLÁUSULA NONA – DA PRIVACIDADE E DADOS</h3>
        <p>9.1. harmonIA tratará os dados do CONTRATANTE conforme sua <a href="https://harmonia.media/privacidade" style="color: #2ebd35;">Política de Privacidade</a>, armazenando arquivos por até 90 (noventa) dias após a entrega final.</p>
        <p>9.2. O CONTRATANTE declara estar ciente e de acordo com os <a href="https://harmonia.media/termos" style="color: #2ebd35;">Termos de Serviço</a>.</p>
        
        <p style="margin-top: 30px; font-weight: bold; text-align: center; color: #333;">
          AO PROSSEGUIR COM O PAGAMENTO, O CONTRATANTE DECLARA TER LIDO, COMPREENDIDO E ACEITO TODOS OS TERMOS DESTE CONTRATO.
        </p>
      </div>
    `;
  },

  getEssencialContract: (): string => {
    return `
      <h3 style="font-weight: bold; margin-bottom: 10px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL</h3>
      
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
         3.3. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA".</p>
      
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
