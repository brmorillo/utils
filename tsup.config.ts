import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts', // Arquivo principal da sua biblioteca
    // Adicione outras entradas, como módulos ou localizações
  ],
  outDir: 'dist', // Diretório de saída
  clean: true, // Limpa o diretório de saída antes de cada build
  format: ['esm', 'cjs'], // Gera formatos ESM e CommonJS
  target: ['es2022', 'node18'], // Define a versão alvo
  dts: true, // Gera declarações de tipos (.d.ts)
  minify: true, // Minifica o código
  sourcemap: true, // Gera sourcemaps
  splitting: true, // Habilita code splitting
});
