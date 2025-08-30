import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// PrimeVue configuration
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  ripple: true,
})

// PrimeVue services (these still need to be manually registered)
app.use(ToastService)
app.use(ConfirmationService)

app.use(createPinia())
app.use(router)
app.mount('#app')
