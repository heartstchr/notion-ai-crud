<template>
  <Drawer :visible="visible" @update:visible="$emit('update:visible', $event)" :position="isMobile ? 'bottom' : 'right'"
    header="Review & Edit Multi-Source Database Schema"
    :style="isMobile ? { height: '90vh' } : { width: '95vw', maxWidth: '1400px' }" :pt="drawerPT">
    <div class="h-full scrollbar-auto-hide p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Header with description -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <i class="pi pi-database text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Database Schema Editor</h2>
            <p class="text-gray-600 mt-1">
              Review and customize your multi-source database schema before creation
            </p>
          </div>
        </div>
      </div>

      <!-- System-level information -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
        <div
          class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:from-slate-100 hover:to-slate-200 hover:-translate-y-0.5 hover:shadow-md"
          @click="systemInfoExpanded = !systemInfoExpanded">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-cog text-blue-600"></i>
              <h3 class="text-lg font-semibold text-gray-900">System Information</h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ systemInfoExpanded ? 'Hide' : 'Show' }}</span>
              <i
                :class="['pi transition-transform duration-200', systemInfoExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </div>
          </div>
        </div>

        <div v-show="systemInfoExpanded" class="p-6 transition-all duration-300">
          <div class="mb-6">
            <label class="flex items-center font-semibold text-gray-700 mb-2 text-sm">
              <i class="pi pi-tag mr-2"></i>
              System Title
            </label>
            <InputText v-model="localSchema.title"
              class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:shadow-lg focus:outline-none bg-white"
              placeholder="Enter system title" />
          </div>

          <div class="mb-6">
            <label class="flex items-center font-semibold text-gray-700 mb-2 text-sm">
              <i class="pi pi-file-edit mr-2"></i>
              System Description
            </label>
            <Textarea v-model="localSchema.description"
              class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:shadow-lg focus:outline-none bg-white resize-none"
              rows="3" placeholder="Enter system description" />
          </div>
        </div>
      </div>

      <!-- Data sources list -->
      <div class="mb-8">
        <div
          class="flex justify-between items-center mb-6 py-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          @click="dataSourcesExpanded = !dataSourcesExpanded">
          <div class="flex items-center gap-2">
            <i class="pi pi-list text-green-600"></i>
            <h3 class="text-lg font-semibold text-gray-900">Data Sources</h3>
            <span
              class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">{{
                localSchema.dataSources.length }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-plus" label="Add Data Source" size="small"
              class="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none rounded-lg px-4 py-2 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              @click.stop="addDataSource" />
            <span class="text-sm text-gray-500">{{ dataSourcesExpanded ? 'Hide' : 'Show' }}</span>
            <i
              :class="['pi transition-transform duration-200', dataSourcesExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
          </div>
        </div>

        <div v-show="dataSourcesExpanded"
          class="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 transition-all duration-300">
          <div v-for="(dataSource, index) in localSchema.dataSources" :key="index"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <!-- Data source header -->
            <div
              class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <i class="pi pi-table text-white text-sm"></i>
                </div>
                <div>
                  <h4 class="text-base font-bold text-gray-900 m-0">
                    Data Source {{ index + 1 }}
                  </h4>
                  <p class="text-sm text-gray-600 mt-1 m-0">{{ dataSource.name || 'Untitled' }}</p>
                </div>
              </div>
              <Button icon="pi pi-trash" severity="danger" text size="small"
                class="opacity-70 transition-all duration-200 hover:opacity-100 hover:scale-110"
                @click="removeDataSource(index)" v-if="localSchema.dataSources.length > 1" />
            </div>

            <!-- Data source content -->
            <div class="p-6">
              <div class="mb-6">
                <label class="flex items-center font-semibold text-gray-700 mb-2 text-sm">
                  <i class="pi pi-tag mr-2"></i>
                  Data Source Name
                </label>
                <InputText v-model="dataSource.name"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:shadow-lg focus:outline-none bg-white"
                  placeholder="Enter data source name" />
              </div>

              <div class="mb-6">
                <label class="flex items-center font-semibold text-gray-700 mb-2 text-sm">
                  <i class="pi pi-file-edit mr-2"></i>
                  Description
                </label>
                <Textarea v-model="dataSource.description"
                  class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:border-indigo-500 focus:shadow-lg focus:outline-none bg-white resize-none"
                  rows="2" placeholder="Enter data source description" />
              </div>

              <!-- Properties section -->
              <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex justify-between items-center mb-4">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-th-large text-purple-600"></i>
                    <label class="font-semibold text-gray-700 text-sm">Properties</label>
                    <span
                      class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-xl text-xs font-semibold ml-2">{{
                        dataSource.properties.length }}</span>
                  </div>
                  <Button icon="pi pi-plus" label="Add Property" size="small"
                    class="bg-gradient-to-r from-purple-500 to-purple-600 border-none rounded-md px-3 py-1.5 text-white font-semibold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    @click="addProperty(index)" />
                </div>

                <div class="flex flex-col gap-4">
                  <div v-for="(property, propIndex) in dataSource.properties" :key="propIndex"
                    class="bg-gradient-to-r from-slate-50 to-slate-100 border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                    <div class="flex justify-between items-center mb-3">
                      <div class="flex gap-3 flex-1">
                        <InputText v-model="property.name" placeholder="Property name"
                          class="flex-2 border border-gray-300 rounded-md px-2 py-1.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:shadow-sm focus:outline-none" />
                        <Dropdown v-model="property.type" :options="propertyTypes" optionLabel="label"
                          optionValue="value" placeholder="Type" class="flex-1 min-w-[120px]" />
                      </div>
                      <Button icon="pi pi-trash" severity="danger" text size="small"
                        class="opacity-60 transition-all duration-200 hover:opacity-100 hover:scale-110"
                        @click="removeProperty(index, propIndex)" />
                    </div>

                    <!-- Additional options for specific property types -->
                    <div v-if="property.type === 'select' || property.type === 'multi_select'"
                      class="mt-3 pt-3 border-t border-gray-200">
                      <label class="flex items-center text-xs font-semibold text-gray-600 mb-2">
                        <i class="pi pi-list mr-1"></i>
                        Options (one per line)
                      </label>
                      <Textarea v-model="property.options" rows="2"
                        class="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm resize-y transition-all duration-200 focus:border-indigo-500 focus:shadow-sm focus:outline-none"
                        placeholder="Option 1&#10;Option 2&#10;Option 3" />
                    </div>

                    <div v-if="property.type === 'number'" class="mt-3 pt-3 border-t border-gray-200">
                      <label class="flex items-center text-xs font-semibold text-gray-600 mb-2">
                        <i class="pi pi-calculator mr-1"></i>
                        Format
                      </label>
                      <Dropdown v-model="property.format" :options="numberFormats" optionLabel="label"
                        optionValue="value" placeholder="Format" class="w-full max-w-[200px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-100">
        <Button label="Cancel" severity="secondary"
          class="bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-6 py-3 font-semibold transition-all duration-200 hover:bg-gray-200 hover:-translate-y-0.5"
          @click="handleCancel" />
        <Button label="Create Databases"
          class="bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white rounded-lg px-6 py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          @click="handleCreate" :loading="creating" />
      </div>
    </div>
  </Drawer>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  schema: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      dataSources: []
    })
  }
})

const emit = defineEmits(['update:visible', 'create', 'cancel'])

const creating = ref(false)

// Mobile detection
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
})

// Drawer Passthrough Configuration
const drawerPT = {
  root: {
    class: 'rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm bg-white/95'
  },
  header: {
    class: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl px-6 py-4'
  },
  content: {
    class: 'bg-gradient-to-br from-slate-50 to-slate-100 rounded-b-2xl overflow-hidden'
  }
}

// Collapsible sections state
const systemInfoExpanded = ref(true)
const dataSourcesExpanded = ref(true)

// Create a local copy of the schema that can be modified
const localSchema = ref({
  title: '',
  description: '',
  dataSources: []
})

// Watch for changes in the prop and update local schema
watch(() => props.schema, (newSchema) => {
  if (newSchema) {
    localSchema.value = JSON.parse(JSON.stringify(newSchema))
  }
}, { immediate: true, deep: true })

// Prevent body scroll when drawer is open
watch(() => props.visible, (isVisible) => {
  if (typeof document !== 'undefined') {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

const propertyTypes = [
  { label: 'Title', value: 'title' },
  { label: 'Rich Text', value: 'rich_text' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multi_select' },
  { label: 'Date', value: 'date' },
  { label: 'People', value: 'people' },
  { label: 'Files', value: 'files' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'URL', value: 'url' },
  { label: 'Email', value: 'email' },
  { label: 'Phone Number', value: 'phone_number' },
  { label: 'Created Time', value: 'created_time' },
  { label: 'Created By', value: 'created_by' },
  { label: 'Last Edited Time', value: 'last_edited_time' },
  { label: 'Last Edited By', value: 'last_edited_by' }
]

const numberFormats = [
  { label: 'Number', value: 'number' },
  { label: 'Percent', value: 'percent' },
  { label: 'Dollar', value: 'dollar' },
  { label: 'Euro', value: 'euro' },
  { label: 'Pound', value: 'pound' },
  { label: 'Yen', value: 'yen' },
  { label: 'Ruble', value: 'ruble' },
  { label: 'Rupee', value: 'rupee' },
  { label: 'Won', value: 'won' },
  { label: 'Yuan', value: 'yuan' }
]

const addDataSource = () => {
  localSchema.value.dataSources.push({
    name: '',
    description: '',
    properties: []
  })
}

const removeDataSource = (index) => {
  localSchema.value.dataSources.splice(index, 1)
}

const addProperty = (dataSourceIndex) => {
  localSchema.value.dataSources[dataSourceIndex].properties.push({
    name: '',
    type: 'rich_text',
    options: '',
    format: 'number'
  })
}

const removeProperty = (dataSourceIndex, propertyIndex) => {
  localSchema.value.dataSources[dataSourceIndex].properties.splice(propertyIndex, 1)
}

const handleCreate = async () => {
  creating.value = true

  try {
    // Convert the edited schema to the format expected by the backend
    const formattedSchema = {
      title: localSchema.value.title,
      description: localSchema.value.description,
      dataSources: localSchema.value.dataSources.map(dataSource => ({
        name: dataSource.name,
        description: dataSource.description,
        properties: dataSource.properties.reduce((acc, prop) => {
          if (prop.name && prop.type) {
            let propertyConfig = {}

            if (prop.type === 'select' || prop.type === 'multi_select') {
              const options = prop.options.split('\n').filter(opt => opt.trim()).map(opt => ({
                name: opt.trim(),
                color: 'blue'
              }))
              propertyConfig[prop.type] = { options }
            } else if (prop.type === 'number') {
              propertyConfig[prop.type] = { format: prop.format || 'number' }
            } else {
              propertyConfig[prop.type] = {}
            }

            acc[prop.name] = propertyConfig
          }
          return acc
        }, {})
      }))
    }

    emit('create', formattedSchema)
  } finally {
    creating.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* Responsive design for mobile */
@media (max-width: 768px) {
  .p-8 {
    padding: 1rem;
  }

  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .flex.justify-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .flex.gap-3 {
    flex-direction: column;
    gap: 0.5rem;
  }

  .flex.gap-4 {
    flex-direction: column;
    gap: 0.75rem;
  }

  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .w-12 {
    width: 2.5rem;
  }

  .h-12 {
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .p-8 {
    padding: 0.75rem;
  }

  .px-6 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .text-2xl {
    font-size: 1.25rem;
  }

  .w-12 {
    width: 2.25rem;
  }

  .h-12 {
    height: 2.25rem;
  }
}
</style>
