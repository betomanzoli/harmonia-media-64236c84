
# Configuração do Dialogflow (Google Cloud)

## Pré-requisitos

- Uma conta no Google Cloud Platform
- Projeto criado no GCP
- API do Dialogflow ES habilitada

## Passo a Passo Detalhado para Configuração

### 1. Configuração Inicial no Google Cloud

1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Dialogflow ES:
   - No menu lateral, navegue até "APIs e Serviços" > "Biblioteca"
   - Pesquise por "Dialogflow"
   - Selecione "Dialogflow API" e clique em "Ativar"

### 2. Criação e Configuração do Agente

1. Acesse o [Console do Dialogflow](https://dialogflow.cloud.google.com/)
2. Clique em "Criar novo agente"
3. Configure o agente:
   - **Nome do agente**: harmonIA
   - **Idioma padrão**: Português (Brasil)
   - **Fuso horário**: (GMT-03:00) Brasília
   - **Projeto do Google**: Selecione o projeto que você criou anteriormente
4. Clique em "Criar"

### 3. Configuração das Intents

Para cada intent abaixo, você precisará:
1. Clicar em "Intents" no menu lateral
2. Clicar em "Criar Intent"
3. Nomear a intent
4. Adicionar frases de treinamento
5. Configurar respostas (fulfillment)

#### Default Welcome Intent (já criada automaticamente)
- **Frases de treinamento adicionais**:
  - olá
  - oi
  - e aí
  - bom dia
  - boa tarde
  - boa noite
  - preciso de ajuda
  - quero informações

#### Intent: Informações sobre Pacotes
- **Nome**: Informacoes_Pacotes
- **Frases de treinamento**:
  - Quais são os pacotes disponíveis?
  - Quero conhecer os serviços
  - Me fale sobre os preços
  - Quais são as opções de pacotes?
  - Quanto custa uma composição?
  - Vocês têm pacotes para iniciantes?
  - Preciso de informações sobre os serviços
  - O que vocês oferecem?
  - Tipos de pacotes
  - Preciso de um orçamento
- **Parâmetros**: (Opcional) Adicionar parâmetro "tipo_pacote" com entidade @tipo_pacote
- **Fulfillment**: Ativar webhook para esta intent

#### Intent: Amostras de Músicas
- **Nome**: Amostras_Musicas
- **Frases de treinamento**:
  - Quero ouvir exemplos
  - Tem alguma amostra?
  - Posso escutar alguma música?
  - Mostre exemplos do seu trabalho
  - Vocês têm portfólio?
  - Onde posso ouvir o que vocês fazem?
  - Exemplos de músicas
  - Quero ouvir o que vocês produzem
  - Me mostre alguns trabalhos anteriores
  - Portfólio musical
- **Parâmetros**: (Opcional) Adicionar parâmetro "estilo_musical" com entidade @estilo_musical
- **Fulfillment**: Ativar webhook para esta intent

#### Intent: Calcular Preço
- **Nome**: Calcular_Preco
- **Frases de treinamento**:
  - Quanto custa uma música?
  - Quero calcular o preço
  - Como funciona o orçamento?
  - Qual o valor para uma composição?
  - Preciso saber o preço
  - Quanto fica uma música personalizada?
  - Quero saber valores
  - Como é feito o cálculo do valor?
  - Quanto custa um jingle?
  - Preço para música de casamento
- **Parâmetros**:
  - "tipo_projeto" com entidade @tipo_projeto
  - "duracao" com entidade @sys.duration
- **Fulfillment**: Ativar webhook para esta intent

#### Intent: Iniciar Briefing
- **Nome**: Iniciar_Briefing
- **Frases de treinamento**:
  - Quero criar uma música
  - Como faço para começar?
  - Desejo iniciar um projeto
  - Como é o processo de criação?
  - Quero contratar vocês
  - Como faço um pedido?
  - Preciso de uma música
  - Quero encomendar uma composição
  - Processo para iniciar um projeto
  - Como funciona o briefing?
- **Fulfillment**: Ativar webhook para esta intent

#### Intent: Verificar Status
- **Nome**: Verificar_Status
- **Frases de treinamento**:
  - Como está meu pedido?
  - Quero acompanhar meu projeto
  - Status do meu pedido
  - Quando fica pronto?
  - Meu pedido já está em andamento?
  - Quero saber em que fase está meu projeto
  - Acompanhamento de pedido
  - Quanto tempo falta para ficar pronto?
  - Pedido número [número]
  - Status da minha composição
- **Parâmetros**:
  - "numero_pedido" com entidade @sys.number
- **Fulfillment**: Ativar webhook para esta intent

#### Intent: Falar com Atendente
- **Nome**: Falar_Com_Atendente
- **Frases de treinamento**:
  - Quero falar com uma pessoa
  - Preciso de atendimento humano
  - Transferir para atendente
  - Contato com suporte
  - Não estou conseguindo resolver
  - Preciso falar com alguém da equipe
  - Atendimento humano
  - Quero falar com alguém
  - Chat com atendente
  - Preciso falar com o suporte
- **Fulfillment**: Ativar webhook para esta intent

#### Default Fallback Intent (já criada automaticamente)
- **Respostas padrão**: Personalizar as respostas para quando o chatbot não entender a pergunta

### 4. Criação de Entidades Personalizadas (opcional)

1. No menu lateral, clique em "Entidades"
2. Clique em "Criar entidade"

#### Entidade: @tipo_pacote
- **Valores**:
  - básico, simples, inicial, starter
  - premium, avançado, completo, professional
  - personalizado, custom, sob demanda

#### Entidade: @estilo_musical
- **Valores**:
  - mpb, música brasileira, popular brasileira
  - rock, rock and roll
  - pop, música pop
  - eletrônico, eletrônica, edm
  - clássico, música clássica, erudito
  - jazz, blues
  - country, sertanejo
  - hip hop, rap

#### Entidade: @tipo_projeto
- **Valores**:
  - música, composição, canção
  - jingle, vinheta
  - trilha sonora, soundtrack
  - remix, rearranjo
  - podcast, abertura de podcast

### 5. Configuração do Webhook

1. No menu lateral, clique em "Fulfillment"
2. Ative o "Webhook"
3. Configure:
   - **URL**: https://seu-webhook.herokuapp.com/dialogflow (ou sua URL de produção)
   - **Método**: POST
   - **Cabeçalhos**: Content-Type: application/json
   - **Autenticação**: (opcional) Se seu webhook requer autenticação

### 6. Teste do Agente

1. No console do Dialogflow, clique em "Integrations"
2. Ative a integração "Web Demo"
3. Clique em "Try it now" para testar seu chatbot direto no navegador
4. Teste cada intent com diferentes frases para verificar se o reconhecimento está funcionando corretamente

### 7. Implementação de Fulfillment Avançado

Para um processamento mais avançado, você pode implementar um servidor webhook personalizado:

1. Crie um servidor Node.js seguindo as instruções em `/docs/chatbot/webhook-setup.md`
2. Implemente manipuladores para cada intent:
   ```javascript
   exports.dialogflowFulfillment = (req, res) => {
     const intent = req.body.queryResult.intent.displayName;
     
     switch(intent) {
       case 'Informacoes_Pacotes':
         return handlePackageInfo(req, res);
       case 'Amostras_Musicas':
         return handleMusicSamples(req, res);
       // ... outros manipuladores
     }
   };
   ```

### 8. Configuração de Segurança e Autenticação

Para ambientes de produção:

1. No console do Google Cloud, crie uma conta de serviço para seu agente
2. Conceda permissões adequadas para essa conta
3. Gere e baixe uma chave JSON para autenticação
4. Use essa chave em seu código de integração:
   ```javascript
   const dialogflow = require('dialogflow');
   const sessionClient = new dialogflow.SessionsClient({
     keyFilename: 'path/to/your-key.json'
   });
   ```

### 9. Monitoramento e Análise

1. No console do Dialogflow, clique em "Histórico" para ver as conversas recentes
2. Use o "Treinamento" para melhorar o modelo com base em interações reais
3. Integre com o Google Analytics para obter métricas detalhadas:
   - No menu lateral, clique em "Integrations"
   - Ative "Google Analytics"
   - Configure seu ID de rastreamento

## Estrutura do Webhook

Para implementar o servidor webhook, você precisará de uma estrutura como:

```
webhook/
├── server.js            # Servidor Express principal
├── intents/             # Manipuladores de intent
│   ├── packageHandler.js
│   ├── sampleHandler.js
│   └── ...
├── utils/               # Utilitários
│   ├── responseBuilder.js
│   └── databaseClient.js
└── package.json         # Dependências
```

Veja mais detalhes na documentação específica do webhook.

## Recursos Avançados

### Rich Responses

O Dialogflow permite respostas ricas para interfaces visuais. Para implementar:

1. Em Fulfillment, retorne objetos com propriedades específicas:
   ```javascript
   return {
     fulfillmentMessages: [
       {
         card: {
           title: 'Pacote Premium',
           subtitle: 'Nossa opção mais completa',
           imageUri: 'https://example.com/image.jpg',
           buttons: [
             {
               text: 'Saiba mais',
               postback: 'https://seu-site.com/pacotes/premium'
             }
           ]
         }
       }
     ]
   };
   ```

### Contexts

Para criar conversas com múltiplos turnos:

1. Em uma intent, defina um output context (p.ex. "criando-musica")
2. Crie outra intent que utilize esse context como input
3. Isso permite que o chatbot mantenha o contexto da conversa

## Troubleshooting

### Problemas Comuns

1. **Intent não reconhecida**:
   - Adicione mais frases de treinamento variadas
   - Verifique se há conflitos entre intents semelhantes

2. **Webhook não funcionando**:
   - Verifique se a URL está correta e acessível
   - Examine os logs do servidor para erros
   - Teste o endpoint webhook diretamente com Postman

3. **Entidades não detectadas**:
   - Adicione mais exemplos nas frases de treinamento
   - Considere usar entidades do sistema para tipos comuns

Para mais informações detalhadas, consulte a [documentação oficial do Dialogflow](https://cloud.google.com/dialogflow/docs).
