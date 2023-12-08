import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {join, resolve} from "path"
import Checker from 'vite-plugin-checker';
import svgr from "vite-plugin-svgr";


export default defineConfig({
    plugins: [
        react(),
        Checker({typescript: true}),
        svgr({
            svgrOptions: {
                icon: true,
            },
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
        minify: false,
        chunkSizeWarningLimit: 500,
        copyPublicDir: false,
        emptyOutDir: true,
        outDir: join(__dirname, "build"),
        rollupOptions: {
            external: [
                'Shortcuts.json'
            ],
            input: {
                admin_page: resolve(__dirname, 'index.html'),
                popup: resolve(__dirname, 'popup.html'),
                background: resolve(__dirname, 'src/chrome/background.ts'),
                SlashSpaceGoHelper: resolve(__dirname, 'src/chrome/SlashSpaceGoHelper.ts')
            },
            output: {
                entryFileNames: 'scripts/[name].js',
                assetFileNames: 'assets/[name].[ext]',
                chunkFileNames: "scripts/[name].js"
            }
        }
    }
});