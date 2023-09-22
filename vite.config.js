import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import svgrPlugin from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';
import requireTransform from 'vite-plugin-require-transform';
import reactRefresh from '@vitejs/plugin-react-refresh'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'


const config = defineConfig(({ mode }) => {

  return {
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['react-snap'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
          esbuildCommonjs(['@react-editor-js'])
        ],
      },
    },
    plugins: [
      react(),
      reactRefresh(),
      requireTransform({}),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    server: {
      host: 'localhost',
      port: 5173,
    },
  };
});

export default config;