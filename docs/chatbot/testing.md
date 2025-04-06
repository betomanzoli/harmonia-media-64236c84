
# Testes e Validação

Este documento descreve as estratégias de teste e validação para o chatbot harmonIA.

## Testando o Webhook

### Usando Postman

1. Instale o [Postman](https://www.postman.com/downloads/)
2. Crie uma nova requisição POST para o endpoint do seu webhook
3. Configure o corpo da requisição como JSON com estrutura similar à enviada pelo Dialogflow:

```json
{
  "queryResult": {
    "intent": {
      "displayName": "Informações sobre Pacotes"
    },
    "parameters": {
      // parâmetros da intent, se houver
    }
  }
}
```

4. Envie a requisição e verifique a resposta
5. Repita o processo para cada intent

### Testes Automatizados

Para testes mais abrangentes, você pode configurar testes automatizados usando Jest:

1. Instale as dependências necessárias:
   ```
   npm install --save-dev jest supertest
   ```

2. Crie um arquivo de teste, por exemplo, `webhook.test.js`:

```javascript
const request = require('supertest');
const app = require('../server.js');

describe('Webhook API', () => {
  it('responde à intent de boas-vindas', async () => {
    const res = await request(app)
      .post('/dialogflow')
      .send({
        queryResult: {
          intent: {
            displayName: 'Default Welcome Intent'
          }
        }
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('fulfillmentText');
    // Mais asserções conforme necessário
  });
  
  // Mais testes para outras intents
});
```

3. Configure o script de teste no `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

4. Execute os testes:
```
npm test
```

## Testando o Widget

### Testes Manuais no Navegador

1. Abra o site onde o widget está integrado
2. Clique no botão do chatbot
3. Teste todas as interações principais:
   - Envio de mensagens
   - Cliques em quick replies
   - Abertura/fechamento do chatbot
   - Responsividade em diferentes tamanhos de tela

### Verificação em Diferentes Navegadores

Teste o widget nos principais navegadores:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

### Verificação em Dispositivos Móveis

Teste o widget em:
- iPhones (Safari)
- Dispositivos Android (Chrome)
- Tablets

### Testes de Acessibilidade

Certifique-se de que o chatbot é acessível:
1. Navegação por teclado deve funcionar
2. Textos devem ter contraste adequado
3. Todos os elementos interativos devem ter descrições adequadas

## Testes de Integração

Para testar todo o fluxo desde o widget até o webhook:

1. Configure um ambiente de teste completo
2. Simule interações de usuários reais
3. Verifique se as respostas estão corretas e chegam ao usuário
4. Teste a integração com sistemas externos (CRM, etc.)

## Validação de Performance

### Tempo de Resposta

1. Meça o tempo entre o envio da mensagem e o recebimento da resposta
2. Estabeleça benchmarks de performance (ex: 90% das respostas em menos de 2 segundos)
3. Monitore desvios significativos

### Carga do Servidor

1. Realize testes de carga simulando múltiplos usuários simultâneos
2. Use ferramentas como [Artillery](https://artillery.io/) ou [JMeter](https://jmeter.apache.org/)
3. Identifique gargalos de performance

## Validação de Qualidade de Respostas

### Precisão das Intents

1. Crie um conjunto de frases de teste para cada intent
2. Verifique se o Dialogflow identifica corretamente as intents
3. Calcule a taxa de acerto e faça ajustes conforme necessário

### Satisfação do Usuário

1. Implemente um mecanismo de feedback no chatbot
2. Colete métricas como:
   - Taxa de finalização de conversas
   - Pontuação de satisfação
   - Taxa de transferência para atendentes humanos
3. Analise regularmente essas métricas para identificar áreas de melhoria
