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
import DatabaseMenu from './components/DatabaseMenu.vue'

// Create Vue 3 app with composition API
const app = createApp(App)

// Use plugins with Vue 3 syntax
app.use(createPinia())
app.use(router)

// Configure PrimeVue with minimal theme setup
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none', // Disable dark mode
      cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    },
  },
  ripple: true,
  unstyled: false,
})

// Register PrimeVue services
app.use(ToastService)
app.use(ConfirmationService)

// Global components
app.component('DatabaseMenu', DatabaseMenu)

// Mount the app
app.mount('#app')
