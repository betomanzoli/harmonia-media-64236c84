
# Resolução de Problemas Comuns

Este guia aborda os problemas mais comuns que podem ocorrer com o chatbot harmonIA e como solucioná-los.

## Problemas com o Widget

### O chatbot não aparece no site

**Possíveis causas e soluções:**

1. **Script não está sendo carregado**
   - Verifique se o arquivo `chatbot.js` está sendo carregado corretamente (use o Console do navegador)
   - Verifique o caminho do arquivo no tag `<script>`
   - Solução: Corrija o caminho ou recarregue o arquivo

2. **Erro de JavaScript**
   - Abra o Console do navegador para verificar erros
   - Solução: Corrija os erros específicos reportados

3. **Conflito de CSS**
   - Elementos com z-index maior podem estar sobrepondo o chatbot
   - Solução: Aumente o z-index do container do chatbot:
     ```css
     .harmonia-chatbot-container {
       z-index: 9999;
     }
     ```

4. **Função init() não está sendo chamada**
   - Verifique se o evento DOMContentLoaded está disparando o init
   - Solução: Modifique o código de inicialização:
     ```javascript
     window.addEventListener('load', function() {
       window.harmonIAChatbot.init({
         // configurações
       });
     });
     ```

### Problemas de estilo no widget

**Possíveis causas e soluções:**

1. **CSS do site interferindo com o chatbot**
   - Verifique no inspetor do navegador quais estilos estão sendo sobrepostos
   - Solução: Adicione `!important` aos estilos críticos do chatbot

2. **Incompatibilidade com navegadores antigos**
   - Teste em diferentes navegadores para identificar o problema
   - Solução: Adicione polyfills ou ajuste o CSS para maior compatibilidade

### Widget não é responsivo

**Soluções:**

1. Verifique as consultas de mídia (media queries) no CSS
2. Adicione regras adicionais para tamanhos de tela específicos:
   ```css
   @media (max-width: 480px) {
     .harmonia-chat-window {
       width: 90vw;
       height: 70vh;
       bottom: 70px;
     }
   }
   ```

## Problemas com o Webhook

### Webhook não recebe requisições

**Possíveis causas e soluções:**

1. **URL incorreta no Dialogflow**
   - Verifique se a URL configurada no Dialogflow está correta
   - Solução: Atualize a URL no console do Dialogflow

2. **Problema de CORS**
   - Verifique erros de CORS no console do servidor
   - Solução: Configure corretamente o middleware CORS:
     ```javascript
     app.use(cors({
       origin: '*',
       methods: ['POST', 'GET', 'OPTIONS'],
       allowedHeaders: ['Content-Type', 'Authorization']
     }));
     ```

3. **Servidor não está rodando**
   - Verifique logs do provedor de hospedagem
   - Solução: Reinicie o servidor ou verifique problemas de implantação

### Respostas incorretas ou erros 500

**Possíveis causas e soluções:**

1. **Formato de resposta inválido**
   - Verifique se o formato da resposta está de acordo com a API do Dialogflow
   - Solução: Corrija o formato de resposta conforme a documentação

2. **Erros no processamento**
   - Adicione mais logs para identificar onde o erro ocorre
   - Solução: Implemente tratamento de erro robusto:
     ```javascript
     try {
       // código de processamento
     } catch (error) {
       console.error('Erro ao processar intent:', error);
       return {
         fulfillmentText: 'Desculpe, ocorreu um erro ao processar sua solicitação.'
       };
     }
     ```

3. **Timeouts**
   - A resposta pode estar demorando muito
   - Solução: Otimize o processamento ou aumente o timeout no Dialogflow

## Problemas com o Dialogflow

### Intents não reconhecidas corretamente

**Possíveis causas e soluções:**

1. **Poucas frases de treinamento**
   - Adicione mais exemplos variados de frases para cada intent
   - Solução: Mínimo de 10-15 frases de treinamento por intent

2. **Frases muito similares entre intents diferentes**
   - Verifique se há sobreposição entre intents
   - Solução: Torne as intents mais distintas ou use entidades para diferenciar

3. **Problemas com o idioma**
   - Verifique se o idioma do agente está configurado corretamente
   - Solução: Ajuste o idioma e adicione frases específicas para o idioma alvo

### Respostas não aparecem no widget

**Possíveis causas e soluções:**

1. **Problemas de comunicação entre Dialogflow e webhook**
   - Verifique logs do webhook para confirmar recebimento da requisição
   - Solução: Implemente mais logs e ferramentas de depuração

2. **Resposta em formato incorreto**
   - Verifique se o widget está processando corretamente o formato da resposta
   - Solução: Ajuste o formato da resposta ou a lógica de processamento no widget

## Ferramentas de Diagnóstico

### Verificação do Widget

```javascript
// Adicione no Console do navegador para diagnosticar o widget
console.log('Widget inicializado:', window.harmonIAChatbot !== undefined);
console.log('Estado do widget:', window.harmonIAChatbot && window.harmonIAChatbot.getState ? window.harmonIAChatbot.getState() : 'Estado não disponível');
```

### Testes do Webhook

Crie um endpoint de diagnóstico:

```javascript
// Adicione no server.js
app.get('/webhook-test', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    dialogflow: {
      projectId: process.env.DIALOGFLOW_PROJECT_ID ? 'configurado' : 'não configurado'
    }
  });
});
```

## Recursos Adicionais

1. [Dialogflow Troubleshooting Guide](https://cloud.google.com/dialogflow/docs/troubleshooting)
2. [Express.js Debugging](https://expressjs.com/en/guide/debugging.html)
3. [Heroku Troubleshooting](https://devcenter.heroku.com/categories/troubleshooting)

Para problemas persistentes, considere:
- Criar um tópico no [Stack Overflow](https://stackoverflow.com/) com a tag 'dialogflow'
- Entrar em contato com o suporte do Google Cloud para problemas relacionados ao Dialogflow
- Consultar a comunidade do Discord ou fóruns relacionados a chatbots
