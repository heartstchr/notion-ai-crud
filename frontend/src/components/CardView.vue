<template>
  <!-- Item Card -->
  <div v-if="item && Object.keys(item).length > 0"
    class="bg-white hover:shadow-lg text-gray-900 transition-shadow p-4 border-2 border-black rounded-lg shadow-lg flex flex-col h-full">
    <!-- Action Buttons -->
    <div class="flex justify-end items-start mb-3">
      <div class="flex gap-2">
        <IconButton icon="pi pi-pencil" severity="success" @click="editItem" />
        <IconButton icon="pi pi-trash" severity="danger" @click="deleteItem" />
      </div>
    </div>

    <!-- Title fields at the top -->
    <div v-if="titleFields.length > 0" class="mb-4 flex md:flex-row flex-col gap-2">
      <!-- Avatar Section -->
      <div class="flex justify-center mb-4">
        <Avatar :label="getAvatarLabel()" :image="getAvatarImage()" size="xlarge" shape="circle"
          class="border-2 border-gray-200 shadow-md bg-gray-100 p-2" />
      </div>
      <div v-for="[key, value] in titleFields" :key="key" class="flex flex-col justify-start gap-2 mb-2 ml-4">
        <h2 class="text-2xl font-bold text-gray-900">{{ value }}</h2>
        <div v-if="booleanFields.length > 0" class="mb-2">
          <div class="flex flex-wrap gap-2">
            <BooleanField v-for="[key, value] in booleanFields" :key="key" :value="value" :field-name="key"
              :format-label="formatLabel" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contact fields section -->
    <div v-if="contactFields.length > 0" class="mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div v-for="[key, value] in contactFields" :key="key"
          class="flex items-center justify-start bg-blue-50 rounded-lg p-1 gap-1">
          <div class="flex items-center space-x-1">
            <i :class="getContactFieldIcon(key, getSchemaProperty(key))"></i>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-gray-800 font-medium text-sm truncate max-w-32" :title="value || 'Not provided'">
              {{ value || 'Not provided' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- Currency Number Fields ({{ currencyNumberFields.length }}) -->
    <div v-if="currencyNumberFields.length > 0" class="mb-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div v-for="[key, value] in currencyNumberFields" :key="key"
          class="flex flex-col items-center justify-between bg-green-50 rounded-lg p-1 border border-green-200">
          <div class="flex items-center space-x-1">
            <span class="text-sm font-medium text-gray-700 truncate max-w-24" :title="formatLabel(key)">{{
              formatLabel(key) }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-gray-800 font-mono font-medium">
              {{ formatNumber(value || 0, key) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Regular Number Fields ({{ regularNumberFields.length }}) -->
    <div v-if="regularNumberFields.length > 0" class="mb-4">
      <div class="gap-3">
        <div v-for="[key, value] in regularNumberFields" :key="key"
          class="flex-col items-center justify-between bg-gray-50 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i :class="getNumberFieldIcon(key, getSchemaProperty(key))" class="text-blue-500"></i>
              <span class="text-sm font-medium text-gray-700" :title="formatLabel(key)">{{
                formatLabel(key) }}</span>
            </div>
            <span class="text-gray-800 font-mono font-medium text-lg">
              {{ formatNumber(value || 0, key) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- URL Fields -->
    <div v-if="urlFields.length > 0" class="mb-4">
      <div class="gap-3">
        <div v-for="[key, value] in urlFields" :key="key"
          class="flex-col items-center justify-between bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div class="flex items-center space-x-2">
            <i class="pi pi-link text-purple-600"></i>
            <span class="text-sm font-medium text-gray-700" :title="formatLabel(key)">{{
              formatLabel(key) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <a :href="value" target="_blank" rel="noopener noreferrer"
              class="text-purple-600 hover:text-purple-800 underline" :title="value">
              {{ value || 'No URL' }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- Dynamic fields -->
    <div class="space-y-3 flex-1">
      <div v-for="[key, property] in processedFieldsForRender" :key="key"
        class="space-y-1 pt-2 border-b border-gray-100 last:border-b-0">
        <!-- Field label -->
        <div v-if="shouldShowLabel(key)" class="text-sm font-medium text-gray-700 mb-2">
          <span v-if="property?.emoji" class="mr-2 text-base">{{ property.emoji }}</span>
          <i v-else-if="property?.icon" :class="property.icon" class="mr-2 text-gray-500"></i>
          <span class="truncate max-w-32" :title="formatLabel(key)">{{ formatLabel(key) }}</span>
        </div>

        <!-- Field content -->
        <component :is="getFieldRenderer(key)" :value="item[key]" :field-name="key" :schema="schema"
          :format-label="formatLabel" :format-number="formatNumber" :get-schema-property="getSchemaProperty"
          :get-field-currency-symbol="getFieldCurrencySymbol" />
      </div>
    </div>

    <!-- Timestamps -->
    <div class="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100 flex flex-row justify-end">
      <span>Added: {{ formatDate(item.created_time) }}</span>
      <span v-if="item.last_edited_time !== item.created_time">
        • Updated: {{ formatDate(item.last_edited_time) }}
      </span>
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'

import {
  formatNumberBySchema,
  getCurrencySymbol,
  getNumberFieldIcon
} from '../utils/mappingUtils.js'
import NotionMiddleware from '../services/notionMiddleware.js'



// Direct imports for better performance - async components are unnecessary overhead
import RichTextField from './field-renderers/RichTextField.vue'
import ContactField from './field-renderers/ContactField.vue'
import NumbersField from './field-renderers/NumbersField.vue'
import UrlField from './field-renderers/UrlField.vue'
import DateField from './field-renderers/DateField.vue'
import SelectField from './field-renderers/SelectField.vue'
import BooleanField from './field-renderers/BooleanField.vue'
import TextField from './field-renderers/TextField.vue'
import Avatar from 'primevue/avatar'
import IconButton from './IconButton.vue'

// Composables
const router = useRouter()
const confirm = useConfirm()



const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  schema: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
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



// Memoized field processing for better performance
const processedFields = computed(() => {
  if (!props.schema?.properties || !props.item) return { titleFields: [], contactFields: [], booleanFields: [], currencyNumberFields: [], regularNumberFields: [], urlFields: [], otherFields: [] }

  const schemaProps = props.schema.properties
  const itemData = props.item

  // Process all fields in one pass to avoid multiple Object.entries() calls
  const result = {
    titleFields: [],
    contactFields: [],
    booleanFields: [],
    currencyNumberFields: [],
    regularNumberFields: [],
    urlFields: [],
    otherFields: []
  }

  Object.entries(schemaProps).forEach(([key, property]) => {
    const value = itemData[key]

    if (!value && property.type !== 'checkbox' && property.type !== 'select' && property.type !== 'multi_select') return // Skip empty values except checkboxes and select fields

    switch (property.type) {
      case 'title':
        result.titleFields.push([key, value])
        break
      case 'checkbox':
        result.booleanFields.push([key, value || false])
        break
      case 'number':
        if (property.number?.format && property.number.format !== 'number') {
          result.currencyNumberFields.push([key, value || 0])
        } else {
          result.regularNumberFields.push([key, value || 0])
        }
        break
      case 'url':
        result.urlFields.push([key, value])
        break
      case 'select':
      case 'multi_select':
        result.otherFields.push([key, property])
        break
      default: {
        // Check if it's a contact-related field
        const isContactField = key.toLowerCase().includes('email') ||
          key.toLowerCase().includes('phone') ||
          key.toLowerCase().includes('contact') ||
          property.type === 'email' ||
          property.type === 'phone'

        if (isContactField) {
          result.contactFields.push([key, value])
        } else if (property.type !== 'title' && property.type !== 'number' && property.type !== 'checkbox' && property.type !== 'url') {
          result.otherFields.push([key, property])
        }
      }
    }
  })

  return result
})

// Destructure computed results for cleaner template usage
const titleFields = computed(() => processedFields.value.titleFields)
const contactFields = computed(() => processedFields.value.contactFields)
const booleanFields = computed(() => processedFields.value.booleanFields)
const currencyNumberFields = computed(() => processedFields.value.currencyNumberFields)
const regularNumberFields = computed(() => processedFields.value.regularNumberFields)
const urlFields = computed(() => processedFields.value.urlFields)
const processedFieldsForRender = computed(() => processedFields.value.otherFields)

// Simplified field renderer selection based on schema type
const getFieldRenderer = (key) => {
  if (key === 'contact') return ContactField
  if (key === 'numbers') return NumbersField

  // Use schema type directly instead of complex detection
  const property = props.schema?.properties?.[key]
  if (!property) return TextField

  switch (property.type) {
    case 'rich_text': return RichTextField
    case 'url': return UrlField
    case 'date': return DateField
    case 'select':
    case 'multi_select': return SelectField
    case 'checkbox': return BooleanField
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

  // Get item title for confirmation message
  const itemTitle = titleFields.value.length > 0 ? titleFields.value[0][1] : 'this item'

  confirm.require({
    message: `Are you sure you want to delete "${itemTitle}"?`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('deleteItem', itemId)
    },
    reject: () => {
      // User cancelled deletion
    }
  })
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
