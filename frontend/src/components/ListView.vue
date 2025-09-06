<template>
  <div class="space-y-6">
    <!-- Loading State - show until we have both schema and items ready -->
    <LoadingSkeleton v-if="loading || (!schema || items.length === 0)" :count="6"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />

    <!-- Content (only show when we have both schema and items ready) -->
    <div v-else-if="schema && items.length > 0" class="space-y-6">
      <!-- Item Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Data Cards -->
        <CardView v-for="item in items" :key="item.id" :item="item" :schema="schema" @deleteItem="handleDeleteItem" />

        <!-- Loading More Skeletons -->
        <LoadingSkeleton v-if="loadingMore" :count="3" class="contents" />
      </div>

    </div>

    <!-- Empty State (shown when no items OR no schema, and not loading) -->
    <EmptyState v-else-if="showEmptyState" @add-item="goToAdd" />

    <!-- Load More -->
    <LoadMoreButton v-if="hasMore && !loading" :loading="loadingMore" @load-more="loadMore" />
  </div>
</template>

<script setup>
import LoadingSkeleton from './LoadingSkeleton.vue'
import LoadMoreButton from './LoadMoreButton.vue'
import CardView from './CardView.vue'
import EmptyState from './EmptyState.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  schema: {
    type: Object,
    default: null
  },
  hasMore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deleteItem', 'loadMore'])

// Combined condition for empty state - show when no items OR no schema, and not loading
const showEmptyState = computed(() => (props.items.length === 0 || !props.schema) && !props.loading)

const goToAdd = () => {
  router.push('/add')
}

const handleDeleteItem = (id) => {
  emit('deleteItem', id)
}
</script>
