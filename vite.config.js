import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import hotReloadExtension from 'hot-reload-extension-vite';
import {resolve,join} from "path"

export default defineConfig({
  plugins: [
    react(),
    hotReloadExtension({
      log: true,
      backgroundPath: 'path/to/background' // src/pages/background/index.ts
    })
  ],
  build: {
    emptyOutDir: false,
    outDir: join(__dirname, "build"),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'popup.html')
      }
    }
  }
});