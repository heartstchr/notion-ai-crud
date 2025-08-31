<template>
    <div class="text-center">
        <button @click="$emit('load-more')" :disabled="loading"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <span v-if="loading">Loading...</span>
            <span v-else>Load More</span>
        </button>
    </div>
</template>

<script setup>
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['load-more'])
</script>
