
# Análise do Projeto - harmonIA

## Visão Geral do Projeto

Este documento fornece uma análise detalhada do código-fonte atual do projeto harmonIA, uma plataforma para criação e gerenciamento de músicas personalizadas.

## Estrutura do Projeto

### Principais Componentes

O projeto está organizado em vários módulos principais:

1. **Sistema de Preview de Músicas**
   - Arquivos principais: `src/hooks/use-preview-data.ts`, `src/components/previews/access/useProjectAccess.tsx`
   - Funcionalidade: Permite que os clientes visualizem e forneçam feedback sobre versões de músicas antes da finalização

2. **Sistema de Pagamento**
   - Descrição: Gerencia pagamentos, emissão de notas fiscais e acompanhamento de pedidos
   - Documentação: `src/PAYMENT_README.md`

3. **Painel Administrativo**
   - Componentes principais: `src/components/admin/*`
   - Funcionalidade: Interface para gerenciamento de projetos, clientes e recursos

4. **Portfólio e Mostras de Áudio**
   - Componentes: `src/components/portfolio/*`, `src/components/audio-database/*`
   - Funcionalidade: Exibe exemplos de trabalhos anteriores

5. **Autenticação e Controle de Acesso**
   - Arquivos principais: `src/hooks/admin/useAuthentication.ts`, `src/components/previews/access/useProjectAccess.tsx`

### Problemas Recentes Identificados

1. **Problemas de TypeScript**:
   - Conflitos de tipagem em `useProjectAccess.ts`
   - Importações incorretas (`getCookie` vs `getCookieValue`)

2. **Sistema de Prévia**:
   - Erros 400/422 em requisições de autenticação
   - Problemas com acesso baseado em cookies

3. **Integração com Supabase**:
   - Políticas RLS não aplicadas corretamente
   - Problemas com autenticação anônima

4. **Interfaces e Tipos**:
   - Inconsistências entre interfaces (ex: `createdAt` vs `created_at`)

5. **Funcionalidades Parcialmente Implementadas**:
   - Integração com Google Drive incompleta
   - Sistema de estatísticas usando dados estáticos

## Estado Atual da Integração com Backend

O projeto utiliza Supabase como backend e apresenta os seguintes problemas de integração:

- Autenticação anônima não funcional em algumas partes
- Problemas com políticas RLS
- Erros em requisições de API

## Recomendações em Andamento

1. Refatoração dos arquivos mais longos (usePreviewData.ts e useProjectAccess.ts)
2. Correção de inconsistências de nomenclatura (snake_case vs camelCase)
3. Implementação adequada de cookies no lugar de localStorage
4. Melhorias no sistema de log para facilitar diagnósticos

## Próximos Passos Sugeridos

1. Resolver problemas de TypeScript pendentes
2. Revisar e corrigir todas as consultas ao Supabase
3. Implementar corretamente a autenticação anônima
4. Refatorar componentes e hooks longos em arquivos menores e mais focados

