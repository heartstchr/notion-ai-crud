<template>
  <div class="chat-view min-h-screen bg-gray-50">

    <!-- Chat Container -->
    <div class="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-88px)]">

      <!-- Welcome Message (shown when no messages) -->
      <div v-if="messages.length === 0" class="flex-1 flex items-center justify-center">
        <div class="text-center max-w-2xl">
          <div
            class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="pi pi-sparkles text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Hi, there 👋</h2>
          <p class="text-gray-600 mb-8">Tell us what you need, and we'll handle the rest.</p>

          <!-- Automation Toggle -->
          <div class="flex items-center justify-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <i class="pi pi-bolt text-blue-500"></i>
            <span class="text-blue-700 font-medium">Automation Mode</span>
            <ToggleButton v-model="automationMode" onLabel="ON" offLabel="OFF" class="p-0" />
          </div>

          <!-- Template Quick Actions (when automation is on) -->
          <div v-if="automationMode && templates.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">🚀 Quick Deploy Templates</h3>
              <Button @click="showTemplateEditor = true" severity="secondary" outlined size="small">
                <i class="pi pi-cog mr-2"></i>
                Manage Templates
              </Button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button v-for="template in templates" :key="template.id" @click="deployTemplateQuick(template)"
                :disabled="deployingTemplate"
                class="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left group disabled:opacity-50">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 group-hover:text-blue-600">{{ template.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ template.propertyCount }} properties</p>
                    <div v-if="template.custom"
                      class="inline-block px-2 py-1 mt-1 text-xs bg-blue-100 text-blue-700 rounded-full">
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
              class="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left">
              <div class="flex items-start gap-3">
                <i :class="suggestion.icon" class="text-blue-500 text-lg mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">{{ suggestion.title }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ suggestion.description }}</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap justify-center gap-3">
            <button v-for="action in quickActions" :key="action.label" @click="handleSuggestion(action.prompt)"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">
              <i :class="action.icon" class="text-sm"></i>
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div v-else class="flex-1 overflow-y-auto space-y-6 py-4">
        <div v-for="(message, index) in messages" :key="index" :class="[
          'flex gap-4',
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

            <!-- Schema Preview -->
            <div v-if="message.schema" class="mt-4 p-3 bg-gray-50 rounded-lg border">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Generated Schema Preview</h4>
                <div>
                  <Button v-if="!editingSchemaId || editingSchemaId !== message.id"
                    @click="startEditingSchema(message.schema, message.id)" severity="secondary" size="small" text
                    class="p-1">
                    <i class="pi pi-pencil text-xs"></i>
                  </Button>
                  <Button @click="copySchema(message.schema)" severity="secondary" size="small" text>
                    <i class="pi pi-copy"></i>
                  </Button>
                </div>
              </div>

              <!-- Editable Schema Canvas -->
              <div v-if="editingSchemaId === message.id" class="mb-3">
                <textarea v-model="editingSchemaText"
                  class="w-full h-64 p-3 text-xs font-mono bg-white border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Edit your schema JSON here..."></textarea>
                <div class="flex gap-2 mt-2">
                  <Button @click="saveEditedSchema(message.id)" size="small" class="flex-1">
                    <i class="pi pi-check mr-2"></i>
                    Save Changes
                  </Button>
                  <Button @click="cancelEditingSchema" severity="secondary" size="small" text>
                    <i class="pi pi-times mr-2"></i>
                    Cancel
                  </Button>
                </div>
              </div>

              <!-- Static Schema Display -->
              <pre v-else
                class="text-xs text-gray-600 overflow-x-auto">{{ JSON.stringify(message.schema, null, 2) }}</pre>

              <div class="flex gap-2 mt-3">
                <Button @click="createNotionDatabase(message.schema)" :loading="creatingDatabase" size="small"
                  class="flex-1">
                  <i class="pi pi-plus mr-2"></i>
                  Create in Notion
                </Button>
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

      <!-- Input Area -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <div class="relative">
          <!-- Gradient Border -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-0.5">
            <div class="bg-white rounded-xl h-full w-full"></div>
          </div>

          <div class="relative z-10 bg-white rounded-xl p-4">
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <Textarea v-model="inputMessage" placeholder="Ask me anything..." :rows="1" :autoResize="true"
                  class="w-full border-0 focus:ring-0 resize-none" @keydown.enter.prevent="handleKeyDown" />
              </div>
              <div class="flex gap-2">
                <Button @click="attachFile" severity="secondary" text class="p-2">
                  <i class="pi pi-paperclip"></i>
                </Button>
                <Button @click="toggleVoice" severity="secondary" text class="p-2">
                  <i class="pi pi-microphone"></i>
                </Button>
                <Button @click="sendMessage" :disabled="!inputMessage.trim() || loading"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50">
                  <i class="pi pi-send"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Editor Dialog -->
    <Dialog v-model:visible="showTemplateEditor" header="Template Manager" modal class="w-full max-w-6xl"
      :dismissableMask="false">
      <TemplateEditor @template-deployed="handleTemplateDeployed" />
    </Dialog>

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToggleButton from 'primevue/togglebutton'
import Dialog from 'primevue/dialog'
import TemplateEditor from '../components/TemplateEditor.vue'

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

// Schema editing state
const editingSchema = ref({})
const editingSchemaText = ref('')
const editingSchemaId = ref(null)

// Suggestions and quick actions
const suggestions = ref([
  {
    icon: 'pi pi-database',
    title: 'Create Project Database',
    description: 'Generate a database schema for project management',
    text: 'Create a project management database with tasks, deadlines, and team members'
  },
  {
    icon: 'pi pi-users',
    title: 'Customer Database',
    description: 'Build a CRM database for customer information',
    text: 'Create a customer relationship management database with contacts and interactions'
  },
  {
    icon: 'pi pi-book',
    title: 'Content Library',
    description: 'Organize articles, resources, and documentation',
    text: 'Create a content library database for articles, resources, and documentation'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Analytics Dashboard',
    description: 'Track metrics and performance data',
    text: 'Create an analytics database to track metrics and performance data'
  }
])

const quickActions = ref([
  { icon: 'pi pi-calendar', label: 'Event Calendar', prompt: 'Create an event calendar database' },
  { icon: 'pi pi-shopping-cart', label: 'Inventory', prompt: 'Create an inventory management database' },
  { icon: 'pi pi-graduation-cap', label: 'Course Tracker', prompt: 'Create a course and learning tracker database' },
  { icon: 'pi pi-heart', label: 'Habit Tracker', prompt: 'Create a habit tracking database' }
])

// Methods
const handleSuggestion = (text) => {
  inputMessage.value = text
  sendMessage()
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

    // Call Gemini API to generate schema
    const response = await fetch('/.netlify/functions/gemini-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: currentMessage,
        context: 'notion_database_schema'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()

    const aiMessage = {
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: data.content,
      schema: data.schema || null,
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

const createNotionDatabase = async (schema) => {
  // Prompt for database ID
  const databaseId = prompt('Enter Database ID (optional - leave empty to use default):')

  creatingDatabase.value = true

  try {
    const response = await fetch('/.netlify/functions/create-notion-database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        schema,
        databaseId: databaseId || null
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create database')
    }

    const data = await response.json()

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Database "${data.title}" created successfully in Notion!`,
      life: 5000
    })

    // Add success message to chat
    messages.value.push({
      id: Date.now() + Math.random(),
      role: 'assistant',
      content: `✅ Great! I've successfully created the "${data.title}" database in your Notion workspace. You can access it at: ${data.url}`,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Error creating database:', error)

    let errorMessage = 'Failed to create database in Notion. Please check your integration settings.'

    try {
      const errorData = await error.json()
      if (errorData.details) {
        errorMessage = `${errorData.error}: ${errorData.details}`
      }
    } catch (e) {
      // If we can't parse the error response, use the default message
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 8000
    })
  } finally {
    creatingDatabase.value = false
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

const startEditingSchema = (schema, messageId) => {
  editingSchemaId.value = messageId
  editingSchemaText.value = JSON.stringify(schema, null, 2)
  editingSchema.value = schema
}

const saveEditedSchema = (messageId) => {
  try {
    // Parse the edited JSON
    const parsedSchema = JSON.parse(editingSchemaText.value)

    // Find the message and update its schema
    const messageIndex = messages.value.findIndex(msg => msg.id === messageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex].schema = parsedSchema
    }

    // Clear editing state
    editingSchemaId.value = null
    editingSchemaText.value = ''
    editingSchema.value = {}

    toast.add({
      severity: 'success',
      summary: 'Schema Updated',
      detail: 'Schema has been successfully updated',
      life: 3000
    })

  } catch (error) {
    console.error('Error parsing schema:', error)
    toast.add({
      severity: 'error',
      summary: 'Invalid JSON',
      detail: 'Please check your JSON syntax and try again',
      life: 5000
    })
  }
}

const cancelEditingSchema = () => {
  editingSchemaId.value = null
  editingSchemaText.value = ''
  editingSchema.value = {}

  toast.add({
    severity: 'info',
    summary: 'Edit Cancelled',
    detail: 'Schema editing has been cancelled',
    life: 2000
  })
}

const formatMessage = (content) => {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
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
  deployingTemplate.value = true

  try {
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
        content: `🚀 **Automation Success!** I've automatically created the "${data.database.title}" database for you based on your request. You can access it at: ${data.database.url}`,
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
  await deployTemplateById(template.id)
}

const handleTemplateDeployed = (database) => {
  // Add success message to chat
  messages.value.push({
    id: Date.now() + Math.random(),
    role: 'assistant',
    content: `✅ Template deployed successfully! Database "${database.title}" is now available in your Notion workspace.`,
    timestamp: new Date()
  })

  showTemplateEditor.value = false
  scrollToBottom()
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
/* Custom scrollbar for messages area */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth animations */
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {

  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }

  40%,
  43% {
    transform: translateY(-8px);
  }

  70% {
    transform: translateY(-4px);
  }

  90% {
    transform: translateY(-2px);
  }
}

/* Message animations */
.flex.gap-4 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
