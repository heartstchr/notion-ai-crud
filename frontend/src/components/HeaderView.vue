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
      <Button @click="refreshSchema" :disabled="loading" severity="secondary" text class="p-0">
        <div
          class="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg">
          <div class="bg-white rounded-md px-3 py-2 flex items-center gap-2">
            <i
              class="pi pi-refresh bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent"></i>
            <span
              class="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-medium">Refresh</span>
          </div>
        </div>
      </Button>
      <Button @click="goToAdd" severity="secondary" text class="p-0">
        <div
          class="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
          <i class="pi pi-plus text-white"></i>
          <span class="text-white font-medium">Add</span>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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

const emit = defineEmits(['refreshSchema'])

const refreshSchema = () => {
  // Emit the refresh event to parent component
  emit('refreshSchema')
}

const goToAdd = () => {
  // Check if we're in a database context (from route params)
  if (route.params.databaseId) {
    router.push({ name: 'db-add', params: { databaseId: route.params.databaseId } })
  } else {
    router.push('/add')
  }
}
</script>
