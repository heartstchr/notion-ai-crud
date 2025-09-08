<script setup>
import { RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog'
</script>


<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
