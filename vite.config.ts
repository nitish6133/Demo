// vite.config.ts
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        outDir: 'dist',
        rollupTypes: false,
        tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
        include: [resolve(__dirname, 'src/**/*')],
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // backend URL from .env
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ReactLoginComponent',
        formats: ['es', 'cjs'],
        fileName: (format) =>
          `index.${format === 'es' ? 'js' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
    },
  }
})
