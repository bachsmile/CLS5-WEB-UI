import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { defineConfig, loadEnv } from 'vite'
import Layouts from 'vite-plugin-vue-layouts'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let host
  let httpsOptions
  if (mode === 'development') {
    host = env.VUE_APP_BASE_HOST
    httpsOptions = {
      key: fs.readFileSync(`./cert/${host}-key.pem`),
      cert: fs.readFileSync(`./cert/${host}.pem`),
    }
  }

  return {
    server: {
      host: mode === 'development' ? host : false,
      https: mode === 'development' ? httpsOptions : false,
    },
    define: {
      'process.env': {
        VUE_APP_BASE_API: env.VUE_APP_BASE_API,
        VUE_APP_BASE_V5_API: env.VUE_APP_BASE_V5_API,
        VUE_APP_BASE_SERVER_FILE: env.VUE_APP_BASE_SERVER_FILE,
        VUE_APP_BASE_SERVER_SIGNAL: env.VUE_APP_BASE_SERVER_SIGNAL,
      },
    },
    plugins: [
      vue(),
      vueJsx(),

      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        // styles: {
        //   configFile: 'src/styles/variables/_vuetify.scss',
        // },
      }),
      Layouts({
        // layoutsDirs: 'src/layouts',
        // defaultLayout: 'default',
      }),
      Components({
        dirs: ['src/@core/components', 'src/views/demos', 'src/typescript/global/private'],
        dts: true,
      }),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
        vueTemplate: true,
      }),

      DefineOptions(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.ts', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./src/styles/variables/_template.scss', import.meta.url)),
        '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),
        '@axiosV5': fileURLToPath(new URL('./src/plugins/axiosV5', import.meta.url)),
        '@validators': fileURLToPath(new URL('./src/@core/utils/validators', import.meta.url)),
        'apexcharts': fileURLToPath(new URL('node_modules/apexcharts-clevision', import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './src/**/*.vue',
      ],
    },
  }
})
