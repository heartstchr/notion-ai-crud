<template>
  <div class="relative">
    <!-- Gradient Border with Drop Shadow -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
      style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
      <div class="bg-white rounded-lg h-full w-full"></div>
    </div>

    <div class="relative z-10 bg-white rounded-lg overflow-hidden">
      <!-- Table Header -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">All Items</h3>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                {{ getTitleFieldLabel() || 'Item' }}
              </th>
              <th v-for="[key, property] in getContactFieldsForHeader()" :key="key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-2">
                  <i :class="getContactFieldIcon(key)" class="text-blue-500"></i>
                  <span>{{ formatLabel(key) }}</span>
                </div>
              </th>
              <th v-for="[key, property] in getNumberFieldsForHeader()" :key="key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-2">
                  <i :class="getNumberFieldIcon(key)" class="text-green-500"></i>
                  <span>{{ formatLabel(key) }}</span>
                </div>
              </th>
              <th v-for="[key, property] in getMultiSelectFieldsForHeader()" :key="key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                <div class="flex items-center space-x-2">
                  <i class="pi pi-tags text-purple-500"></i>
                  <span>{{ formatLabel(key) }}</span>
                </div>
              </th>
              <th v-for="[key, property] in getOtherFieldsForHeader()" :key="key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-2">
                  <i :class="getOtherFieldIcon(key, property)" class="text-gray-500"></i>
                  <span>{{ formatLabel(key) }}</span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <!-- Item Column -->
              <td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                <div class="flex items-center space-x-3">
                  <Avatar :label="getAvatarLabel(item)" :image="getAvatarImage(item)" size="medium" shape="circle"
                    class="border-2 border-gray-200 shadow-sm bg-gray-100" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ getItemTitle(item) || 'Untitled' }}
                    </div>
                    <!-- Boolean Fields -->
                    <div v-if="getBooleanFields(item).length > 0" class="flex flex-wrap gap-2 mt-1">
                      <BooleanField v-for="[key, value] in getBooleanFields(item)" :key="key" :value="value"
                        :field-name="key" :format-label="formatLabel" />
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ formatDate(item.created_time) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Contact Fields Columns -->
              <td v-for="[key, property] in getContactFieldsForHeader()" :key="key" class="px-6 py-4">
                <div class="text-sm text-gray-600">
                  {{ item[key] || 'Not provided' }}
                </div>
              </td>

              <!-- Number Fields Columns -->
              <td v-for="[key, property] in getNumberFieldsForHeader()" :key="key" class="px-6 py-4">
                <div class="text-sm">
                  <span v-if="isCurrencyField(key)" class="flex items-center space-x-2">
                    <i :class="getNumberFieldIcon(key)" class="text-green-500"></i>
                    <span class="text-gray-900 font-mono">{{ formatNumber(item[key] || 0, key) }}</span>
                  </span>
                  <span v-else class="text-gray-900 font-mono">{{ formatNumber(item[key] || 0, key) }}</span>
                </div>
              </td>

              <!-- Multi-select Fields Columns -->
              <td v-for="[key, property] in getMultiSelectFieldsForHeader()" :key="key" class="px-6 py-4 min-w-48">
                <div class="flex flex-wrap gap-1">
                  <span v-for="option in item[key] || []" :key="option.name || option"
                    :class="getMultiSelectOptionClasses(option, key)"
                    class="px-2 py-1 text-xs rounded-full border font-medium">
                    {{ option.name || option }}
                  </span>
                  <span v-if="!item[key] || item[key].length === 0" class="text-sm text-gray-400">
                    No tags
                  </span>
                </div>
              </td>

              <!-- Other Fields Columns -->
              <td v-for="[key, property] in getOtherFieldsForHeader()" :key="key" class="px-6 py-4">
                <div v-if="property.type === 'select'" class="text-sm">
                  <span v-if="item[key]" :class="getSelectOptionClasses(item[key], key)"
                    class="px-2 py-1 text-xs rounded-full border font-medium">
                    {{ getSelectOptionLabel(item[key], key) }}
                  </span>
                  <span v-else class="text-sm text-gray-400">No selection</span>
                </div>
                <div v-else-if="property.type === 'url'" class="text-sm">
                  <a v-if="item[key]" :href="getUrlValue(item[key])" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline flex items-center space-x-1">
                    <i class="pi pi-external-link text-xs"></i>
                    <span>{{ getUrlValue(item[key]) }}</span>
                  </a>
                  <span v-else class="text-sm text-gray-400">No URL</span>
                </div>
                <div v-else class="text-sm text-gray-900">
                  {{ formatFieldValue(item[key], key) }}
                </div>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-white z-10">
                <div class="flex gap-2 justify-end">
                  <IconButton icon="pi pi-pencil" severity="success" size="small" @click="editItem(item)" />
                  <IconButton icon="pi pi-trash" severity="danger" size="small" @click="deleteItem(item)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconButton from './IconButton.vue'
import Avatar from 'primevue/avatar'
import BooleanField from './field-renderers/BooleanField.vue'
import { useRouter } from 'vue-router'
import { formatNumberBySchema, getNumberFieldIcon, getOptionClasses } from '../utils/mappingUtils.js'
import NotionMiddleware from '../services/notionMiddleware.js'

const router = useRouter()

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  schema: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['deleteItem'])

// Helper methods for table view
const getItemTitle = (item) => {
  if (!props.schema?.properties || !item) return null

  const titleField = Object.entries(props.schema.properties).find(([key, property]) =>
    property.type === 'title'
  )

  return titleField ? item[titleField[0]] : null
}

const getContactFields = (item) => {
  if (!props.schema?.properties || !item) return []

  const contactFields = []
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    const value = item[key]
    const isContactField = key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('contact') ||
      property.type === 'email' ||
      property.type === 'phone'

    if (isContactField && value) {
      contactFields.push([key, value])
    }
  })

  return contactFields
}

const getNumberFields = (item) => {
  if (!props.schema?.properties || !item) return []

  const numberFields = []
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    if (property.type === 'number' && item[key] !== undefined) {
      numberFields.push([key, item[key] || 0])
    }
  })

  return numberFields
}

const getOtherFields = (item) => {
  if (!props.schema?.properties || !item) return []

  const otherFields = []
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    const value = item[key]
    const isSpecialField = property.type === 'title' ||
      property.type === 'number' ||
      property.type === 'multi_select' ||
      property.type === 'checkbox' ||
      key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('contact')

    if (!isSpecialField && value) {
      otherFields.push([key, value])
    }
  })

  return otherFields.slice(0, 3) // Limit to first 3 other fields for table display
}

const getMultiSelectFields = (item) => {
  if (!props.schema?.properties || !item) return []

  const multiSelectFields = []
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    const value = item[key]
    if (property.type === 'multi_select' && value && Array.isArray(value)) {
      multiSelectFields.push([key, value])
    }
  })

  return multiSelectFields
}

const getBooleanFields = (item) => {
  if (!props.schema?.properties || !item) return []

  const booleanFields = []
  Object.entries(props.schema.properties).forEach(([key, property]) => {
    if (property.type === 'checkbox' && item[key] !== undefined) {
      booleanFields.push([key, item[key] || false])
    }
  })

  return booleanFields
}

const getContactFieldIcon = (fieldName) => {
  const fieldNameLower = fieldName.toLowerCase()

  if (fieldNameLower.includes('email')) {
    return 'pi pi-envelope'
  }
  if (fieldNameLower.includes('phone') || fieldNameLower.includes('mobile')) {
    return 'pi pi-phone'
  }
  if (fieldNameLower.includes('linkedin') || fieldNameLower.includes('social')) {
    return 'pi pi-linkedin'
  }
  if (fieldNameLower.includes('website') || fieldNameLower.includes('url')) {
    return 'pi pi-globe'
  }
  if (fieldNameLower.includes('address') || fieldNameLower.includes('location')) {
    return 'pi pi-map-marker'
  }

  return 'pi pi-user'
}

const getOtherFieldIcon = (fieldName, property) => {
  const fieldNameLower = fieldName.toLowerCase()

  if (property.type === 'url') {
    return 'pi pi-link'
  }
  if (property.type === 'date') {
    return 'pi pi-calendar'
  }
  if (property.type === 'select') {
    return 'pi pi-list'
  }
  if (property.type === 'rich_text') {
    return 'pi pi-file-edit'
  }
  if (fieldNameLower.includes('bio') || fieldNameLower.includes('description') || fieldNameLower.includes('notes')) {
    return 'pi pi-file-text'
  }
  if (fieldNameLower.includes('status')) {
    return 'pi pi-info-circle'
  }

  return 'pi pi-info-circle'
}

const isCurrencyField = (fieldName) => {
  if (!props.schema?.properties?.[fieldName]) return false

  const property = props.schema.properties[fieldName]
  return property.type === 'number' && property.number?.format && property.number.format !== 'number'
}

const getAvatarLabel = (item) => {
  const title = getItemTitle(item)
  if (title && typeof title === 'string') {
    const words = title.trim().split(/\s+/)
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    } else if (words.length === 1) {
      return words[0][0].toUpperCase()
    }
  }

  const firstField = Object.values(item).find(value =>
    value && typeof value === 'string' && value.trim().length > 0
  )

  if (firstField) {
    return firstField.trim()[0].toUpperCase()
  }

  return '?'
}

const getAvatarImage = (item) => {
  if (!props.schema?.properties) return null

  const imageField = Object.entries(props.schema.properties).find(([key, property]) => {
    return property.type === 'url' &&
      (key.toLowerCase().includes('image') ||
        key.toLowerCase().includes('photo') ||
        key.toLowerCase().includes('avatar') ||
        key.toLowerCase().includes('picture'))
  })

  if (imageField) {
    const imageValue = item[imageField[0]]
    if (imageValue && typeof imageValue === 'object' && imageValue.url) {
      return imageValue.url
    } else if (typeof imageValue === 'string' && imageValue.trim()) {
      return imageValue.trim()
    }
  }

  return null
}

const formatLabel = (text) => {
  return NotionMiddleware.formatLabel(text)
}

const formatNumber = (number, fieldName) => {
  if (typeof number !== 'number') return number

  const property = props.schema?.properties?.[fieldName]
  if (property) {
    return formatNumberBySchema(number, property)
  }

  return number.toLocaleString()
}

const formatFieldValue = (value, key) => {
  if (typeof value === 'object' && value !== null) {
    if (value.url) return value.url
    if (value.rich_text) return value.rich_text.map(t => t.plain_text).join('')
    if (value.select) return value.select.name
    if (value.multi_select) {
      // Return a simple string for table display, but we'll handle colors in the template
      return value.multi_select.map(s => s.name).join(', ')
    }
    if (value.date) return value.date.start
    return JSON.stringify(value)
  }

  return value || 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const getMultiSelectOptionClasses = (option, fieldName) => {
  const field = {
    name: fieldName,
    options: props.schema?.properties?.[fieldName]?.options || []
  }
  return getOptionClasses(option, field, props.schema)
}

const getSelectOptionClasses = (value, fieldName) => {
  const field = {
    name: fieldName,
    options: props.schema?.properties?.[fieldName]?.options || []
  }

  // Create a mock option object for single select
  const mockOption = {
    value: value,
    label: value,
    name: value
  }

  return getOptionClasses(mockOption, field, props.schema)
}

const getSelectOptionLabel = (value, fieldName) => {
  if (!value) return 'No selection'

  const options = props.schema?.properties?.[fieldName]?.options || []
  const option = options.find(opt => opt.value === value || opt.name === value)

  return option ? (option.label || option.name || value) : value
}

const getUrlValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return value.url || value
  }
  return value
}

// Dynamic header label functions using memoizedFormatLabel
const getTitleFieldLabel = () => {
  if (!props.schema?.properties) return null

  const titleField = Object.entries(props.schema.properties).find(([key, property]) =>
    property.type === 'title'
  )

  return titleField ? formatLabel(titleField[0]) : null
}

const getContactFieldsLabel = () => {
  if (!props.schema?.properties) return null

  const contactFields = Object.entries(props.schema.properties).filter(([key, property]) => {
    const isContactField = key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('contact') ||
      property.type === 'email' ||
      property.type === 'phone'
    return isContactField
  })

  if (contactFields.length === 1) {
    return formatLabel(contactFields[0][0])
  } else if (contactFields.length > 1) {
    return 'Contact Info'
  }

  return null
}

const getNumberFieldsLabel = () => {
  if (!props.schema?.properties) return null

  const numberFields = Object.entries(props.schema.properties).filter(([key, property]) =>
    property.type === 'number'
  )

  if (numberFields.length === 1) {
    return formatLabel(numberFields[0][0])
  } else if (numberFields.length > 1) {
    return 'Numbers'
  }

  return null
}

const getContactFieldsForHeader = () => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties).filter(([key, property]) => {
    const isContactField = key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('contact') ||
      property.type === 'email' ||
      property.type === 'phone'
    return isContactField
  })
}

const getNumberFieldsForHeader = () => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties).filter(([key, property]) =>
    property.type === 'number'
  )
}

const getMultiSelectFieldsForHeader = () => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties).filter(([key, property]) =>
    property.type === 'multi_select'
  )
}

const getOtherFieldsForHeader = () => {
  if (!props.schema?.properties) return []

  return Object.entries(props.schema.properties).filter(([key, property]) => {
    const isSpecialField = property.type === 'title' ||
      property.type === 'number' ||
      property.type === 'multi_select' ||
      property.type === 'checkbox' ||
      key.toLowerCase().includes('email') ||
      key.toLowerCase().includes('phone') ||
      key.toLowerCase().includes('contact')

    return !isSpecialField
  })
}

const editItem = (item) => {
  router.push(`/edit/${item.id}`)
}

const deleteItem = (item) => {
  emit('deleteItem', item.id)
}
</script>
