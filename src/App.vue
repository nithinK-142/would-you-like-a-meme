<script setup lang="ts">
import OverlayAll from "./components/OverlayAll.vue";
import Pop from "./components/Pop.vue";
import { ref } from "vue";
const date = ref();
</script>

<template>
  <main class="flex flex-col items-center p-6 space-y-6">
    <h1 class="text-2xl font-semibold text-center">PrimeVue v3</h1>
    <OverlayAll />
    <Calendar v-model="date" />
    <Pop />
  </main>
</template>
