<template>
    <div class="flex items-center space-x-2">
        <i class="pi pi-calendar text-indigo-500"></i>
        <span class="text-gray-800">{{ formatDate(value.date?.start || value.date) }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    value: {
        type: Object,
        required: true
    }
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
}
</script>
