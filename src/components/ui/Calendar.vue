<template>
  <div ref="calendarContainer" class="relative w-full select-none">
    <!-- Input Field -->
    <div class="relative">
      <input
        ref="inputRef"
        :value="displayValue"
        :placeholder="placeholder"
        readonly
        @click="toggleCalendar"
        class="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 hover:border-white/30 cursor-pointer"
      />
      <CalendarIcon
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
      />
    </div>

    <!-- Calendar Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="[
          'absolute z-50 bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-4 w-80 transition-all duration-200',
          position === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full',
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="previousMonth"
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <ChevronLeftIcon class="w-4 h-4" />
          </button>

          <div class="text-white font-medium text-sm tracking-wide">
            {{ getMonthName(currentMonth) }} {{ currentYear }}
          </div>

          <button
            @click="nextMonth"
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Weekdays -->
        <div class="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-2">
          <div v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in calendarDays"
            :key="date.key"
            type="button"
            @click="selectDate(date)"
            :disabled="date.disabled"
            :class="[
              'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
              {
                'text-gray-600 cursor-not-allowed opacity-40': date.disabled,
                'text-gray-500': date.otherMonth && !date.disabled,
                'text-gray-300 hover:bg-white/10 hover:text-white':
                  !date.otherMonth && !date.disabled && !date.selected && !date.today,
                'bg-white/10 text-blue-400 ring-1 ring-blue-500/30':
                  date.today && !date.selected,
                'bg-blue-500 text-white shadow-md hover:shadow-lg':
                  date.selected,
              },
            ]"
          >
            {{ date.day }}
          </button>
        </div>

        <!-- Today Button -->
        <div class="mt-4 border-t border-white/10 pt-3">
          <button
            @click="selectToday"
            type="button"
            class="w-full px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            Today
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  modelValue: {
    type: [Date, String],
    default: null,
  },
  placeholder: {
    type: String,
    default: "Select date",
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref(null);
const dropdownRef = ref(null);
const calendarContainer = ref(null);
const isOpen = ref(false);
const position = ref("bottom"); // 'top' or 'bottom'

const selectedDate = ref(null);
const currentDate = ref(new Date());

const today = new Date();
today.setHours(0, 0, 0, 0);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (
    calendarContainer.value &&
    !calendarContainer.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};

// Detect available space & toggle position
const toggleCalendar = () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    const rect = inputRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 320; // approximate height of calendar

    position.value = spaceBelow < dropdownHeight ? "top" : "bottom";
  }
};

const currentMonth = computed(() => currentDate.value.getMonth());
const currentYear = computed(() => currentDate.value.getFullYear());
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    const day = new Date(year, month, i - firstDayOfWeek + 1);
    days.push({
      key: `prev-${i}`,
      day: day.getDate(),
      otherMonth: true,
      disabled: true,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected =
      selectedDate.value &&
      date.toDateString() === selectedDate.value.toDateString();
    const isFuture = date > today;

    days.push({
      key: `current-${d}`,
      day: d,
      otherMonth: false,
      disabled: isFuture,
      today: isToday,
      selected: isSelected,
    });
  }

  return days;
});

const getMonthName = (month) =>
  new Date(2000, month, 1).toLocaleString("default", { month: "long" });

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const displayValue = computed(() =>
  selectedDate.value ? formatDate(selectedDate.value) : ""
);

const selectDate = (dateObj) => {
  if (dateObj.disabled) return;
  selectedDate.value = new Date(
    currentYear.value,
    currentMonth.value,
    dateObj.day
  );
  emit("update:modelValue", formatDate(selectedDate.value));
  isOpen.value = false;
};

const selectToday = () => {
  selectedDate.value = new Date(today);
  emit("update:modelValue", formatDate(today));
  isOpen.value = false;
};

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};
</script>
