import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import hotReloadExtension from 'hot-reload-extension-vite';

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
  }
});