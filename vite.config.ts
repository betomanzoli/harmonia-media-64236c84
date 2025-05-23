import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // ✅ CONFIGURAÇÃO BASEADA NO AMBIENTE
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false // ✅ Evitar overlay de erro que pode quebrar o build
      }
    },
    
    plugins: [
      react(),
      // ✅ USAR componentTagger apenas em desenvolvimento
      isDev && componentTagger(),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // ✅ CONFIGURAÇÕES ESPECÍFICAS PARA BUILD
    build: {
      outDir: 'dist',
      sourcemap: false, // ✅ Desabilitar sourcemap para reduzir tamanho
      minify: 'esbuild',
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            // ✅ SEPARAR CHUNKS PARA OTIMIZAÇÃO
            vendor: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-checkbox']
          },
          // ✅ NAMING PATTERN PARA CHUNKS
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      // ✅ CONFIGURAÇÕES DE PERFORMANCE
      chunkSizeWarningLimit: 1000,
    },
    
    // ✅ OTIMIZAÇÕES DO ESBUILD
    esbuild: {
      logOverride: { 
        'this-is-undefined-in-esm': 'silent',
        'ignored-bare-import': 'silent'
      },
      // ✅ REMOVER CONSOLE.LOG EM PRODUÇÃO
      drop: isProd ? ['console', 'debugger'] : [],
    },
    
    // ✅ CONFIGURAÇÕES DE ENVIRONMENT VARIABLES
    define: {
      // ✅ Garantir que variáveis estejam disponíveis
      __DEV__: isDev,
      __PROD__: isProd,
    },
    
    // ✅ OTIMIZAÇÕES DE DEPENDÊNCIAS
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'lucide-react'
      ],
      // ✅ EXCLUIR DEPENDÊNCIAS PROBLEMÁTICAS
      exclude: ['lovable-tagger']
    },
    
    // ✅ CONFIGURAÇÃO CSS
    css: {
      postcss: {
        plugins: []
      }
    }
  };
});
