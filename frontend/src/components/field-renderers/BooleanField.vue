<template>
  <div class="flex items-center gap-2 ">
    <i v-if="value" class="pi pi-check-circle text-green-500 bg-blue-100 p-1 rounded-full"></i>
    <!-- <Badge :value="value ? formatLabel(fieldName) : `Not ${formatLabel(fieldName)}`"
      :severity="value ? 'success' : 'danger'" /> -->
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Boolean,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  formatLabel: {
    type: Function,
    required: true
  }
})
</script>
