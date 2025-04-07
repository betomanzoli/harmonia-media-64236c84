
# Sistema de Prévias Musicais - harmonIA

Este documento explica como gerenciar o sistema de prévias musicais da harmonIA.

## Visão Geral

O sistema de prévias musicais permite:

1. Criar projetos de prévias para os clientes
2. Fazer upload de múltiplas versões musicais
3. Compartilhar links de avaliação com os clientes
4. Receber feedback e aprovações
5. Monitorar o status dos projetos

## Acessando o Painel de Prévias

O painel administrativo para gerenciar prévias está disponível em:

```
/admin-j28s7d1k/previews
```

## Criando um Novo Projeto de Prévias

1. Navegue até o painel de prévias
2. Role até o fim da página ou clique no botão "Novo Projeto" no topo
3. Preencha as informações do cliente:
   - Nome do cliente
   - Email do cliente (para notificações)
   - Pacote contratado
   - Prazo para avaliação (3, 7, 10 ou 15 dias)
4. Adicione as versões musicais:
   - Clique em "Adicionar Versão" para cada nova versão
   - Preencha título e descrição para cada versão
   - Faça upload do arquivo de áudio
5. Clique em "Criar Projeto e Notificar Cliente"

## Monitorando Projetos

A tabela de projetos mostra:

- ID do projeto
- Informações do cliente
- Status atual (Aguardando Avaliação, Feedback Recebido, Música Aprovada)
- Número de versões
- Data de criação e expiração

## Ações Disponíveis

Para cada projeto, você pode:

- Ver as prévias (abre a página de prévias do cliente)
- Reenviar email de lembrete para o cliente

## Fluxo de Trabalho do Cliente

1. O cliente recebe um email com link para a página de prévias
2. O cliente ouve as diferentes versões e seleciona uma
3. O cliente pode:
   - Aprovar diretamente a versão selecionada
   - Enviar feedback para solicitar ajustes
4. O cliente recebe uma confirmação após enviar feedback ou aprovar

## Recebendo Feedback

Quando um cliente envia feedback:

1. O status do projeto muda para "Feedback Recebido"
2. A equipe pode ver os comentários no painel administrativo
3. Após fazer ajustes, novas versões podem ser enviadas

## Após a Aprovação

Quando um cliente aprova uma versão:

1. O status do projeto muda para "Música Aprovada"
2. A equipe é notificada para finalizar a produção
3. O projeto avança para a fase de entrega final

## Proteção do Conteúdo

Para proteger o conteúdo musical durante a fase de avaliação:

1. Arquivos de áudio são apresentados em formato de prévia limitada (30 segundos)
2. Downloads diretos são bloqueados durante a fase de avaliação
3. A página contém proteção contra botão direito do mouse e outras medidas anti-cópia
4. O cliente só recebe a versão completa após aprovação final

## Boas Práticas

1. **Qualidade das prévias**: Envie versões em qualidade média (128kbps) para proteção do conteúdo
2. **Descrições claras**: Forneça descrições detalhadas para cada versão
3. **Prazo adequado**: Configure um prazo razoável para avaliação (7 dias é o recomendado)
4. **Acompanhamento**: Monitore projetos próximos da expiração e envie lembretes

## Solução de Problemas

- **Cliente não recebeu o email**: Verifique na tabela de projetos e clique no botão de reenvio
- **Link expirado**: Estenda o prazo criando um novo projeto ou atualizando a data de expiração
- **Problemas com arquivos**: Verifique se o formato é compatível (MP3 recomendado) e não ultrapassa 20MB
- **Cliente não consegue ouvir as prévias**: Verifique se o cliente está usando um navegador compatível e tem conexão estável
