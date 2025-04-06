
# Configuração do Dialogflow (Google Cloud)

## Pré-requisitos

- Uma conta no Google Cloud Platform
- Projeto criado no GCP
- API do Dialogflow ES habilitada

## Passo a Passo para Configuração

1. Acesse o [Console do Dialogflow](https://dialogflow.cloud.google.com/)
2. Crie um novo agente chamado "harmonIA"
3. Configure o idioma principal como "Português (Brasil)"
4. Crie as seguintes intents:
   - Default Welcome Intent
   - Informações sobre Pacotes
   - Amostras de Músicas
   - Calcular Preço
   - Iniciar Briefing
   - Verificar Status
   - Falar com Atendente
   - Default Fallback Intent
5. Para cada intent, adicione frases de treinamento relevantes
6. Configure o webhook para todas as intents (exceto Fallback)

## Exemplos de Frases de Treinamento por Intent

### Intent: Informações sobre Pacotes
- Quais são os pacotes disponíveis?
- Quero conhecer os serviços
- Me fale sobre os preços
- Quais são as opções de pacotes?

### Intent: Amostras de Músicas
- Quero ouvir exemplos
- Tem alguma amostra?
- Posso escutar alguma música?
- Mostre exemplos do seu trabalho

### Intent: Calcular Preço
- Quanto custa uma música?
- Quero calcular o preço
- Como funciona o orçamento?
- Qual o valor para uma composição?

### Intent: Iniciar Briefing
- Quero criar uma música
- Como faço para começar?
- Desejo iniciar um projeto
- Como é o processo de criação?

### Intent: Verificar Status
- Como está meu pedido?
- Quero acompanhar meu projeto
- Status do meu pedido
- Quando fica pronto?

### Intent: Falar com Atendente
- Quero falar com uma pessoa
- Preciso de atendimento humano
- Transferir para atendente
- Contato com suporte

## Configuração de Respostas

Para cada intent, você pode configurar respostas padrão que serão usadas quando o webhook não estiver disponível ou como respostas de fallback:

1. Na seção "Fulfillment" de cada intent, ative "Enable webhook call for this intent"
2. Adicione também respostas de texto na seção "Responses" como backup

## Configuração do Webhook

1. No console do Dialogflow, vá para "Fulfillment"
2. Ative o webhook
3. Informe a URL do seu servidor webhook (exemplo: https://seu-webhook.herokuapp.com/dialogflow)
4. Defina o método como POST
5. Adicione cabeçalhos se necessário (Authorization, Content-Type, etc.)

## Conexão com o Google Cloud

Para o ambiente de produção, configure corretamente:

1. Autenticação do serviço
2. Controle de acesso
3. Monitoramento de cotas e limites

Para mais informações, consulte a [documentação oficial do Dialogflow](https://cloud.google.com/dialogflow/docs).
