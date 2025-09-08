<script setup>
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
</script>


<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 relative sticky top-0 z-50">
      <!-- Gradient Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 opacity-10 shadow-lg"
        style="filter: drop-shadow(0 4px 6px rgba(0, 144, 247, 0.1)) drop-shadow(0 2px 4px rgba(186, 98, 252, 0.1)) drop-shadow(0 1px 2px rgba(242, 65, 107, 0.1));">
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/"
            class="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Notion CRUD Web App
          </router-link>
          <div class="flex space-x-8">
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <!-- PrimeVue ConfirmDialog for delete confirmations -->
    <ConfirmDialog />
  </div>
</template>
