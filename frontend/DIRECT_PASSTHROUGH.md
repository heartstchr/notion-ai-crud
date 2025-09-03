# Direct PassThrough Implementation

## Overview

This project now uses direct PassThrough configuration instead of global button styling in main.js. This approach provides better granular control, cleaner code, and more maintainable button styling.

## Implementation

### 1. **useButtonPT Composable**

Located at `src/composables/useButtonPT.js`

```javascript
import { computed } from 'vue'

export function useButtonPT(severity = 'primary', size = 'small', isIconOnly = false) {
  const buttonPT = computed(() => ({
    root: {
      class: [
        getSizeClasses(size),
        getSeverityClasses(severity),
        'rounded-lg flex items-center justify-center',
        'transition-all duration-300 hover:scale-105 hover:-translate-y-0.5',
        'shadow-lg hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      ],
    },
    icon: {
      class: isIconOnly ? 'm-0' : 'mr-2',
    },
  }))

  return { buttonPT }
}
```

### 2. **IconButton Component**

Located at `src/components/IconButton.vue`

```vue
<template>
  <Button :pt="buttonPT" :icon="icon" @click="$emit('click')" />
</template>

<script setup>
import { useButtonPT } from '../composables/useButtonPT.js'

const props = defineProps({
  icon: { type: String, required: true },
  severity: { type: String, default: 'primary' },
  size: { type: String, default: 'small' },
})

const { buttonPT } = useButtonPT(props.severity, props.size, true)
defineEmits(['click'])
</script>
```

### 3. **Usage in Components**

#### **Direct PassThrough (Manual)**

```vue
<template>
  <Button @click="editItem" :pt="editButtonPT" :icon="'pi pi-pencil'" />
</template>

<script setup>
import { useButtonPT } from '../composables/useButtonPT.js'

const { buttonPT: editButtonPT } = useButtonPT('primary', 'small', true)
</script>
```

#### **IconButton Component (Recommended)**

```vue
<template>
  <div class="flex gap-2">
    <IconButton icon="pi pi-pencil" severity="primary" @click="editItem" />
    <IconButton icon="pi pi-trash" severity="danger" @click="deleteItem" />
  </div>
</template>

<script setup>
import IconButton from './IconButton.vue'
</script>
```

## Benefits

### ✅ **Granular Control**

- Override styles per button instance
- Dynamic styling based on props or state
- No global configuration conflicts

### ✅ **Better Performance**

- Only apply styles where needed
- Reduced CSS bundle size
- Efficient rendering

### ✅ **Cleaner Code**

- Self-contained button styling
- No global configuration complexity
- Easier to understand and maintain

### ✅ **Flexibility**

- Easy to create custom button variants
- Simple to modify individual buttons
- No need to update global config

### ✅ **Testing**

- Test individual button styles
- Mock PassThrough configurations
- Better unit test coverage

## Migration from Global Configuration

### **Before (Global in main.js)**

```javascript
// main.js
app.use(PrimeVue, {
  pt: {
    button: {
      primary: {
        root: { class: 'bg-blue-600 hover:bg-blue-700 text-white' }
      }
    }
  }
})

// Component
<Button severity="primary">Click me</Button>
```

### **After (Direct PassThrough)**

```javascript
// main.js - No button configuration needed

// Component
<Button :pt="buttonPT">Click me</Button>

// Or using IconButton component
<IconButton icon="pi pi-plus" severity="primary" @click="addItem" />
```

## Available Severities

- **primary**: Blue (#2563eb)
- **secondary**: Gray (#6b7280)
- **success**: Green (#16a34a)
- **info**: Cyan (#0891b2)
- **warning**: Amber (#d97706)
- **danger**: Red (#dc2626)

## Available Sizes

- **small**: px-3 py-1.5 text-sm
- **default**: px-4 py-2
- **large**: px-6 py-3 text-lg

## Examples

### **Form Buttons**

```vue
<template>
  <div class="flex justify-end gap-3">
    <Button :pt="cancelButtonPT" @click="cancel">Cancel</Button>
    <Button :pt="submitButtonPT" @click="submit">Submit</Button>
  </div>
</template>

<script setup>
const { buttonPT: cancelButtonPT } = useButtonPT('secondary', 'default', false)
const { buttonPT: submitButtonPT } = useButtonPT('primary', 'default', false)
</script>
```

### **Action Buttons**

```vue
<template>
  <div class="flex gap-2">
    <IconButton icon="pi pi-pencil" severity="primary" @click="edit" />
    <IconButton icon="pi pi-trash" severity="danger" @click="delete" />
    <IconButton icon="pi pi-eye" severity="info" @click="view" />
  </div>
</template>
```

### **Loading Buttons**

```vue
<template>
  <Button :pt="loadingButtonPT" :loading="isLoading" :disabled="isLoading">
    {{ isLoading ? 'Loading...' : 'Save' }}
  </Button>
</template>

<script setup>
const { buttonPT: loadingButtonPT } = useButtonPT('primary', 'default', false)
</script>
```

This approach provides a clean, maintainable, and flexible solution for button styling that follows modern Vue.js best practices.
