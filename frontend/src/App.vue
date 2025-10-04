<script setup>
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
import logo from './assets/logo-crud.png'
import { onMounted, onUnmounted } from 'vue'

// Scroll event handling for auto-hide scrollbar
let scrollTimeout = null

const handleScroll = () => {
  // Add scrolling class to body
  document.body.classList.add('scrolling')
  
  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // Set timeout to remove scrolling class after scroll stops
  scrollTimeout = setTimeout(() => {
    document.body.classList.remove('scrolling')
  }, 150) // Hide scrollbar 150ms after scroll stops
}

onMounted(() => {
  // Add scrollbar-auto-hide class to body
  document.body.classList.add('scrollbar-auto-hide')
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener('scroll', handleScroll)
  
  // Clear timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // Remove classes
  document.body.classList.remove('scrollbar-auto-hide', 'scrolling')
})
</script>


<template>
  <div id="app" class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white border-b border-gray-200 relative sticky top-0 z-50">
      <!-- Gradient Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 opacity-10 shadow-lg"
        style="filter: drop-shadow(0 4px 6px rgba(0, 144, 247, 0.1)) drop-shadow(0 2px 4px rgba(186, 98, 252, 0.1)) drop-shadow(0 1px 2px rgba(242, 65, 107, 0.1));">
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-3">
            <img :src="logo" alt="Logo" class="h-16 w-16 object-contain" />
            <span
              class="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              CRUD Web App
            </span>
          </router-link>
          <div class="flex space-x-8 items-center">
            <router-link to="/ai"
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              active-class="text-blue-600 font-medium">
              <i class="pi pi-sparkles"></i>
              <span>AI Chat</span>
            </router-link>
            <!-- Dynamic CRUD routes per Notion database under parent page -->
            <DatabaseMenu />
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- PrimeVue ConfirmDialog for delete confirmations -->
    <ConfirmDialog />
  </div>
</template>
