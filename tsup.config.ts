import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Gera CommonJS (.cjs) e ESM (.mjs)
  outExtension: ({ format }) =>
    format === 'cjs' ? { js: '.cjs' } : { js: '.mjs' }, // Extensões personalizadas
  dts: true, // Gera tipos TypeScript
  clean: true, // Limpa a pasta dist antes de compilar
});
