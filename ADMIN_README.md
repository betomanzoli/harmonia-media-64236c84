
# Guia de Administração - harmonIA

Este documento explica como usar as páginas de administração da harmonIA.

## Páginas Administrativas

O sistema possui duas páginas administrativas principais:

1. **Gerenciamento de Áudio**: `/admin-j28s7d1k/audio-database`
2. **Gerenciamento de Portfólio**: `/admin-j28s7d1k/portfolio`

⚠️ **Nota de Segurança**: O ID na URL (`j28s7d1k`) é uma proteção básica. Para maior segurança, implemente um sistema de autenticação para estas páginas em produção.

## 1. Gerenciamento de Áudio

Esta página permite:

- Visualizar todos os arquivos de áudio cadastrados
- Adicionar novos arquivos de áudio ao sistema
- Editar informações de arquivos existentes
- Excluir arquivos

### Como adicionar um novo arquivo de áudio:

1. Clique no botão "Adicionar Novo Áudio"
2. Preencha os metadados (título, descrição, gênero, etc.)
3. Faça upload do arquivo de áudio
4. Selecione o tipo de áudio (exemplo, comparação ou stem)
5. Clique em "Salvar"

### Estrutura de arquivos de áudio:

Os arquivos são organizados conforme descrito no [AUDIO_README.md](AUDIO_README.md).

## 2. Gerenciamento de Portfólio

Esta página permite:

- Visualizar itens do portfólio
- Adicionar novos projetos ao portfólio
- Editar projetos existentes
- Excluir projetos

### Como adicionar um novo projeto ao portfólio:

1. Clique no botão "Adicionar Novo Projeto"
2. Preencha os detalhes do projeto (título, cliente, descrição, data)
3. Faça upload de imagens relacionadas ao projeto (se aplicável)
4. Selecione os arquivos de áudio associados a este projeto
5. Clique em "Salvar"

## Integração com Serviços Externos

As páginas administrativas oferecem configuração de integração com:

- **Armazenamento S3**: Para hospedar arquivos de áudio grandes
- **Firestore/MongoDB**: Para armazenar metadados 

### Configuração da integração com armazenamento:

1. Na página administrativa, clique em "Configurar Integrações"
2. Adicione as credenciais de API necessárias
3. Teste a conexão
4. Salve as configurações

## Boas Práticas

1. **Nomeie adequadamente os arquivos**: Use nomes descritivos e padronizados
2. **Otimize os arquivos de áudio**: Use formato MP3 com compressão adequada (128-320kbps)
3. **Organize por categorias**: Mantenha uma estrutura consistente
4. **Faça backup regularmente**: Exporte os dados periodicamente

## Solução de Problemas

Se encontrar problemas com o gerenciamento de arquivos:

1. Verifique as permissões de acesso ao armazenamento
2. Confirme que o formato de arquivo é suportado
3. Verifique o console do navegador para mensagens de erro
4. Tente limpar o cache do navegador
