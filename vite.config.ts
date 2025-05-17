// vite.config.ts
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteSingleFile} from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteSingleFile(),
    ],
    assetsInclude: ['**/*.svg'],
    build: {
        target: "es2018",
        minify: false,
        sourcemap: true,
        rollupOptions: {
            external: [
                '@rizean/poe-canvas-utils',
                'marked',
                'react',
                'react-dom',
                'react-icons',
                'react-icons/fa',
                'styled-components', // doesn't work when externalized
                'uuid',
                'react-dom/client'
            ],
            output: {
                // Define the global variables corresponding to the external imports
                globals: {
                    'react': 'React', // 'import React from "react"' will use the global 'React'
                    'react-dom': 'ReactDOM', // 'import ReactDOM from "react-dom"' will use the global 'ReactDOM'
                }
            }
        },

        // if you use dynamic imports with variables, Vite/Rollup will
        // have to include more code by default—you can still exclude some:
        dynamicImportVarsOptions: {
            exclude: [],
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
        ],
    },
})
