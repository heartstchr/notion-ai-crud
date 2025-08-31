<template>
  <div class="text-center space-y-4">
    <!-- Database Title with Skeleton -->
    <div v-if="loading && !databaseTitle" class="space-y-2">
      <div class="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 300px;"></div>
    </div>
    <h1 v-else class="text-4xl font-bold text-gray-900">{{ databaseTitle }}</h1>

    <!-- Database Description with Skeleton -->
    <div v-if="loading && !databaseDescription" class="space-y-2">
      <div class="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 500px;"></div>
      <div class="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto" style="width: 400px;"></div>
    </div>
    <p v-else-if="databaseDescription" class="text-lg text-gray-600 max-w-2xl mx-auto">
      {{ databaseDescription }}
    </p>

    <div class="flex justify-end gap-4 flex-wrap">
      <button @click="refreshSchema" :disabled="loading"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="pi pi-refresh mr-2"></i>Refresh
      </button>
      <button @click="goToAdd" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <i class="pi pi-plus mr-2"></i>Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  databaseTitle: {
    type: String,
    default: ''
  },
  databaseDescription: {
    type: String,
    default: ''
  }
})

defineEmits(['refreshSchema'])

const goToAdd = () => {
  router.push('/add')
}
</script>
