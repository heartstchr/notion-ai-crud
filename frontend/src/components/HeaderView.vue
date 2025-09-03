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
      <Button @click="refreshSchema" :disabled="loading" severity="secondary">
        <i class="pi pi-refresh"></i>Refresh
      </Button>
      <Button @click="goToAdd" severity="primary">
        <i class="pi pi-plus"></i>Add
      </Button>
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

const emit = defineEmits(['refreshSchema'])

const refreshSchema = () => {
  // Emit the refresh event to parent component
  emit('refreshSchema')
}

const goToAdd = () => {
  router.push('/add')
}
</script>
