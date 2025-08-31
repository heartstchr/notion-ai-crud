<template>
    <div class="text-gray-800 leading-relaxed">
        <span v-for="(text, index) in textContent" :key="index" :class="text.annotations?.bold ? 'font-semibold' : ''"
            :style="getTextStyle(text.annotations)">
            {{ text.text?.content || text.plain_text || '' }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    value: {
        type: Object,
        required: true
    }
})

const textContent = computed(() => {
    return props.value.rich_text || props.value.title || []
})

const getTextStyle = (annotations) => {
    if (!annotations) return {}

    const style = {}
    if (annotations.italic) style.fontStyle = 'italic'
    if (annotations.underline) style.textDecoration = 'underline'
    if (annotations.strikethrough) style.textDecoration = 'line-through'
    if (annotations.code) {
        style.fontFamily = 'monospace'
        style.backgroundColor = '#f3f4f6'
        style.padding = '2px 4px'
        style.borderRadius = '4px'
    }
    return style
}
</script>
