<script setup>
import {
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BanknotesIcon,
  DocumentTextIcon,
  PencilIcon,
  ClockIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  for: {
    type: String,
    default: "",
  },
  LabelIcon: {
    type: [String, Object, Function], // Allow both string and component
    required: false,
  },
  label: {
    type: String,
    default: "",
  },
});

// Map string names to actual icon components
const iconMap = {
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BanknotesIcon,
  DocumentTextIcon,
  PencilIcon,
  ClockIcon,
};

// Get the actual icon component
const getIconComponent = () => {
  if (typeof props.LabelIcon === "string") {
    return iconMap[props.LabelIcon];
  }
  return props.LabelIcon;
};
</script>

<template>
  <div>
    <label :for="for" class="block text-sm font-medium text-gray-200 mb-2">
      <component
        :is="getIconComponent()"
        v-if="LabelIcon"
        class="w-4 h-4 inline mr-1"
      />
      {{ label }}
    </label>
  </div>
</template>

<style scoped></style>
