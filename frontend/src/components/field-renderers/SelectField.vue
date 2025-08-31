<template>
  <div class="flex flex-wrap gap-2">
    <span v-for="option in selectOptions" :key="option.value || option" :class="getOptionClasses(option, field, schema)"
      class="px-3 py-1.5 text-sm rounded-full border font-medium">
      {{ option.label || option }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getSelectOptionsWithColors, getOptionClasses } from '../../utils/mappingUtils.js'

const props = defineProps({
  value: {
    type: [Object, Array],
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  schema: {
    type: Object,
    default: null
  }
})

const field = computed(() => ({
  name: props.fieldName,
  options: getSchemaOptions(props.fieldName, props.schema)
}))

const selectOptions = computed(() => {
  return getSelectOptionsWithColors(props.value)
})

const getSchemaOptions = (fieldName, schema) => {
  if (!schema || !schema.properties || !schema.properties[fieldName]) {
    return []
  }
  const schemaProperty = schema.properties[fieldName]
  return schemaProperty.options || []
}
</script>
