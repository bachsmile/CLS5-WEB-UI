import '@/@iconify/icons-bundle'
import { createApp } from 'vue'
import VueFeather from 'vue-feather'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import Toast from 'vue-toastification'

import i18n from '@/plugins/i18n'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import lodash from '@/plugins/lodash'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { globals } from '@/typescript/global/property'
import { globalsReadOnly } from '@/typescript/global/property.read'
import windowDefineProperty from '@/typescript/global/public/propertyGlobal.public'
import 'vue3-easy-data-table/dist/style.css'
import { configStore } from '@/stores/index'

// Import the CSS or use your own!
import '@/styles/styles.scss'
import '@core/scss/template/index.scss'

// import { createPinia } from 'pinia'

const pinia = createPinia()

loadFonts()

// Create vue app
const app = createApp(App)

const options = {
  // You can set your default options here
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 4,

  // draggable: true,
  // draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
  containerClassName: 'v-theme--light',
  filterBeforeCreate: (toast: any, toasts: any) => {
    if (toasts.filter((item: any) => item.type === toast.type).length !== 0) {
      // Returning false discards the toast
      return false
    }

    // You can modify the toast if you want
    return toast
  },
}
app.use(pinia)
app.provide('globals', globals)
app.provide('globalsReadOnly', globalsReadOnly)
app.component(VueFeather.name, VueFeather)

windowDefineProperty(app)

// Use plugins
app.use(vuetify)
app.use(Toast, options)
app.use(lodash)
app.use(i18n)
app.use(layoutsPlugin)

app.component('EasyDataTable', Vue3EasyDataTable)

app.use(router)
const configControl = configStore()
const { getDefaultSetting } = configControl

getDefaultSetting()

// Mount vue app
app.mount('#app')
