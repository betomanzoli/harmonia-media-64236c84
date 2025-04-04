
# Estrutura de Arquivos de Áudio - harmonIA

Este documento explica como estruturar e adicionar arquivos de áudio ao projeto harmonIA.

## Organização dos Arquivos

Os arquivos de áudio devem ser organizados na seguinte estrutura:

```
public/
└── audio/
    ├── exemplos/             # Exemplos completos de músicas
    │   ├── exemplo1.mp3
    │   ├── exemplo2.mp3
    │   └── ...
    ├── comparacoes/          # Comparações entre versões
    │   ├── nao-masterizado/
    │   │   └── exemplo1.mp3
    │   ├── masterizado/
    │   │   └── exemplo1.mp3
    │   ├── pacote-essencial/
    │   │   └── exemplo1.mp3
    │   └── ...
    └── stems/                # Stems separados de instrumentos
        ├── completo/
        │   └── exemplo1.mp3
        ├── vocal/
        │   └── exemplo1.mp3
        ├── guitarra/
        │   └── exemplo1.mp3
        └── ...
```

## Como Adicionar Novos Arquivos de Áudio

1. Certifique-se de que os arquivos estão no formato MP3, com compressão adequada para web (128-320kbps)
2. Nomeie os arquivos de forma descritiva e sem espaços (use hífen ou underscore)
3. Adicione os arquivos na pasta correspondente dentro de `public/audio/`
4. Atualize os dados no arquivo `src/components/portfolio/audioData.ts`

## Atualização do audioData.ts

Após adicionar novos arquivos de áudio, você precisa atualizar o arquivo `src/components/portfolio/audioData.ts` para incluir as referências a esses arquivos.

### Exemplo:

```typescript
export const initialExamples: AudioExampleItem[] = [
  {
    title: "Canção do Amor Familiar",
    subtitle: "Pacote Essencial - Aniversário",
    audioSrc: "/audio/exemplos/amor-familiar.mp3", // Caminho do arquivo
    genre: "Pop/Acústico",
    type: "completa"
  },
  // Adicione mais exemplos aqui
];
```

### Para arquivos de comparação:

```typescript
export const comparisonExamples: ComparisonExample[] = [
  {
    title: "Comparação: Masterizado vs. Não Masterizado",
    subtitle: "Veja a diferença na qualidade sonora",
    versions: [
      {
        name: "Versão Não Masterizada",
        audioSrc: "/audio/comparacoes/nao-masterizado/exemplo1.mp3",
        description: "Mix básico sem ajustes finais"
      },
      {
        name: "Versão Masterizada",
        audioSrc: "/audio/comparacoes/masterizado/exemplo1.mp3",
        description: "Qualidade profissional com masterização"
      }
    ],
    type: "comparison"
  },
  // Adicione mais comparações aqui
];
```

## Considerações Técnicas

- **Tamanho dos arquivos**: Mantenha os arquivos de áudio com tamanho razoável para não prejudicar o carregamento da página.
- **Formatos suportados**: O player de áudio suporta MP3, WAV e OGG, mas recomendamos MP3 para melhor compatibilidade.
- **Exemplos vazios**: Se não tiver exemplos reais, mantenha os exemplos fictícios até que tenha conteúdo real para substituí-los.

## Página de Admin

Para gerenciar os arquivos de áudio através da interface de administração, acesse `/admin-j28s7d1k/audio-database` e `/admin-j28s7d1k/portfolio`.
