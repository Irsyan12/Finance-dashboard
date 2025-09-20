<script setup>
import { useAuth } from "./composables/useAuth";
const { user, getUser } = useAuth();

getUser();
</script>

<template>
  <router-view />
</template>

<style scoped></style>
