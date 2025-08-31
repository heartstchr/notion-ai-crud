<template>
    <div class="flex items-center space-x-2">
        <i class="pi pi-link text-purple-500"></i>
        <a :href="value.url" target="_blank" rel="noopener noreferrer"
            class="text-purple-600 hover:text-purple-800 underline truncate max-w-xs">
            {{ formatUrl(value.url) }}
        </a>
    </div>
</template>

<script setup>
const props = defineProps({
    value: {
        type: Object,
        required: true
    }
})

const formatUrl = (url) => {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname + urlObj.pathname
    } catch {
        return url
    }
}
</script>
