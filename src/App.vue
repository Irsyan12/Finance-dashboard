<script setup>
import { useAuth } from "./services/composables/useAuth";
import Sonner from "./components/ui/sonner.vue";

const { user, getUser } = useAuth();

getUser();
</script>

<template>
  <div>
    <router-view />
    <Sonner />
    <GlobalAlert />
  </div>
</template>

<style scoped></style>
