import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import hotReloadExtension from 'hot-reload-extension-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import {resolve,join} from "path"

export default defineConfig({
  plugins: [
    react(),
    hotReloadExtension({
      log: true,
      backgroundPath: 'scripts/background.js'
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    copyPublicDir:false,
    emptyOutDir: true,
    outDir: join(__dirname, "build"),
    rollupOptions: {
      input: {
        admin_page: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/chrome/background.js')
      },
      output :{
        entryFileNames: 'scripts/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames : "scripts/[name].js"
      }
    }
  }
});