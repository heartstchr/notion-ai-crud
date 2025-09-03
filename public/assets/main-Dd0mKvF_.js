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

// Configure PrimeVue with light theme
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none', // Disable dark mode
      cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    },
  },
  ripple: true,
  unstyled: false, // Use styled components
  pt: {
    // PassThrough configuration for consistent light theme
    inputtext: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
    },
    dropdown: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
      panel: {
        class: 'bg-gray-100 border-gray-300',
      },
      item: {
        class: 'bg-white text-black hover:bg-gray-200',
      },
    },
    multiselect: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
      panel: {
        class: 'bg-gray-100 border-gray-300',
      },
      item: {
        class: 'px-3 py-2',
      },
      itemLabel: {
        class: 'text-black',
      },
      token: {
        class: 'rounded-full px-3 py-1 text-sm flex items-center gap-2',
      },
      tokenLabel: {
        class: 'font-medium',
      },
      tokenIcon: {
        class: 'cursor-pointer hover:text-red-600',
      },
      // Color-specific token styling
      tokenGreen: {
        class: 'bg-green-100 text-green-800 border-green-200',
      },
      tokenPurple: {
        class: 'bg-purple-100 text-purple-800 border-purple-200',
      },
      tokenBrown: {
        class: 'bg-amber-100 text-amber-800 border-amber-200',
      },
      tokenOrange: {
        class: 'bg-orange-100 text-orange-800 border-orange-200',
      },
      tokenYellow: {
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      tokenDefault: {
        class: 'bg-gray-100 text-gray-800 border-gray-200',
      },
      tokenGray: {
        class: 'bg-gray-100 text-gray-800 border-gray-200',
      },
      tokenPink: {
        class: 'bg-pink-100 text-pink-800 border-pink-200',
      },
      tokenRed: {
        class: 'bg-red-100 text-red-800 border-red-200',
      },
      tokenBlue: {
        class: 'bg-blue-100 text-blue-800 border-blue-200',
      },
    },
    calendar: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
      panel: {
        class: 'bg-gray-100 border-gray-300',
      },
      header: {
        class: 'bg-gray-200',
      },
      table: {
        class: 'text-black',
      },
      tableHeaderCell: {
        class: 'text-black',
      },
      tableBodyCell: {
        class: 'text-black hover:bg-gray-200',
      },
    },
    inputnumber: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
    },
    textarea: {
      root: {
        class:
          'bg-gray-100 text-black border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      },
    },

    checkbox: {
      root: {
        class: 'bg-gray-100 border-gray-300 text-blue-600 focus:ring-blue-500',
      },
    },
    // Additional components for complete theming
    inputgroup: {
      root: {
        class: 'bg-gray-100 text-black border-gray-300',
      },
    },
    inputgroupaddon: {
      root: {
        class: 'bg-gray-200 text-black border-gray-300',
      },
    },
    // Toast styling
    toast: {
      root: {
        class: 'bg-white border-gray-300 shadow-lg',
      },
      message: {
        class: 'text-black',
      },
    },
    // Dialog styling
    dialog: {
      root: {
        class: 'bg-white border-gray-300',
      },
      header: {
        class: 'bg-gray-50 border-gray-200',
      },
      content: {
        class: 'text-black',
      },
    },
  },
})

// Register PrimeVue services
app.use(ToastService)
app.use(ConfirmationService)

// Mount the app
app.mount('#app')
