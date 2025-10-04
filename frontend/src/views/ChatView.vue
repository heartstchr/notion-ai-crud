<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen">
    <!-- Animated Background Shapes -->
    <AnimatedBackground />

    <!-- Chat Container -->
    <div class="relative z-10 bg-transparent">

      <!-- Chat Header (shown when messages exist) -->
      <div v-if="messages.length > 0"
        class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 px-4 pt-4">
        <Button @click="showClearChatDialog = true" severity="secondary" outlined size="small" icon="pi pi-edit"
          label="New Ask"
          class="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" />
      </div>

      <!-- Welcome Message (shown when no messages) -->
      <div v-if="messages.length === 0" class="flex items-center justify-center bg-transparent px-4 py-8">
        <div class="text-center bg-transparent">
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-sparkles text-white text-2xl"></i>
          </div>
          <p class="text-gray-600 mb-8">Tell us what you need, and we'll handle the rest.</p>

          <!-- Input Area -->
          <div class="mb-12 pb-8 md:mb-16 md:pb-12">
            <div
              class="bg-gray-900/20 backdrop-blur-md rounded-xl pl-4 relative flex items-center border-2 border-transparent"
              style="background: linear-gradient(to bottom right, rgba(17, 24, 39, 0.2), rgba(17, 24, 39, 0.2)) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box;">
              <!-- Text Input -->
              <textarea v-model="inputMessage" placeholder="Ask anything" rows="2" type="text"
                class="flex-1 bg-transparent text-white placeholder-gray-300 border-0 focus:ring-0 focus:border-0 focus:outline-none text-base"
                @keydown.enter.prevent="handleKeyDown" />

              <!-- Microphone Icon -->
              <button @click="toggleVoice"
                class="bg-black/80 backdrop-blur-md p-4 rounded-full text-white hover:bg-black/90 hover:backdrop-blur-lg rounded-lg w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg border border-white/20">
                <i class="pi pi-microphone text-lg"></i>
              </button>
            </div>
          </div>

          <!-- Automation Toggle -->
          <div
            class="mt-8 flex items-center justify-center gap-3 mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 glass-gradient-border hover:bg-white/30 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <i class="pi pi-bolt text-blue-600 text-lg group-hover:text-blue-700 transition-colors duration-300"></i>
            <span
              class="text-gray-800 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-300">Automation
              Mode</span>
            <ToggleButton v-model="automationMode" onLabel="ON" offLabel="OFF"
              class="p-0 hover:scale-105 transition-transform duration-300" />
          </div>

          <!-- Template Quick Actions (when automation is on) -->
          <div v-if="automationMode && templates.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">🚀 Quick Deploy Templates</h3>
              <Button @click="showTemplateEditor = true" severity="secondary" outlined size="small"
                class="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <i class="pi pi-cog mr-2"></i>
                Manage Templates
              </Button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button v-for="template in templates" :key="template.id" @click="deployTemplateQuick(template)"
                :disabled="deployingTemplate"
                class="p-3 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-lg transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed relative border-2 border-transparent bg-gradient-to-br from-white via-blue-50 to-purple-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none hover:origin-top-left hover:-translate-y-1 hover:rotate-0.5 hover:shadow-lg hover:border-primary-blue"
                style="background: linear-gradient(to bottom right, white, #dbeafe, #f3e8ff) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box;">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 group-hover:text-blue-600">{{ template.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ template.propertyCount }} properties</p>
                    <div v-if="template.custom"
                      class="inline-block px-2 py-1 mt-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                      Custom
                    </div>
                  </div>
                  <i class="pi pi-bolt text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              </button>
            </div>
          </div>

          <!-- Suggested Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button v-for="suggestion in suggestions" :key="suggestion.text" @click="handleSuggestion(suggestion.text)"
              class="p-4 bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 text-left glass-gradient-border-light group focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none hover:origin-top-left hover:-translate-y-1 hover:rotate-0.5 hover:shadow-lg hover:bg-white/40 hover:border-primary-blue">
              <div class="flex items-start gap-3">
                <i :class="suggestion.icon"
                  class="text-blue-500 text-lg mt-1 group-hover:text-blue-600 transition-colors duration-300"></i>
                <div>
                  <p class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{
                    suggestion.title }}</p>
                  <p class="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">{{
                    suggestion.description }}</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap justify-center gap-3">
            <button v-for="action in quickActions" :key="action.label"
              @click="handleSuggestion(action.prompt, action.action)"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-sm text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none hover:origin-top-left hover:-translate-y-0.5 hover:rotate-0.25 hover:shadow-lg hover:border-primary-blue">
              <i :class="action.icon" class="text-sm"></i>
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div v-else class="scrollbar-auto-hide space-y-6 py-4 px-4">
        <div v-for="(message, index) in messages" :key="index" :class="[
          'flex gap-4 animate-slide-in',
          message.role === 'user' ? 'justify-end' : 'justify-start'
        ]">
          <!-- AI Avatar -->
          <div v-if="message.role === 'assistant'" class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <i class="pi pi-sparkles text-white text-sm"></i>
            </div>
          </div>

          <!-- Message Content -->
          <div :class="[
            'max-w-3xl',
            message.role === 'user'
              ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-3'
              : 'bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3'
          ]">
            <div v-if="message.role === 'assistant' && message.thinking" class="mb-3">
              <div class="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <div class="flex space-x-1">
                  <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                  <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                  <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                </div>
                <span>Thinking...</span>
              </div>
            </div>

            <div v-html="formatMessage(message.content)"></div>

            <!-- Schema Actions -->
            <div v-if="message.schema"
              class="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <i class="pi pi-database text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      {{ message.individual_schemas ? 'Individual Database Schemas' : 'Database Schema Ready' }}
                    </h4>
                    <p class="text-sm text-gray-600">
                      {{ message.individual_schemas
                        ? 'Multiple schemas generated for separate databases'
                        : 'Review and customize your database schema' }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button @click="openSchemaInModal(message)" severity="secondary" outlined size="small"
                    class="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <i class="pi pi-external-link mr-2"></i>
                    Open Editor
                  </Button>
                  <Button @click="copySchema(message.schema)" severity="secondary" text size="small"
                    class="hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <i class="pi pi-copy"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- User Avatar -->
          <div v-if="message.role === 'user'" class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-gray-600 text-sm"></i>
            </div>
          </div>
        </div>

        <!-- Loading Message -->
        <div v-if="loading" class="flex gap-4">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <i class="pi pi-sparkles text-white text-sm"></i>
            </div>
          </div>
          <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
            <div class="flex items-center gap-2 text-gray-500">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span class="text-sm">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Template Editor Drawer -->
    <Drawer v-model:visible="showTemplateEditor" :position="isMobile ? 'bottom' : 'right'"
      class="modern-template-drawer" :style="isMobile ? { height: '90vh' } : { width: '95vw', maxWidth: '1400px' }"
      :pt="templateDrawerPT">
      <template #header>
        <div class="w-full">
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
              <i class="pi pi-objects-column text-white text-lg md:text-xl"></i>
            </div>
            <div class="text-center md:text-left">
              <h2 class="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">Template Manager</h2>
              <p class="text-white/80 mt-1 text-sm md:text-base">Create, customize, and deploy database templates</p>
            </div>
          </div>
        </div>
      </template>

      <div class="box-border bg-gradient-to-br from-slate-50 to-slate-100">
        <TemplateEditor @template-deployed="handleTemplateDeployed" />
      </div>
    </Drawer>

    <!-- Database Edit Modal -->
    <DatabaseEditModal v-model:visible="showDatabaseEditModal" :schemas="generatedSchemas"
      @create="handleDatabaseEditCreate" @cancel="handleDatabaseEditCancel" />

    <!-- Multi-Source Edit Modal -->
    <MultiSourceEditModal v-model:visible="showMultiSourceEditModal" :schema="multiSourceSchema"
      @create="handleMultiSourceEditCreate" @cancel="handleMultiSourceEditCancel" />

    <!-- Clear Chat Confirmation Dialog -->
    <Dialog v-model:visible="showClearChatDialog" modal header="Clear Current Chat?" :style="{ width: '400px' }">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-600 text-sm">This will remove all messages and start a new conversation. Your settings
            will be
            preserved.</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Cancel" severity="secondary" outlined @click="showClearChatDialog = false"
            class="hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-300 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" />
          <Button label="Start Fresh Chat" severity="danger" @click="clearChat"
            class="hover:bg-red-600 hover:border-red-600 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" />
        </div>
      </template>
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import InputGroup from 'primevue/inputgroup'
import Toast from 'primevue/toast'
import ToggleButton from 'primevue/togglebutton'
import Drawer from 'primevue/drawer'
import Dialog from 'primevue/dialog'
import TemplateEditor from '../components/TemplateEditor.vue'
import DatabaseEditModal from '../components/DatabaseEditModal.vue'
import MultiSourceEditModal from '../components/MultiSourceEditModal.vue'
import AnimatedBackground from '../components/AnimatedBackground.vue'

const toast = useToast()

// Reactive data
const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const creatingDatabase = ref(false)
const automationMode = ref(false)
const templates = ref([])
const deployingTemplate = ref(false)
const showTemplateEditor = ref(false)

// Schema editing state (removed - now using modals)

// Database edit modal variables
const showDatabaseEditModal = ref(false)
const generatedSchemas = ref([])

// Multi-source edit modal variables
const showMultiSourceEditModal = ref(false)
const multiSourceSchema = ref({})

// Clear chat dialog
const showClearChatDialog = ref(false)

// Mobile detection
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
})

// Template Drawer Passthrough Configuration
const templateDrawerPT = {
  root: {
    class: 'rounded-3xl shadow-2xl border border-white/10 backdrop-blur-sm bg-white/95'
  },
  header: {
    class: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-3xl px-6 pt-4 pb-4'
  },
  content: {
    class: 'bg-gradient-to-br from-slate-50 to-slate-100 rounded-b-3xl'
  }
}

// Watch automation mode toggle to load templates
watch(automationMode, async (newValue) => {
  if (newValue && templates.value.length === 0) {
    await loadTemplates()
  }
})

// Suggestions and quick actions
const suggestions = ref([
  {
    icon: 'pi pi-database',
    title: 'Create Project Management System',
    description: 'Generate a comprehensive project management system',
    text: 'Create a comprehensive project management system with projects, tasks, team members, and milestones'
  },
  {
    icon: 'pi pi-users',
    title: 'Customer Management System',
    description: 'Build a complete CRM system',
    text: 'Create a comprehensive customer relationship management system with customers, interactions, and sales tracking'
  },
  {
    icon: 'pi pi-book',
    title: 'Content Management System',
    description: 'Organize articles, resources, and documentation',
    text: 'Create a comprehensive content management system with articles, categories, authors, and publishing workflow'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Analytics Dashboard System',
    description: 'Track metrics and performance data',
    text: 'Create a comprehensive analytics system with metrics, reports, dashboards, and data sources'
  }
])

const quickActions = ref([
  { icon: 'pi pi-calendar', label: 'Event System', prompt: 'Create a comprehensive event management system with events, attendees, and venues' },
  { icon: 'pi pi-shopping-cart', label: 'Inventory System', prompt: 'Create a comprehensive inventory management system with products, suppliers, and stock tracking' },
  { icon: 'pi pi-graduation-cap', label: 'Learning System', prompt: 'Create a comprehensive learning management system with courses, students, and progress tracking' },
  { icon: 'pi pi-heart', label: 'Wellness System', prompt: 'Create a comprehensive wellness tracking system with habits, goals, and health metrics' },
  { icon: 'pi pi-store', label: 'E-Commerce System', prompt: 'Create a comprehensive e-commerce system with products, orders, and customers', action: 'ecommerce' },
  { icon: 'pi pi-th-large', label: 'E-Com Individual', prompt: 'Create a comprehensive e-commerce system with products, orders, and customers as individual data sources', action: 'individual_ecommerce' }
])

// Methods
const handleSuggestion = (text, action = null) => {
  if (action === 'ecommerce') {
    createEcommerceSystem()
  } else if (action === 'individual_ecommerce') {
    createIndividualEcommerceSchemas()
  } else {
    inputMessage.value = text
    sendMessage()
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    sendMessage()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = {
    id: Date.now() + Math.random(),
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const currentMessage = inputMessage.value.trim()
  inputMessage.value = ''
  loading.value = true

  try {
    // If automation mode is on, try smart suggestion first
    if (automationMode.value) {
      const smartSuggestion = await getSmartSuggestion(currentMessage)
      if (smartSuggestion && smartSuggestion.confidence > 0.8) {
        // Auto-deploy template with high confidence
        await deployTemplateById(smartSuggestion.suggestedTemplate, {
          title: smartSuggestion.customizations?.title || currentMessage,
          ...smartSuggestion.customizations
        })
        return
      }
    }

    // Check if user wants individual schemas for e-commerce
    const isEcommerceIndividualRequest = currentMessage.toLowerCase().includes('e-commerce') &&
      (currentMessage.toLowerCase().includes('individual') ||
        currentMessage.toLowerCase().includes('separate') ||
        currentMessage.toLowerCase().includes('data sources'))

    // Check if user wants multi-source database creation
    const isMultiSourceRequest = (currentMessage.toLowerCase().includes('database') ||
      currentMessage.toLowerCase().includes('system') ||
      currentMessage.toLowerCase().includes('management')) &&
      (currentMessage.toLowerCase().includes('multi') ||
        currentMessage.toLowerCase().includes('multiple') ||
        currentMessage.toLowerCase().includes('system') ||
        currentMessage.toLowerCase().includes('comprehensive') ||
        currentMessage.toLowerCase().includes('events') ||
        currentMessage.toLowerCase().includes('attendees') ||
        currentMessage.toLowerCase().includes('venues') ||
        currentMessage.toLowerCase().includes('products') ||
        currentMessage.toLowerCase().includes('customers') ||
        currentMessage.toLowerCase().includes('orders'))

    // Call appropriate API based on request type
    let response, data
    if (isEcommerceIndividualRequest) {
      // Use individual schema generator for separate database schemas
      response = await fetch('/.netlify/functions/individual-schema-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage
        })
      })
    } else if (isMultiSourceRequest) {
      // Use multi-source schema generator for comprehensive systems
      response = await fetch('/.netlify/functions/multi-source-schema-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage,
          availableTemplates: templates.value.map(template => ({
            id: template.id,
            title: template.title,
            description: template.description,
            properties: template.properties,
            propertyCount: template.propertyCount
          }))
        })
      })
    } else {
      // Use regular Gemini chat
      response = await fetch('/.netlify/functions/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMessage,
          context: 'notion_database_schema'
        })
      })
    }

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    data = await response.json()

    // Handle multi-source schema response
    if (isMultiSourceRequest && data.schema) {
      // Transform the schema to match the modal's expected format
      const transformedSchema = transformSchemaForModal(data.schema)

      // Show the multi-source edit modal
      multiSourceSchema.value = transformedSchema
      showMultiSourceEditModal.value = true

      // Add a message indicating the modal is open
      const modalMessage = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        content: `🎯 **Database Schema Generated!**

I've created a comprehensive database schema for your request. Please review and customize the schema in the modal that just opened, then click "Create Databases" when you're ready.

**Generated System:** ${data.schema.title || 'Custom Database System'}
**Description:** ${data.schema.description || 'A comprehensive database system tailored to your needs'}

The modal allows you to:
- Edit system title and description
- Modify data sources and their properties
- Add or remove properties for each data source
- Customize property types and options

Once you're satisfied with the configuration, the system will create all databases in your Notion workspace.`,
        timestamp: new Date()
      }
      messages.value.push(modalMessage)
      return
    }

    const aiMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: data.content,
      schema: data.schema || null,
      individual_schemas: data.individual_schemas || false,
      type: data.type || 'single',
      timestamp: new Date()
    }

    messages.value.push(aiMessage)

  } catch (error) {
    console.error('Error sending message:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to get AI response. Please try again.',
      life: 5000
    })

    messages.value.push({
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: 'I apologize, but I encountered an error processing your request. <button onclick="window.location.reload()" class="text-blue-500 underline hover:text-blue-700 cursor-pointer">Please try again</button>.',
      timestamp: new Date()
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// Transform schema from backend format to modal format
const transformSchemaForModal = (schema) => {
  console.log('Original schema:', schema)

  return {
    title: schema.title || '',
    description: schema.description || '',
    dataSources: schema.dataSources ? schema.dataSources.map(dataSource => {
      console.log('Processing data source:', dataSource)

      const transformedDataSource = {
        name: dataSource.name || '',
        description: dataSource.description || '',
        properties: []
      }

      if (dataSource.properties && typeof dataSource.properties === 'object') {
        transformedDataSource.properties = Object.entries(dataSource.properties).map(([propName, propConfig]) => {
          console.log('Processing property:', propName, propConfig)

          // Determine the property type from the config
          let propType = 'rich_text' // default
          let options = ''
          let format = 'number'

          if (propConfig.title) {
            propType = 'title'
          } else if (propConfig.rich_text) {
            propType = 'rich_text'
          } else if (propConfig.number) {
            propType = 'number'
            format = propConfig.number.format || 'number'
          } else if (propConfig.select) {
            propType = 'select'
            options = propConfig.select.options ? propConfig.select.options.map(opt => opt.name).join('\n') : ''
          } else if (propConfig.multi_select) {
            propType = 'multi_select'
            options = propConfig.multi_select.options ? propConfig.multi_select.options.map(opt => opt.name).join('\n') : ''
          } else if (propConfig.date) {
            propType = 'date'
          } else if (propConfig.people) {
            propType = 'people'
          } else if (propConfig.files) {
            propType = 'files'
          } else if (propConfig.checkbox) {
            propType = 'checkbox'
          } else if (propConfig.url) {
            propType = 'url'
          } else if (propConfig.email) {
            propType = 'email'
          } else if (propConfig.phone_number) {
            propType = 'phone_number'
          } else if (propConfig.created_time) {
            propType = 'created_time'
          } else if (propConfig.created_by) {
            propType = 'created_by'
          } else if (propConfig.last_edited_time) {
            propType = 'last_edited_time'
          } else if (propConfig.last_edited_by) {
            propType = 'last_edited_by'
          }

          return {
            name: propName,
            type: propType,
            options: options,
            format: format
          }
        })
      }

      console.log('Transformed data source:', transformedDataSource)
      return transformedDataSource
    }) : []
  }
}


const copySchema = async (schema) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
    toast.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Schema copied to clipboard',
      life: 3000
    })
  } catch (error) {
    console.error('Error copying schema:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to copy schema',
      life: 3000
    })
  }
}

const openSchemaInModal = (message) => {
  if (message.individual_schemas) {
    // For individual schemas, use the DatabaseEditModal
    generatedSchemas.value = message.schema
    showDatabaseEditModal.value = true
  } else {
    // For single schemas, transform and use MultiSourceEditModal
    const transformedSchema = transformSchemaForModal(message.schema)
    multiSourceSchema.value = transformedSchema
    showMultiSourceEditModal.value = true
  }
}


const createIndividualEcommerceSchemas = async () => {
  try {
    // Add user message to chat
    const userMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      content: 'Create a comprehensive e-commerce system with products, orders, and customers as individual data sources',
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    // Generate individual schemas
    const response = await fetch('/.netlify/functions/individual-schema-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Create a comprehensive e-commerce system with products, orders, and customers as individual data sources'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate individual schemas')
    }

    const data = await response.json()

    // Store generated schemas and show edit modal
    generatedSchemas.value = data.schema

    // Remove loading message
    messages.value.pop()

    // Show edit modal
    showDatabaseEditModal.value = true

  } catch (error) {
    console.error('Error generating schemas:', error)

    // Remove loading message if it exists
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].content.includes('individual e-commerce')) {
      messages.value.pop()
    }

    const errorMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `❌ **Failed to generate database schemas**

I encountered an error while generating your individual e-commerce database schemas. This could be due to:

- API configuration issues
- Network connectivity problems
- Service unavailability

**Please try:**
1. Check your internet connection
2. Try again in a few moments
3. Contact support if the problem persists`,
      timestamp: new Date()
    }
    messages.value.push(errorMessage)

    toast.add({
      severity: 'error',
      summary: 'Generation Failed',
      detail: 'Failed to generate database schemas. Please try again.',
      life: 8000
    })
  }
}

const createEcommerceSystem = async () => {
  creatingDatabase.value = true

  try {
    // Add user message to chat
    const userMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      content: 'Create a comprehensive e-commerce system with products, orders, and customers',
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    // Generate the e-commerce schema using Gemini
    const schemaResponse = await fetch('/.netlify/functions/multi-source-schema-generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Create a comprehensive e-commerce database system with multiple data sources for products, orders, customers, and inventory management. Include product categories, pricing, stock levels, order tracking, customer information, and payment processing.'
      })
    })

    if (!schemaResponse.ok) {
      throw new Error('Failed to generate e-commerce schema')
    }

    const schemaData = await schemaResponse.json()
    const schema = schemaData.schema

    // Transform the schema to match the modal's expected format
    const transformedSchema = transformSchemaForModal(schema)

    // Remove loading message
    messages.value.pop()

    // Show the edit modal with the transformed schema
    multiSourceSchema.value = transformedSchema
    showMultiSourceEditModal.value = true

  } catch (error) {
    console.error('Error creating system:', error)

    // Remove loading message if it exists
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].content.includes('Creating your e-commerce system')) {
      messages.value.pop()
    }

    const errorMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `❌ **Failed to create e-commerce system**

I encountered an error while setting up your e-commerce system. This could be due to:

- Notion API configuration issues
- Network connectivity problems
- Insufficient permissions

**Please try:**
1. Check your Notion integration settings
2. Ensure you have the necessary permissions
3. Try again in a few moments

If the problem persists, please contact support.`,
      timestamp: new Date()
    }
    messages.value.push(errorMessage)

    toast.add({
      severity: 'error',
      summary: 'Creation Failed',
      detail: 'Failed to create e-commerce system. Please try again.',
      life: 8000
    })
  } finally {
    creatingDatabase.value = false
    await nextTick()
    scrollToBottom()
  }
}

const formatMessage = (content) => {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/\n/g, '<br>')
}

const attachFile = () => {
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'File attachment feature will be available soon!',
    life: 3000
  })
}

const toggleVoice = () => {
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Voice input feature will be available soon!',
    life: 3000
  })
}

const scrollToBottom = () => {
  // Scroll to bottom of messages
  const messagesContainer = document.querySelector('.overflow-y-auto')
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

// Automation methods
const loadTemplates = async () => {
  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list_templates' })
    })

    const data = await response.json()
    templates.value = data.templates || []
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const getSmartSuggestion = async (userInput) => {
  try {
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'smart_suggest',
        payload: { userInput }
      })
    })

    return await response.json()
  } catch (error) {
    console.error('Error getting smart suggestion:', error)
    return null
  }
}

const deployTemplateById = async (templateId, customizations = {}) => {
  console.log('Deploying template by ID:', templateId, customizations)
  deployingTemplate.value = true

  try {
    // First, get the template schema to show in modal
    const templateResponse = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_template_schema',
        payload: { templateId }
      })
    })

    console.log('Template response:', templateResponse)

    if (templateResponse.ok) {
      const templateData = await templateResponse.json()
      console.log('Template data:', templateData)

      if (templateData.schema) {
        // Transform the template schema to match the modal's expected format
        const transformedSchema = transformSchemaForModal(templateData.schema)
        console.log('Transformed schema:', transformedSchema)

        // Apply customizations
        if (customizations.title) {
          transformedSchema.title = customizations.title
        }
        if (customizations.description) {
          transformedSchema.description = customizations.description
        }

        // Show the multi-source edit modal for template customization
        multiSourceSchema.value = transformedSchema
        showMultiSourceEditModal.value = true
        console.log('Modal should be visible now:', showMultiSourceEditModal.value)

        return
      }
    }

    // Fallback to direct deployment if schema retrieval fails
    const response = await fetch('/.netlify/functions/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deploy_template',
        payload: {
          templateId,
          customizations,
          includeSampleData: true
        }
      })
    })

    const data = await response.json()

    if (data.database) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `Database "${data.database.title}" created automatically!`,
        life: 5000
      })

      // Add success message to chat
      messages.value.push({
        id: Date.now() + Math.random(),
        role: 'assistant',
        content: `🚀 **Automation Success!** I've automatically created the "${data.database.title}" database for you based on your request. You can access it at: <a href="${data.database.url}" target="_blank" class="text-blue-500 underline hover:text-blue-700">${data.database.url}</a>`,
        timestamp: new Date()
      })
    }
  } catch (error) {
    console.error('Error deploying template:', error)
    toast.add({
      severity: 'error',
      summary: 'Automation Error',
      detail: 'Failed to auto-deploy template',
      life: 5000
    })
  } finally {
    deployingTemplate.value = false
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

const deployTemplateQuick = async (template) => {
  console.log('Deploying template quick:', template)
  await deployTemplateById(template.id)
}

const handleTemplateDeployed = (database) => {
  // Add success message to chat
  messages.value.push({
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: `✅ Template deployed successfully! Database "${database.title}" is now available in your Notion workspace. <a href="${database.url}" target="_blank" class="text-blue-500 underline hover:text-blue-700">Open in Notion</a>`,
    timestamp: new Date()
  })

  showTemplateEditor.value = false
  scrollToBottom()
}

// Handle database edit modal events
const handleDatabaseEditCreate = async (schemas) => {
  showDatabaseEditModal.value = false
  creatingDatabase.value = true

  try {
    // Update loading message to show database creation progress
    const loadingMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: 'Creating individual databases in Notion...',
      timestamp: new Date()
    }
    messages.value.push(loadingMessage)

    // Create the databases
    const createdDatabases = []
    for (const schema of schemas) {
      try {
        const createResponse = await fetch('/.netlify/functions/create-notion-database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ schema })
        })

        if (createResponse.ok) {
          const createData = await createResponse.json()
          createdDatabases.push({
            name: schema.title,
            url: createData.url,
            id: createData.id,
            properties: createData.properties
          })
        }
      } catch (error) {
        console.error(`Failed to create ${schema.title}:`, error)
      }
    }

    // Remove loading message
    messages.value.pop()

    const successMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `✅ **Individual E-Commerce Databases Created!**

🛍️ **Your separate e-commerce database system is ready:**

Successfully created the following databases in Notion:

${createdDatabases.map(db => `• **${db.name}**: [Database Link](${db.url})`).join('\n')}

**System Features:**
- **Products Database**: Product catalog with categories, pricing, and inventory
- **Orders Database**: Order management with status tracking and payment methods
- **Customers Database**: Customer relationship management with contact info

**Next Steps:**
1. Visit the database links above to start adding data
2. Customize categories, payment methods, and order statuses
3. Set up inventory alerts and reorder points
4. Add sample data to get started

Your individual e-commerce system is now live and ready to use! 🚀`,
      timestamp: new Date()
    }
    messages.value.push(successMessage)

    toast.add({
      severity: 'success',
      summary: 'Databases Created',
      detail: `${createdDatabases.length} individual e-commerce databases created successfully!`,
      life: 8000
    })

  } catch (error) {
    console.error('Error creating databases:', error)

    // Remove loading message if it exists
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].content.includes('Creating individual databases')) {
      messages.value.pop()
    }

    const errorMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `❌ **Failed to create individual databases**

I encountered an error while creating your individual e-commerce databases. This could be due to:

- Notion API configuration issues
- Network connectivity problems
- Insufficient permissions

**Please try:**
1. Check your Notion integration settings
2. Ensure you have the necessary permissions
3. Try again in a few moments

If the problem persists, please contact support.`,
      timestamp: new Date()
    }
    messages.value.push(errorMessage)

    toast.add({
      severity: 'error',
      summary: 'Creation Failed',
      detail: 'Failed to create individual databases. Please try again.',
      life: 8000
    })
  } finally {
    creatingDatabase.value = false
    await nextTick()
    scrollToBottom()
  }
}

const handleDatabaseEditCancel = () => {
  showDatabaseEditModal.value = false

  const cancelMessage = {
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: 'Database creation cancelled. You can try again anytime by clicking the "E-Com Individual" button.',
    timestamp: new Date()
  }
  messages.value.push(cancelMessage)

  toast.add({
    severity: 'info',
    summary: 'Creation Cancelled',
    detail: 'Database creation has been cancelled',
    life: 3000
  })
}

// Multi-source edit modal handlers
const handleMultiSourceEditCreate = async (schema) => {
  showMultiSourceEditModal.value = false
  creatingDatabase.value = true

  try {
    // Create the system with separate databases
    const createResponse = await fetch('/.netlify/functions/create-multi-source-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ schema, mode: 'separate' })
    })

    if (!createResponse.ok) {
      throw new Error('Failed to create system')
    }

    const createData = await createResponse.json()

    // Remove loading message
    messages.value.pop()

    // Check if there were any errors
    if (createData.hasErrors) {
      const errorMessage = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        content: `⚠️ **E-Commerce System Created with Some Issues**

🛍️ **Your e-commerce system has been created, but there were some issues:**

**Successfully Created Databases:**
${createData.databases.filter(db => !db.status || db.status !== 'error').map(db => `- **${db.name}**: [Database Link](${db.url})`).join('\n')}

**Failed Databases:**
${createData.errors.map(error => `- **${error.name}**: ${error.error}`).join('\n')}

**What This Means:**
- Some databases were created successfully and are ready to use
- Some databases failed to create due to API issues
- You can retry creating the failed databases

**Next Steps:**
1. Visit the successfully created databases to start using them
2. Try creating the e-commerce system again to create the missing databases
3. Contact support if the issue persists

The system is partially ready - you can start with the databases that were created successfully! 🚀`,
        timestamp: new Date()
      }
      messages.value.push(errorMessage)

      toast.add({
        severity: 'warn',
        summary: 'Partial Success',
        detail: `${createData.databases.filter(db => !db.status || db.status !== 'error').length} databases created, ${createData.errors.length} failed`,
        life: 10000
      })
    } else {
      const successMessage = {
        id: Date.now() + Math.random(),
        role: 'assistant',
        content: `✅ **${schema.title || 'System'} Created Successfully!**

🎯 **Your ${schema.title || 'system'} is ready with separate databases:**

**Created Databases:**
${createData.databases.map(db => `- **${db.name}**: [Database Link](${db.url})`).join('\n')}

**Database Structure:**
Each database has been created with the following columns:
${createData.databases.map(db => `\n**${db.name} Database:**\n${db.properties ? db.properties.map(prop => `  • ${prop}`).join('\n') : '  • Columns not available'}`).join('\n')}

**How to Use:**
1. Each database is independent and optimized for its entity type
2. Use relations between databases to connect related data
3. Create views within each database to organize your data
4. Add more entries using the appropriate database

**Next Steps:**
1. Visit each database to see your ${schema.title || 'system'}
2. Add more data to their respective databases
3. Set up relations between databases if needed
4. Customize categories, statuses, and other options as needed

Your ${schema.title || 'system'} is now live and ready to use! 🚀`,
        timestamp: new Date()
      }
      messages.value.push(successMessage)

      toast.add({
        severity: 'success',
        summary: `${schema.title || 'System'} Created`,
        detail: `${createData.databases.length} separate ${schema.title ? schema.title.toLowerCase() : 'system'} databases created successfully!`,
        life: 8000
      })
    }

  } catch (error) {
    console.error('Error creating system:', error)

    // Remove loading message
    messages.value.pop()

    const errorMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `❌ **Failed to create e-commerce system**

I encountered an error while creating your e-commerce system. This could be due to:

- API configuration issues
- Network connectivity problems
- Service unavailability

**Please try:**
1. Check your internet connection
2. Try again in a few moments
3. Contact support if the problem persists`,
      timestamp: new Date()
    }
    messages.value.push(errorMessage)

    toast.add({
      severity: 'error',
      summary: 'Creation Failed',
      detail: 'Failed to create e-commerce system. Please try again.',
      life: 8000
    })
  } finally {
    creatingDatabase.value = false
    await nextTick()
    scrollToBottom()
  }
}

const handleMultiSourceEditCancel = () => {
  showMultiSourceEditModal.value = false

  const cancelMessage = {
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: 'E-commerce system creation cancelled. You can try again anytime by clicking the "E-Com System" button.',
    timestamp: new Date()
  }
  messages.value.push(cancelMessage)

  toast.add({
    severity: 'info',
    summary: 'Creation Cancelled',
    detail: 'E-commerce system creation has been cancelled',
    life: 3000
  })

  scrollToBottom()
}

// Clear chat functionality
const clearChat = () => {
  // Clear all messages
  messages.value = []

  // Clear database edit modal state
  showDatabaseEditModal.value = false
  generatedSchemas.value = []

  // Clear multi-source edit modal state
  showMultiSourceEditModal.value = false
  multiSourceSchema.value = {}

  // Close the confirmation dialog
  showClearChatDialog.value = false

  // Show success toast
  toast.add({
    severity: 'success',
    summary: 'Chat Cleared',
    detail: 'Your chat has been cleared. You can start a new conversation!',
    life: 3000
  })

  // Focus on input after clearing
  nextTick(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
    }
  })
}

onMounted(async () => {
  // Focus input on mount
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.focus()
  }

  // Load templates for automation mode
  await loadTemplates()
})
</script>

<style scoped>
/* Template buttons now use Tailwind classes and inline styles */
/* Glass gradient border for automation toggle */
.glass-gradient-border {
  position: relative;
  background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)) padding-box,
    linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3)) border-box;
  border: 1px solid transparent;
}

.glass-gradient-border:hover {
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)) padding-box,
    linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4)) border-box;
  transform: translateY(-1px);
}

/* Gradient border for chat input */
.gradient-border {
  position: relative;
  background: linear-gradient(transparent, transparent) padding-box,
    linear-gradient(135deg, #3b82f6, #8b5cf6) border-box;
  border: 2px solid transparent;
}

.gradient-border:hover {
  background: linear-gradient(transparent, transparent) padding-box,
    linear-gradient(135deg, #2563eb, #7c3aed) border-box;
  transform: translateY(-1px);
}

/* Light glass gradient border for suggested actions */
.glass-gradient-border-light {
  position: relative;
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)) padding-box,
    linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2)) border-box;
  border: 1px solid transparent;
}

.glass-gradient-border-light:hover {
  background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)) padding-box,
    linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3)) border-box;
  transform: translateY(-1px);
}

/* Responsive design for template drawer */
@media (max-width: 768px) {
  :deep(.modern-template-drawer .p-drawer) {
    width: 98vw !important;
    max-width: 98vw !important;
    margin: 0.5rem;
  }
}
</style>
