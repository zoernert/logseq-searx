import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LSPlugin',
      formats: ['iife'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['@logseq/libs'],
      output: {
        globals: {
          '@logseq/libs': 'LogseqApi'
        }
      }
    },
    // Ensure files are built to correct location
    outDir: 'dist',
    emptyOutDir: true
  }
})