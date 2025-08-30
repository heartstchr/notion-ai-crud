<template>
  <div class="talent-pool">
    <!-- Header -->
    <div class="header">
      <h1>{{ databaseTitle }}</h1>
      <p class="subtitle">Manage your talent pool with dynamic form generation based on your Notion database
        schema</p>

      <div class="header-actions">
        <button @click="refreshSchema" class="btn btn-secondary" :disabled="loading">
          <i class="icon">🔄</i>
          Refresh Schema
        </button>
        <button @click="showAddForm = true" class="btn btn-primary">
          <i class="icon">➕</i>
          Add Talent
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !talents.length" class="loading">
      <div class="spinner"></div>
      <p>Loading talent pool...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-banner">
      <i class="icon">⚠️</i>
      <div>
        <strong>Error:</strong> {{ error }}
        <button @click="retryLoad" class="btn btn-link">Try Again</button>
      </div>
    </div>

    <!-- Add/Edit Form Modal -->
    <div v-if="showAddForm || editingTalent" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingTalent ? 'Edit Talent Profile' : 'Add New Talent' }}</h2>
          <button @click="closeForm" class="btn btn-ghost">✕</button>
        </div>

        <form @submit.prevent="submitForm" class="talent-form">
          <div v-if="formFields.length === 0" class="no-schema">
            <p>No database schema available. Please check your Notion database configuration.</p>
          </div>

          <div v-for="field in formFields" :key="field.name" class="form-group">
            <label :for="field.name" class="form-label">
              {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>

            <!-- Text Input -->
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'tel' || field.type === 'number' || field.type === 'date'"
              :id="field.name" :type="field.type" :placeholder="field.placeholder" :required="field.required"
              :min="field.min" :step="field.step" :pattern="field.pattern" v-model="formData[field.name]"
              class="form-input" :class="{ 'error': formErrors[field.name] }" />

            <!-- Textarea -->
            <textarea v-else-if="field.type === 'textarea'" :id="field.name" :placeholder="field.placeholder"
              :required="field.required" v-model="formData[field.name]" class="form-textarea"
              :class="{ 'error': formErrors[field.name] }" rows="3"></textarea>

            <!-- Select -->
            <select v-else-if="field.type === 'select'" :id="field.name" :required="field.required"
              v-model="formData[field.name]" class="form-select" :class="{ 'error': formErrors[field.name] }">
              <option value="">Select {{ field.label }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <!-- Multi-select -->
            <div v-else-if="field.type === 'multiselect'" class="multiselect-container">
              <div class="selected-tags">
                <span v-for="tag in getSelectedTags(field.name)" :key="tag" class="tag">
                  {{ tag }}
                  <button type="button" @click="removeTag(field.name, tag)" class="tag-remove">×</button>
                </span>
              </div>
              <select @change="addTag(field.name, $event)" class="form-select">
                <option value="">Add {{ field.label }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input type="text" :placeholder="`Type and press Enter to add ${field.label.toLowerCase()}`"
                @keydown.enter.prevent="addCustomTag(field.name, $event)" class="form-input tag-input" />
            </div>

            <!-- Checkbox -->
            <label v-else-if="field.type === 'checkbox'" class="checkbox-label">
              <input :id="field.name" type="checkbox" v-model="formData[field.name]" class="form-checkbox" />
              <span class="checkmark"></span>
              {{ field.label }}
            </label>

            <!-- Error Message -->
            <div v-if="formErrors[field.name]" class="field-error">
              {{ formErrors[field.name] }}
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner small"></span>
              {{ submitting ? 'Saving...' : (editingTalent ? 'Update' : 'Add') }} Talent
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Talent List -->
    <div v-if="!loading || talents.length" class="talent-grid">
      <div v-if="talents.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>No talent profiles yet</h3>
        <p>Start building your talent pool by adding your first profile.</p>
        <button @click="showAddForm = true" class="btn btn-primary">Add First Talent</button>
      </div>

      <div v-for="talent in talents" :key="talent.id" class="talent-card">
        <div class="talent-header">
          <h3>{{ talent.Name || 'Unnamed' }}</h3>
          <div class="talent-actions">
            <button @click="editTalent(talent)" class="btn btn-ghost" title="Edit">
              <i class="icon">✏️</i>
            </button>
            <button @click="deleteTalent(talent.id)" class="btn btn-ghost btn-danger" title="Delete">
              <i class="icon">🗑️</i>
            </button>
          </div>
        </div>

        <div class="talent-details">
          <div v-if="talent.Email" class="detail-item">
            <strong>Email:</strong>
            <a :href="`mailto:${talent.Email}`">{{ talent.Email }}</a>
          </div>

          <div v-if="talent.Phone" class="detail-item">
            <strong>Phone:</strong>
            <a :href="`tel:${talent.Phone}`">{{ talent.Phone }}</a>
          </div>

          <div v-if="talent['Portfolio Link']" class="detail-item">
            <strong>Portfolio:</strong>
            <a :href="talent['Portfolio Link']" target="_blank" rel="noopener noreferrer">
              View Portfolio
            </a>
          </div>

          <div v-if="talent.Skills" class="detail-item">
            <strong>Skills:</strong>
            <div class="skills-tags">
              <span v-for="skill in getSkillsArray(talent.Skills)" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Dynamic fields -->
          <div v-for="[key, value] in getDynamicFields(talent)" :key="key" class="detail-item">
            <strong>{{ formatLabel(key) }}:</strong>
            <span v-if="Array.isArray(value)">
              <span v-for="item in value" :key="item" class="tag">{{ item }}</span>
            </span>
            <span v-else-if="typeof value === 'boolean'">
              {{ value ? 'Yes' : 'No' }}
            </span>
            <span v-else>{{ value }}</span>
          </div>
        </div>

        <div class="talent-footer">
          <small class="text-muted">
            Added: {{ formatDate(talent.created_time) }}
            <span v-if="talent.last_edited_time !== talent.created_time">
              • Updated: {{ formatDate(talent.last_edited_time) }}
            </span>
          </small>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" class="btn btn-secondary" :disabled="loadingMore">
        <span v-if="loadingMore" class="spinner small"></span>
        {{ loadingMore ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script>
import talentService from '../services/talentService.js'

export default {
  name: 'TalentPool',
  data() {
    return {
      // State
      loading: true,
      loadingMore: false,
      submitting: false,
      error: null,

      // Data
      talents: [],
      schema: null,
      databaseTitle: 'Talent Pool',
      hasMore: false,
      nextCursor: null,

      // Form
      showAddForm: false,
      editingTalent: null,
      formData: {},
      formErrors: {},
    }
  },

  computed: {
    formFields() {
      if (!this.schema) return []
      return talentService.generateFormFields(this.schema)
    },
  },

  async mounted() {
    await this.initialize()
  },

  methods: {
    async initialize() {
      try {
        this.loading = true
        this.error = null

        // Load schema and talents in parallel
        const [schemaResult, talentsResult] = await Promise.all([
          talentService.getDatabaseSchema(),
          talentService.getAllTalents({ pageSize: 20 })
        ])

        this.schema = schemaResult
        this.databaseTitle = schemaResult.title || 'Talent Pool'
        this.talents = talentsResult.results || []
        this.hasMore = talentsResult.has_more || false
        this.nextCursor = talentsResult.next_cursor

      } catch (error) {
        console.error('Failed to initialize:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async refreshSchema() {
      try {
        this.loading = true
        this.schema = await talentService.getDatabaseSchema(true)
        this.databaseTitle = this.schema.title || 'Talent Pool'
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async loadMore() {
      if (!this.hasMore || this.loadingMore) return

      try {
        this.loadingMore = true
        const result = await talentService.getAllTalents({
          pageSize: 20,
          startCursor: this.nextCursor
        })

        this.talents.push(...(result.results || []))
        this.hasMore = result.has_more || false
        this.nextCursor = result.next_cursor

      } catch (error) {
        this.error = error.message
      } finally {
        this.loadingMore = false
      }
    },

    async retryLoad() {
      await this.initialize()
    },

    // Form methods
    editTalent(talent) {
      this.editingTalent = talent
      this.formData = { ...talent }
      this.formErrors = {}
    },

    closeForm() {
      this.showAddForm = false
      this.editingTalent = null
      this.formData = {}
      this.formErrors = {}
    },

    async submitForm() {
      try {
        this.submitting = true
        this.formErrors = {}

        // Validate form data
        const validation = talentService.validateFormData(this.formData, this.schema)
        if (!validation.isValid) {
          this.formErrors = validation.errors
          return
        }

        let result
        if (this.editingTalent) {
          // Update existing talent
          result = await talentService.updateTalent(this.editingTalent.id, this.formData)

          // Update talent in list
          const index = this.talents.findIndex(t => t.id === this.editingTalent.id)
          if (index !== -1) {
            this.talents[index] = result.result
          }
        } else {
          // Create new talent
          result = await talentService.createTalent(this.formData)

          // Add to beginning of list
          this.talents.unshift(result.result)
        }

        this.closeForm()

      } catch (error) {
        this.error = error.message
      } finally {
        this.submitting = false
      }
    },

    async deleteTalent(id) {
      if (!confirm('Are you sure you want to delete this talent profile?')) {
        return
      }

      try {
        await talentService.deleteTalent(id)
        this.talents = this.talents.filter(t => t.id !== id)
      } catch (error) {
        this.error = error.message
      }
    },

    // Multi-select methods
    getSelectedTags(fieldName) {
      const value = this.formData[fieldName]
      if (Array.isArray(value)) return value
      if (typeof value === 'string' && value.includes(',')) {
        return value.split(',').map(s => s.trim()).filter(s => s)
      }
      return value ? [value] : []
    },

    addTag(fieldName, event) {
      const value = event.target.value
      if (!value) return

      const current = this.getSelectedTags(fieldName)
      if (!current.includes(value)) {
        this.formData[fieldName] = [...current, value]
      }
      event.target.value = ''
    },

    addCustomTag(fieldName, event) {
      const value = event.target.value.trim()
      if (!value) return

      const current = this.getSelectedTags(fieldName)
      if (!current.includes(value)) {
        this.formData[fieldName] = [...current, value]
      }
      event.target.value = ''
    },

    removeTag(fieldName, tag) {
      const current = this.getSelectedTags(fieldName)
      this.formData[fieldName] = current.filter(t => t !== tag)
    },

    // Utility methods
    getSkillsArray(skills) {
      if (Array.isArray(skills)) return skills
      if (typeof skills === 'string') {
        return skills.split(',').map(s => s.trim()).filter(s => s)
      }
      return []
    },

    getDynamicFields(talent) {
      const staticFields = ['id', 'Name', 'Email', 'Phone', 'Skills', 'Portfolio Link', 'created_time', 'last_edited_time']
      return Object.entries(talent).filter(([key]) => !staticFields.includes(key) && key !== '')
    },

    formatLabel(text) {
      return talentService.formatLabel(text)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    },
  }
}
</script>

<style scoped>
.talent-pool {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover:not(:disabled) {
  background: #d5dbdb;
}

.btn-ghost {
  background: transparent;
  color: #7f8c8d;
  padding: 0.5rem;
}

.btn-ghost:hover {
  background: #f8f9fa;
  color: #2c3e50;
}

.btn-danger:hover {
  color: #e74c3c;
}

.btn-link {
  background: none;
  color: #3498db;
  padding: 0;
  text-decoration: underline;
}

/* Loading and Error States */
.loading {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.error-banner {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #c0392b;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.spinner.small {
  width: 16px;
  height: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

/* Form */
.talent-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
}

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #e74c3c;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Multi-select */
.multiselect-container {
  border: 2px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tag-input {
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  padding: 0.5rem;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  width: auto;
}

.field-error {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

/* Talent Grid */
.talent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.talent-card {
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.talent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.talent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.talent-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.talent-actions {
  display: flex;
  gap: 0.5rem;
}

.talent-details {
  space-y: 0.75rem;
}

.detail-item {
  margin-bottom: 0.75rem;
}

.detail-item strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.detail-item a {
  color: #3498db;
  text-decoration: none;
}

.detail-item a:hover {
  text-decoration: underline;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.skill-tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.talent-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f8f9fa;
}

.text-muted {
  color: #7f8c8d;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

/* Load More */
.load-more {
  text-align: center;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .talent-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    align-items: center;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .talent-header {
    flex-direction: column;
    gap: 1rem;
  }

  .talent-actions {
    align-self: flex-end;
  }
}

.no-schema {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.icon {
  font-size: 1rem;
}
</style>
