import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        commonjsOptions: {
            include: [/orma/, /node_modules/]
        }
    },
    optimizeDeps: {
        include: ['orma', 'orma/build/helpers/schema_helpers', 'orma/build/query/macros/select_macro']
    }
})
