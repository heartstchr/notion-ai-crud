<template>
  <div :class="containerClass">
    <div v-for="i in count" :key="`skeleton-${i}`"
      class="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg shadow-lg flex flex-col h-full relative">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>
      <div class="relative z-10">

        <!-- Action Buttons Skeleton -->
        <div class="flex justify-end items-start mb-3">
          <div class="flex gap-2">
            <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        <!-- Avatar and Title Skeleton -->
        <div class="mb-4 flex md:flex-row flex-col gap-2">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div class="space-y-2">
            <div class="h-8 bg-gray-200 rounded animate-pulse" style="width: 80%;"></div>
          </div>
        </div>

        <!-- Contact Fields Skeleton -->
        <div class="mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div class="flex items-center justify-start bg-blue-50 rounded-lg p-1 gap-1">
              <div class="w-4 h-4 bg-blue-200 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
            </div>
            <div class="flex items-center justify-start bg-blue-50 rounded-lg p-1 gap-1">
              <div class="w-4 h-4 bg-green-200 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 70%;"></div>
            </div>
          </div>
        </div>

        <!-- Number Fields Skeleton -->
        <div class="mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex flex-col items-center justify-between bg-green-50 rounded-lg p-1 border border-green-200">
              <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 50%;"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 30%;"></div>
            </div>
            <div class="flex flex-col items-center justify-between bg-green-50 rounded-lg p-1 border border-green-200">
              <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 40%;"></div>
            </div>
          </div>
        </div>

        <!-- Dynamic Fields Skeleton -->
        <div class="space-y-3 flex-1">
          <div v-for="j in 3" :key="`field-${j}`" class="space-y-1 pt-2 border-b border-gray-100 last:border-b-0">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 40%;"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 70%;"></div>
          </div>
        </div>

        <!-- Timestamps Skeleton -->
        <div class="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
          <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 40%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 6
  },
  containerClass: {
    type: String,
    default: ''
  }
})
</script>
