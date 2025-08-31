<template>
  <div class="data-card hover:shadow-lg text-gray-900 transition-shadow p-4 border-2 border-black rounded-lg shadow-lg">
    <!-- Action Buttons -->
    <div class="flex justify-end items-start mb-3">
      <div class="flex gap-2">
        <button @click="editItem"
          class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
          <i class="pi pi-pencil"></i>
        </button>
        <button @click="deleteItem"
          class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Title fields at the top -->
    <div v-if="titleFields.length > 0" class="mb-4 flex md:flex-row flex-col gap-2">
      <!-- Avatar Section -->
      <div class="flex justify-center mb-4">
        <Avatar :label="getAvatarLabel()" :image="getAvatarImage()" size="xlarge" shape="circle"
          class="border-2 border-gray-200 shadow-md bg-gray-100 p-2" />
        <div v-if="booleanFields.length > 0" class="mb-4 -ml-4">
          <div class="flex flex-wrap gap-2">
            <BooleanField v-for="[key, value] in booleanFields" :key="key" :value="value" :field-name="key"
              :format-label="formatLabel"/>
          </div>
        </div>
      </div>
      <div v-for="[key, value] in titleFields" :key="key" class="flex items-center gap-3 mb-2 ml-4">
        <h2 class="text-2xl font-bold text-gray-900">{{ value }}</h2>
      </div>
    </div>


    <!-- Contact fields section -->
    <div v-if="contactFields.length > 0" class="mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="[key, value] in contactFields" :key="key"
          class="flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <i :class="getContactFieldIcon(key, getSchemaProperty(key))"></i>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-800 font-medium">
              {{ value || 'Not provided' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Boolean fields section -->


    <!-- Number fields section -->
    <div v-if="numberFields.length > 0" class="mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="[key, value] in numberFields" :key="key"
          class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <i :class="getNumberFieldIcon(key, getSchemaProperty(key))" class="text-blue-500"></i>
            <span class="text-sm font-medium text-gray-700">{{ formatLabel(key) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-800 font-mono font-medium">
              {{ formatNumber(value || 0, key) }}
            </span>
            <!-- Show currency symbol if available -->
            <span v-if="getFieldCurrencySymbol(key)" class="text-lg text-gray-600 font-medium">
              {{ getFieldCurrencySymbol(key) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic fields -->
    <div class="space-y-3">
      <div v-for="[key, property] in processedFields" :key="key"
        class="space-y-1 pt-2 border-b border-gray-100 last:border-b-0">
        <!-- Field label -->
        <div v-if="shouldShowLabel(key)" class="text-sm font-medium text-gray-700 mb-2">
          <span v-if="property?.emoji" class="mr-2 text-base">{{ property.emoji }}</span>
          <i v-else-if="property?.icon" :class="property.icon" class="mr-2 text-gray-500"></i>
          {{ formatLabel(key) }}
        </div>

        <!-- Field content -->
        <component :is="getFieldRenderer(key, item[key])" :value="item[key]" :field-name="key" :schema="schema"
          :format-label="formatLabel" :format-number="formatNumber" :get-schema-property="getSchemaProperty"
          :get-field-currency-symbol="getFieldCurrencySymbol" />
      </div>
    </div>

    <!-- Timestamps -->
    <div class="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
      Added: {{ formatDate(item.created_time) }}
      <span v-if="item.last_edited_time !== item.created_time">
        • Updated: {{ formatDate(item.last_edited_time) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import {
  formatNumberBySchema,
  getCurrencySymbol,
  getNumberFieldIcon
} from '../utils/mappingUtils.js'
import NotionMiddleware from '../services/notionMiddleware.js'

// Async components for better performance
const RichTextField = defineAsyncComponent(() => import('./field-renderers/RichTextField.vue'))
const ContactField = defineAsyncComponent(() => import('./field-renderers/ContactField.vue'))
const NumbersField = defineAsyncComponent(() => import('./field-renderers/NumbersField.vue'))
const UrlField = defineAsyncComponent(() => import('./field-renderers/UrlField.vue'))
const DateField = defineAsyncComponent(() => import('./field-renderers/DateField.vue'))
const SelectField = defineAsyncComponent(() => import('./field-renderers/SelectField.vue'))
const BooleanField = defineAsyncComponent(() => import('./field-renderers/BooleanField.vue'))
const TextField = defineAsyncComponent(() => import('./field-renderers/TextField.vue'))

// PrimeVue components
const Avatar = defineAsyncComponent(() => import('primevue/avatar'))

// Composables
const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  schema: {
    type: Object,
    default: null
  },
  editRoute: {
    type: String,
    default: '/edit'
  },
  itemIdField: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['deleteItem'])

// Computed properties for better performance
const titleFields = computed(() => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties)
    .filter(([_, property]) => property.type === 'title' && props.item[_])
    .map(([key]) => [key, props.item[key]])
})

const contactFields = computed(() => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties)
    .filter(([key, property]) => {
      // Check if it's a contact-related field
      const isContactField = key.toLowerCase().includes('email') ||
        key.toLowerCase().includes('phone') ||
        key.toLowerCase().includes('contact') ||
        property.type === 'email' ||
        property.type === 'phone'
      return isContactField && props.item[key]
    })
    .map(([key]) => [key, props.item[key]])
})

const booleanFields = computed(() => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties)
    .filter(([, property]) => property.type === 'checkbox')
    .map(([key]) => [key, props.item[key] || false])
})

const numberFields = computed(() => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties)
    .filter(([, property]) => property.type === 'number')
    .map(([key]) => [key, props.item[key] || 0])
})

const processedFields = computed(() => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties)
    .filter(([key, property]) => {
      // Check if it's a contact-related field
      const isContactField = key.toLowerCase().includes('email') ||
        key.toLowerCase().includes('phone') ||
        key.toLowerCase().includes('contact') ||
        property.type === 'email' ||
        property.type === 'phone'

      return key !== 'contact' &&
        key !== 'numbers' &&
        property.type !== 'title' &&
        property.type !== 'number' &&
        property.type !== 'checkbox' &&
        !isContactField
    })
    .map(([key]) => [key, props.schema.properties[key]])
})

// Field type detection cache
const fieldTypeCache = new Map()

const getFieldType = (value) => {
  if (fieldTypeCache.has(value)) {
    return fieldTypeCache.get(value)
  }

  let type = 'text'

  if (isRichText(value)) type = 'richText'
  else if (isUrl(value)) type = 'url'
  else if (isDate(value)) type = 'date'
  else if (isSelect(value)) type = 'select'
  else if (typeof value === 'boolean') type = 'boolean'
  else if (typeof value === 'number') type = 'number'
  else if (typeof value === 'string' && value) type = 'text'

  fieldTypeCache.set(value, type)
  return type
}

const getFieldRenderer = (key, value) => {
  if (key === 'contact') return ContactField
  if (key === 'numbers') return NumbersField

  const type = getFieldType(value)

  switch (type) {
    case 'richText': return RichTextField
    case 'url': return UrlField
    case 'date': return DateField
    case 'select': return SelectField
    case 'boolean': return BooleanField
    default: return TextField
  }
}

const shouldShowLabel = (key) => {
  return key !== 'contact' && key !== 'numbers'
}

// Methods
const editItem = () => {
  const itemId = props.item[props.itemIdField]
  router.push(`${props.editRoute}/${itemId}`)
}

const deleteItem = () => {
  const itemId = props.item[props.itemIdField]
  emit('deleteItem', itemId)
}

const formatLabel = (text) => {
  return NotionMiddleware.formatLabel(text)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const getSchemaProperty = (fieldName) => {
  return props.schema?.properties?.[fieldName] || null
}

const getContactFieldIcon = (fieldName, property) => {
  // Check field name first
  const fieldNameLower = fieldName.toLowerCase()

  if (fieldNameLower.includes('email') || property?.type === 'email') {
    return 'pi pi-envelope text-blue-500'
  }

  if (fieldNameLower.includes('phone') || fieldNameLower.includes('mobile') || property?.type === 'phone') {
    return 'pi pi-phone text-green-500'
  }

  if (fieldNameLower.includes('linkedin') || fieldNameLower.includes('social')) {
    return 'pi pi-linkedin text-blue-600'
  }

  if (fieldNameLower.includes('website') || fieldNameLower.includes('url')) {
    return 'pi pi-globe text-purple-500'
  }

  if (fieldNameLower.includes('address') || fieldNameLower.includes('location')) {
    return 'pi pi-map-marker text-red-500'
  }

  // Default contact icon
  return 'pi pi-user text-gray-500'
}

const getFieldCurrencySymbol = (fieldName) => {
  const property = getSchemaProperty(fieldName)
  if (!property || property.type !== 'number' || !property.number?.format) {
    return null
  }

  const symbol = getCurrencySymbol(property.number.format)
  if (symbol) return symbol

  // Fallback symbols
  const fallbackSymbols = {
    'dollar': '$',
    'euro': '€',
    'pound': '£',
    'yen': '¥',
    'rupee': '₹',
    'yuan': '¥',
    'percent': '%'
  }

  return fallbackSymbols[property.number.format] || property.number.format.toUpperCase()
}

// Field type detection functions
const isRichText = (value) => {
  return value && typeof value === 'object' && (value.rich_text || value.title)
}

const isUrl = (value) => {
  return value && typeof value === 'object' && value.type === 'url' && value.url
}

const isDate = (value) => {
  return value && typeof value === 'object' && value.type === 'date' && value.date
}

const isSelect = (value) => {
  if (value && typeof value === 'object' && (value.type === 'select' || value.type === 'multi_select')) {
    return true
  }

  if (Array.isArray(value) && value.length > 0) {
    return typeof value[0] === 'string' || (typeof value[0] === 'object' && value[0].name)
  }

  return false
}

const formatNumber = (number, fieldName = null) => {
  if (typeof number !== 'number') return number

  const property = fieldName ? getSchemaProperty(fieldName) : null
  if (property) {
    return formatNumberBySchema(number, property)
  }

  return number.toLocaleString()
}

// Avatar helper methods
const getAvatarLabel = () => {
  // Try to get a name from title fields first
  if (titleFields.value.length > 0) {
    const titleValue = titleFields.value[0][1]
    if (titleValue && typeof titleValue === 'string') {
      // Extract initials from the title
      const words = titleValue.trim().split(/\s+/)
      if (words.length >= 2) {
        return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      } else if (words.length === 1) {
        return words[0][0].toUpperCase()
      }
    }
  }

  // Fallback to first letter of the first available field
  const firstField = Object.values(props.item).find(value =>
    value && typeof value === 'string' && value.trim().length > 0
  )

  if (firstField) {
    return firstField.trim()[0].toUpperCase()
  }

  return '?'
}

const getAvatarImage = () => {
  // Check if there's an image field in the schema
  if (props.schema?.properties) {
    const imageField = Object.entries(props.schema.properties).find(([key, property]) => {
      return property.type === 'url' &&
        (key.toLowerCase().includes('image') ||
          key.toLowerCase().includes('photo') ||
          key.toLowerCase().includes('avatar') ||
          key.toLowerCase().includes('picture'))
    })

    if (imageField) {
      const imageValue = props.item[imageField[0]]
      if (imageValue && typeof imageValue === 'object' && imageValue.url) {
        return imageValue.url
      } else if (typeof imageValue === 'string' && imageValue.trim()) {
        return imageValue.trim()
      }
    }
  }

  return null
}
</script>
