/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "./",                      // Ruta base relativa
  plugins: [react()],              // Plugin para soporte de React
  esbuild: {
    supported: {
      "top-level-await": true      // Soporte para await en el nivel superior
    },
  },
});
