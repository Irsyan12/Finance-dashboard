<script setup>
import { watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "destructive"].includes(value),
  },
});

const emit = defineEmits(["confirm", "cancel", "close"]);

const onConfirm = () => {
  emit("confirm");
  emit("close");
};

const onCancel = () => {
  emit("cancel");
  emit("close");
};

const handleOverlayClick = () => {
  emit("close");
};

// Prevent body scroll when dialog is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="handleOverlayClick"
    >
      <!-- Overlay -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        :class="isOpen ? 'animate-in fade-in-0' : 'animate-out fade-out-0'"
      ></div>

      <!-- Dialog Content -->
      <div
        class="relative z-50 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
        :class="
          isOpen
            ? 'animate-in zoom-in-95 fade-in-0'
            : 'animate-out zoom-out-95 fade-out-0'
        "
        @click.stop
      >
        <!-- Header -->
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-white">
            {{ title }}
          </h2>
          <p v-if="description" class="text-sm text-gray-400 mt-2">
            {{ description }}
          </p>
        </div>

        <!-- Content Slot -->
        <div class="mb-6">
          <slot></slot>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end">
          <button
            @click="onCancel"
            class="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {{ cancelText }}
          </button>
          <button
            @click="onConfirm"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes animate-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes animate-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes fade-in-0 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out-0 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes zoom-out-95 {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.95);
  }
}

.animate-in {
  animation: animate-in 0.2s ease-out forwards;
}

.animate-out {
  animation: animate-out 0.2s ease-out forwards;
}

.fade-in-0 {
  animation: fade-in-0 0.2s ease-out forwards;
}

.fade-out-0 {
  animation: fade-out-0 0.2s ease-out forwards;
}

.zoom-in-95 {
  animation: zoom-in-95 0.2s ease-out forwards;
}

.zoom-out-95 {
  animation: zoom-out-95 0.2s ease-out forwards;
}
</style>
