<template>
  <div
    v-if="alertState.isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      @click="handleCancel"
    ></div>

    <!-- Dialog -->
    <div
      class="relative bg-white/5 border border-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
    >
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-200">
          {{ alertState.title }}
        </h3>
        <p
          v-if="alertState.description"
          class="text-sm text-gray-400 mt-2 leading-relaxed"
        >
          {{ alertState.description }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <!-- Cancel Button -->
        <button
          v-if="alertState.showCancel"
          @click="handleCancel"
          class="px-4 py-2 cursor-pointer text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          {{ alertState.cancelText }}
        </button>

        <!-- Confirm Button -->
        <button
          @click="handleConfirm"
          :class="[
            'px-4 cursor-pointer py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 transition-colors',
            alertState.variant === 'destructive'
              ? 'text-white bg-red-600 border border-red-600 hover:bg-red-700 focus:ring-red-500'
              : alertState.variant === 'warning'
              ? 'text-white bg-yellow-600 border border-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
              : 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          ]"
        >
          {{ alertState.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAlert } from "@/composables/useAlert";

const { alertState, handleConfirm, handleCancel } = useAlert();
</script>
