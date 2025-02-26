import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'



// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'justCanvas',
      short_name: 'justCanvas',
      description: 'Make Canvassing Easy!',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 3000000
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
      
    },
    
  })],
  preview: {
    allowedHosts: true,
    https: {
      key: './src/keys/private-key.pem',
      cert: './src/keys/certificate.pem'
    }
  },
  server: {
    allowedHosts: true,
    https: {
      key: './src/keys/private-key.pem',
      cert: './src/keys/certificate.pem',
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true
  }
})