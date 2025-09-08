<template>
  <div class="flex gap-4 items-center mb-6">
    <!-- Search Input Skeleton -->
    <div class="relative flex-1">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>

      <div class="relative z-10">
        <div class="relative">
          <div class="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Buttons Skeleton -->
    <div class="flex-shrink-0 flex gap-2">
      <!-- Verified Filter Skeleton -->
      <div class="relative">
        <!-- Gradient Border with Drop Shadow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
          style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
          <div class="bg-white rounded-lg h-full w-full"></div>
        </div>

        <div class="relative z-10 px-3 py-2.5 rounded-lg flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-300 rounded animate-pulse" style="width: 60px;"></div>
        </div>
      </div>

      <!-- Available Filter Skeleton -->
      <div class="relative">
        <!-- Gradient Border with Drop Shadow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
          style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
          <div class="bg-white rounded-lg h-full w-full"></div>
        </div>

        <div class="relative z-10 px-3 py-2.5 rounded-lg flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-300 rounded animate-pulse" style="width: 70px;"></div>
        </div>
      </div>
    </div>

    <!-- View Toggle Skeleton -->
    <div class="flex-shrink-0">
      <div class="relative">
        <!-- Gradient Border with Drop Shadow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
          style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
          <div class="bg-gray-100 rounded-lg h-full w-full"></div>
        </div>

        <div class="relative z-10 flex bg-gray-100 rounded-lg p-1">
          <div class="px-3 py-2 rounded-md flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-300 rounded animate-pulse" style="width: 50px;"></div>
          </div>
          <div class="px-3 py-2 rounded-md flex items-center gap-2">
            <div class="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-300 rounded animate-pulse" style="width: 60px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed - this is a static skeleton component
</script>
