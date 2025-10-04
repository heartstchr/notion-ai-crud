<template>
  <div :class="containerClass">
    <!-- Card View Skeleton -->
    <div v-if="type === 'card'" v-for="i in count" :key="`card-skeleton-${i}`"
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
            <!-- Boolean Fields Skeleton -->
            <div class="flex gap-2">
              <div class="h-6 bg-green-200 rounded-full animate-pulse" style="width: 60px;"></div>
              <div class="h-6 bg-blue-200 rounded-full animate-pulse" style="width: 80px;"></div>
            </div>
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

    <!-- Table View Skeleton -->
    <div v-else-if="type === 'table'" class="relative">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>

      <div class="relative z-10 bg-white rounded-lg overflow-hidden">
        <!-- Table Header Skeleton -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="h-6 bg-gray-200 rounded animate-pulse" style="width: 120px;"></div>
        </div>

        <!-- Table Content Skeleton -->
        <div class="scrollbar-auto-hide">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 80px;"></div>
                </th>
                <th class="px-6 py-3 text-left">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 100px;"></div>
                </th>
                <th class="px-6 py-3 text-left">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 90px;"></div>
                </th>
                <th class="px-6 py-3 text-left">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 120px;"></div>
                </th>
                <th class="px-6 py-3 text-left">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60px;"></div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="i in count" :key="`table-row-${i}`" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 120px;"></div>
                      <div class="flex gap-2">
                        <div class="h-5 bg-green-200 rounded-full animate-pulse" style="width: 50px;"></div>
                        <div class="h-5 bg-blue-200 rounded-full animate-pulse" style="width: 60px;"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 140px;"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 80px;"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-1">
                    <div class="h-5 bg-purple-200 rounded-full animate-pulse" style="width: 60px;"></div>
                    <div class="h-5 bg-purple-200 rounded-full animate-pulse" style="width: 70px;"></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex gap-2 justify-end">
                    <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Form Skeleton (Edit/Add) -->
    <div v-else-if="type === 'form'" class="relative">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>

      <div class="relative z-10 bg-white rounded-lg p-6">
        <!-- Form Fields Skeleton -->
        <div class="space-y-6">
          <!-- Title Field -->
          <div>
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 60px;"></div>
            <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Contact Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 80px;"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 100px;"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Number Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 70px;"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 90px;"></div>
              <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <!-- Select Fields -->
          <div>
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 110px;"></div>
            <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Multi-select Fields -->
          <div>
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 130px;"></div>
            <div class="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Text Area -->
          <div>
            <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 140px;"></div>
            <div class="h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <div class="h-10 bg-gray-200 rounded animate-pulse" style="width: 80px;"></div>
            <div class="h-10 bg-gray-200 rounded animate-pulse" style="width: 100px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Default Skeleton (fallback) -->
    <div v-else v-for="i in count" :key="`default-skeleton-${i}`"
      class="bg-white hover:shadow-lg transition-shadow p-4 rounded-lg shadow-lg flex flex-col h-full relative">
      <!-- Gradient Border with Drop Shadow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 rounded-lg p-0.5 shadow-lg"
        style="filter: drop-shadow(0 10px 25px rgba(0, 144, 247, 0.3)) drop-shadow(0 4px 6px rgba(186, 98, 252, 0.2)) drop-shadow(0 1px 3px rgba(242, 65, 107, 0.2)) drop-shadow(0 0 0 rgba(245, 86, 0, 0.1));">
        <div class="bg-white rounded-lg h-full w-full"></div>
      </div>
      <div class="relative z-10">
        <div class="h-6 bg-gray-200 rounded animate-pulse mb-4" style="width: 60%;"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 80%;"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse mb-2" style="width: 70%;"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 90%;"></div>
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
  },
  type: {
    type: String,
    default: 'card',
    validator: (value) => ['card', 'table', 'form'].includes(value)
  }
})
</script>
