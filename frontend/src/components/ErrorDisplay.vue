<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
    <i class="pi pi-exclamation-triangle text-red-500 text-xl"></i>
    <div class="flex-1">
      <strong class="text-red-800">Error:</strong>
      <span class="text-red-700">{{ error }}</span>
      <Button @click="retry" severity="danger" text>
        Try Again
      </Button>
    </div>
  </div>
</template>

<script setup>

defineProps({
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['retry'])
</script>
