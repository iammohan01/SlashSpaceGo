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
    copyPublicDir:true,
    emptyOutDir: true,
    outDir: join(__dirname, "build"),
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'public/scripts/background.js')
      },
      output :{
        entryFileNames: 'scripts/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames : "scripts/[name].js",
      }
    }
  }
});