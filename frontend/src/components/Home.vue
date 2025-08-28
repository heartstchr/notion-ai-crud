<script setup>
import { ref, onMounted } from 'vue'
import { getTodos, createTodo, updateTodo } from '../services/notionService'

defineProps({
  msg: {
    type: String,
    required: true,
  },
})

const todos = ref([])
const newTodo = ref('')
const loading = ref(false)
const error = ref('')

async function fetchTodos() {
  loading.value = true
  error.value = ''
  try {
    const data = await getTodos()
    // Map Notion results to local format
    todos.value = (data.results || []).map(page => ({
      id: page.id,
      title: page.properties?.Title?.title?.[0]?.plain_text || '',
      description: page.properties?.Description?.rich_text?.[0]?.plain_text || '',
      status: page.properties?.Status?.select?.name || '',
      priority: page.properties?.Priority?.select?.name || '',
      text: page.properties?.Text?.rich_text?.[0]?.plain_text || '',
    }))
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function addTodo() {
  if (newTodo.value.trim()) {
    loading.value = true
    error.value = ''
    try {
      await createTodo(newTodo.value)
      newTodo.value = ''
      await fetchTodos()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }
}

async function toggleTodo(todo) {
  loading.value = true
  error.value = ''
  try {
    await updateTodo(todo.id, {
      properties: {
        Done: { checkbox: !todo.done },
      },
    })
    await fetchTodos()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>
    <form @submit.prevent="addTodo">
      <InputText v-model="newTodo" placeholder="Add a new todo" />
      <Button type="submit" :disabled="loading">Add</Button>
    </form>
    <div v-if="error" style="color: red">{{ error }}</div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <Checkbox v-model="todo.done" :inputId="todo.id" name="category" :value="todo.done"
          @change="() => toggleTodo(todo)" />
        <label :for="todo.id">{{ todo.title }}</label>
      </li>
    </ul>
    <div v-if="loading">Loading...</div>
  </div>
</template>
