import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      rollupTypes: false, // Set to false to keep all declaration files
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'), // Use your tsconfig
      include: [resolve(__dirname, 'src/**/*')]
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'), 
      name: 'ReactLoginComponent',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true, 
        preserveModulesRoot: 'src', 
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  }
});