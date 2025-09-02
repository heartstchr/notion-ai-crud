import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import App from './App.vue'
import router from './router'

// Create Vue 3 app with composition API
const app = createApp(App)

// Use plugins with Vue 3 syntax
app.use(createPinia())
app.use(router)

// Configure PrimeVue with Vue 3
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  ripple: true,
})

// Register PrimeVue services
app.use(ToastService)
app.use(ConfirmationService)

// Mount the app
app.mount('#app')
