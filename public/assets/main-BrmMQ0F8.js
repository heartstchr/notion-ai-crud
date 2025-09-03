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
    button: {
      root: {
        class: [
          'px-4 py-2 rounded-lg font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:scale-105 hover:-translate-y-0.5',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
        ],
      },
      label: {
        class: 'font-medium',
      },
      icon: {
        class: 'mr-2',
      },
      // Primary button (default)
      primary: {
        root: {
          class: [
            'bg-blue-600 hover:bg-blue-700 text-white',
            'focus:ring-blue-500',
            'hover:shadow-[0_20px_40px_rgba(37,99,235,0.3),0_0_20px_rgba(37,99,235,0.2)]',
          ],
        },
      },
      // Secondary button
      secondary: {
        root: {
          class: [
            'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-800',
            'border border-gray-300 focus:ring-gray-500',
            'hover:shadow-[0_20px_40px_rgba(107,114,128,0.3),0_0_20px_rgba(107,114,128,0.2)]',
          ],
        },
      },
      // Success button
      success: {
        root: {
          class: [
            'bg-green-600 hover:bg-green-700 text-white',
            'focus:ring-green-500',
            'hover:shadow-[0_20px_40px_rgba(34,197,94,0.3),0_0_20px_rgba(34,197,94,0.2)]',
          ],
        },
      },
      // Info button
      info: {
        root: {
          class: [
            'bg-cyan-600 hover:bg-cyan-700 text-white',
            'focus:ring-cyan-500',
            'hover:shadow-[0_20px_40px_rgba(6,182,212,0.3),0_0_20px_rgba(6,182,212,0.2)]',
          ],
        },
      },
      // Warning button
      warning: {
        root: {
          class: [
            'bg-amber-600 hover:bg-amber-700 text-white',
            'focus:ring-amber-500',
            'hover:shadow-[0_20px_40px_rgba(217,119,6,0.3),0_0_20px_rgba(217,119,6,0.2)]',
          ],
        },
      },
      // Danger button
      danger: {
        root: {
          class: [
            'bg-red-600 hover:bg-red-700 text-white',
            'focus:ring-red-500',
            'hover:shadow-[0_20px_40px_rgba(239,68,68,0.3),0_0_20px_rgba(239,68,68,0.2)]',
          ],
        },
      },
      // Text button (for icon-only buttons)
      text: {
        root: {
          class: [
            'p-0 w-10 h-10 min-w-0 min-h-0 bg-transparent border-0',
            'text-gray-700 hover:text-gray-900',
            'focus:ring-gray-500',
            'flex items-center justify-center',
          ],
        },
        label: {
          class: 'text-gray-700',
        },
        icon: {
          class: 'text-gray-700',
        },
      },
      // Small size
      small: {
        root: {
          class: 'px-3 py-1.5 text-sm flex items-center justify-center',
        },
      },
      // Large size
      large: {
        root: {
          class: 'px-6 py-3 text-lg flex items-center justify-center',
        },
      },
      // Outline variants
      outline: {
        root: {
          class: 'bg-transparent border-2',
        },
      },
      // Link variant
      link: {
        root: {
          class: 'bg-transparent border-0 underline hover:no-underline',
        },
      },
      // Rounded variant
      rounded: {
        root: {
          class: 'rounded-full',
        },
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
