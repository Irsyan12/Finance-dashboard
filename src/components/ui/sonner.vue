<script setup>
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { toasts, removeToast } from "@/services/toast";

const getIcon = (type) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
  };
  return icons[type] || InformationCircleIcon;
};

const getClasses = (type) => {
  const classes = {
    success: "bg-blue-950 border-blue-950",
    error: "bg-red-600 border-red-600",
    info: "bg-blue-950 border-blue-950",
    warning: "bg-yellow-600 border-yellow-600",
  };
  return classes[type] || "bg-gray-600 border-gray-500";
};
</script>

<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'min-w-72 max-w-md p-4 rounded-lg shadow-lg border text-white transform transition-all duration-300',
          getClasses(t.type),
          t.visible
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95',
        ]"
      >
        <div class="flex items-start space-x-3">
          <component
            :is="getIcon(t.type)"
            class="w-5 h-5 mt-0.5 flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ t.message }}</p>
            <p v-if="t.description" class="text-xs opacity-90 mt-1">
              {{ t.description }}
            </p>
          </div>
          <button
            @click="removeToast(t.id)"
            class="text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
