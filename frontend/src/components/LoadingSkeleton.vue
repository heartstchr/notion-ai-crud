<template>
    <div :class="containerClass">
        <div v-for="i in count" :key="`skeleton-${i}`"
            class="p-4 border-2 border-amber-100 rounded-lg shadow-lg space-y-3">
            <!-- Card Header Skeleton (Edit/Delete buttons) -->
            <div class="flex justify-end items-start mb-3">
                <div class="flex gap-2">
                    <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div class="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            <!-- Title Fields Skeleton (h2 tags) -->
            <div class="mb-4 space-y-2">
                <div class="h-8 bg-gray-200 rounded animate-pulse" style="width: 80%;"></div>
            </div>

            <!-- Dynamic Fields Container -->
            <div class="space-y-3">
                <!-- Contact Fields Skeleton -->
                <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-blue-200 rounded animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 70%;"></div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 bg-green-200 rounded animate-pulse"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
                    </div>
                </div>

                <!-- Number Fields Group Skeleton -->
                <div class="space-y-3 py-2 border-b border-gray-100">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 50%;"></div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-orange-200 rounded animate-pulse"></div>
                                <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 20%;"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 45%;"></div>
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-4 bg-orange-200 rounded animate-pulse"></div>
                                <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 20%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-purple-200 rounded animate-pulse"></div>
                            <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 20%;"></div>
                        </div>
                    </div>
                </div>

                <!-- Skills Section Skeleton -->
                <div class="space-y-1 py-2 border-b border-gray-100">
                    <div class="text-sm font-medium text-gray-700 mb-2">
                        <div class="w-4 h-4 bg-gray-200 rounded animate-pulse inline-block mr-2"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse inline-block" style="width: 30%;"></div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <div class="px-3 py-1.5 bg-gray-100 rounded-full animate-pulse">
                            <div class="h-3 bg-gray-200 rounded" style="width: 40px;"></div>
                        </div>
                        <div class="px-3 py-1.5 bg-gray-100 rounded-full animate-pulse">
                            <div class="h-3 bg-gray-200 rounded" style="width: 35px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Portfolio Link Skeleton -->
                <div class="space-y-1 py-2 border-b border-gray-100">
                    <div class="text-sm font-medium text-gray-700 mb-2">
                        <div class="w-4 h-4 bg-gray-200 rounded animate-pulse inline-block mr-2"></div>
                        <div class="h-4 bg-gray-200 rounded animate-pulse inline-block" style="width: 50%;"></div>
                    </div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 80%;"></div>
                </div>

                <!-- Highest Qualification Skeleton -->
                <div class="space-y-1 py-2 border-b border-gray-100">
                    <div class="text-sm font-medium text-gray-700 mb-2">
                        <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 60%;"></div>
                    </div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse" style="width: 30%;"></div>
                </div>

                <!-- Date Skeleton -->
                <div class="text-xs text-gray-500">
                    <div class="h-3 bg-gray-200 rounded animate-pulse" style="width: 50%;"></div>
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
