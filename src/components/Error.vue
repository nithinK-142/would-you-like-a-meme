<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<template>
  <p class="p-4 mt-16 text-red-500">{{ message }}</p>
</template>
